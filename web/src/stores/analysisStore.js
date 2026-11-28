
import { create } from "zustand";
import api from "../api/api";

const useAnalysisStore = create((set) => ({
  loading: false,
  error: null,

  analysis: null,
  searchRequestId: null,
  analysisHistory: [],
  pendingAnalyses: [],

  // Criar análise de imagem
  createAnalysis: async (image) => {
    set({ loading: true, error: null });

    try {
      const payload = {
        image,
      };

      const response = await api.post("analysis/", payload);
      const data = response.data;

      set({
        analysis: data.analysis_results,
        searchRequestId: data.search_request_id,
        loading: false,
      });

      return data;
    } catch (err) {
      set({
        error: err.message || "Erro ao analisar imagem",
        loading: false,
      });

      throw err;
    }
  },

  // Buscar histórico de análises
  fetchAnalysisHistory: async (userId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("analysis/", {
        params: {
          userId,
        },
      });

      const data = response.data;

      set({
        analysisHistory: data,
        loading: false,
      });

      return data;
    } catch (err) {
      set({
        error: err.message || "Erro ao buscar histórico de análises",
        loading: false,
      });

      throw err;
    }
  },

  // Buscar análise por ID
  fetchAnalysisById: async (searchRequestId, userId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`analysis/${searchRequestId}/`, {
        params: {
          userId,
        },
      });

      const data = response.data;

      set({
        analysis: data.analysis_results.map((result) => ({
          ...result,
          image: data.image,
        })),
        searchRequestId: data.search_request_id,
        loading: false,
      });

      return data;
    } catch (err) {
      set({
        error: err.message || "Erro ao buscar análise",
        loading: false,
      });

      throw err;
    }
  },

  // ==================== AÇÕES DO TÉCNICO AGRÍCOLA ====================

  // Buscar fila de análises pendentes para o técnico
  fetchPendingAnalyses: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("analysis/pending/");
      const data = response.data;

      set({
        pendingAnalyses: Array.isArray(data) ? data : [],
        loading: false,
        error: null,
      });

      return data;
    } catch (err) {
      const statusCode = err.response?.status;

      const mensagemErro =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        (statusCode === 401
          ? "Sua sessão expirou. Faça login novamente."
          : statusCode === 403
            ? "Seu cadastro técnico ainda não foi aprovado. Aguarde a aprovação para acessar a fila."
            : !err.response
              ? "Não foi possível conectar à API. Verifique se o servidor está funcionando."
              : "Erro ao carregar a fila de trabalho.");

      set({
        pendingAnalyses: [],
        error: mensagemErro,
        loading: false,
      });

      throw err;
    }
  },

  // Enviar parecer técnico e validação do diagnóstico
  submitTechnicalReview: async (analysisId, reviewData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.patch(
        `analysis/${analysisId}/review/`,
        reviewData
      );

      const data = response.data;

      set({ loading: false });

      return data;
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Erro ao enviar o parecer técnico",
        loading: false,
      });

      throw err;
    }
  },
}));

export default useAnalysisStore;

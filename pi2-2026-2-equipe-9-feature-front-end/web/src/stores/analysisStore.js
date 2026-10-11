import { create } from "zustand";
import { analysisService } from "../services/analysisService";

const useAnalysisStore = create((set) => ({
  loading: false,
  error: null,

  analysis: null,
  searchRequestId: null,
  analysisHistory: [],

  // Rota 08: Enviar Imagem
  createAnalysis: async (base64Image, userId) => {
    set({ loading: true, error: null });

    try {
      const data = await analysisService.sendAnalysisImage(base64Image, userId);

      set({
        analysis: data.analysis_results,
        searchRequestId: data.search_request_id,
        loading: false,
      });

      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error_message ||
        err.response?.data?.detail ||
        "Não foi possível processar a imagem. Verifique a conexão e tente novamente.";

      set({
        error: errorMessage,
        loading: false,
      });

      throw err;
    }
  },

  // Rota 09: Histórico
  fetchAnalysisHistory: async (userId) => {
    set({ loading: true, error: null });

    try {
      const data = await analysisService.getUserHistory(userId);

      set({
        analysisHistory: data,
        loading: false,
      });

      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        "Erro ao carregar o histórico de análises.";

      set({
        error: errorMessage,
        loading: false,
      });

      throw err;
    }
  },

  // Rota 10: Detalhes por ID
  fetchAnalysisById: async (searchRequestId, userId) => {
    set({ loading: true, error: null });

    try {
      const data = await analysisService.getAnalysisDetails(searchRequestId, userId);

      // Associa a imagem devolvida aos resultados da análise
      const resultsWithImage = data.analysis_results?.map((result) => ({
        ...result,
        image: data.image,
      })) || [];

      set({
        analysis: resultsWithImage,
        searchRequestId: data.search_request_id,
        loading: false,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        "Erro ao buscar os detalhes da análise.";

      set({
        error: errorMessage,
        loading: false,
      });

      throw err;
    }
  },
}));

export default useAnalysisStore;
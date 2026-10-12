import api from "../api/api";

export const analysisService = {
  sendAnalysisImage: async (base64Image, userId) => {
    // Garante que a imagem mantenha o prefixo data:image/... se não o tiver
    let formattedBase64 = base64Image;
    if (typeof base64Image === "string" && !base64Image.startsWith("data:image")) {
      formattedBase64 = `data:image/jpeg;base64,${base64Image}`;
    }

    const response = await api.post("/analysis/", {
      image: formattedBase64,
      userId: userId,
    });
    return response.data;
  },

  getUserHistory: async (userId) => {
    const response = await api.get(`/analysis/`, {
      params: { userId: userId },
    });
    return response.data;
  },

  getAnalysisDetails: async (id, userId) => {
    const response = await api.get(`/analysis/${id}/`, {
      params: { userId: userId },
    });
    return response.data;
  },

  getAllAnalysis: async (requestedBy) => {
    const response = await api.get(`/analysis/all-analysis/`, {
      params: { requested_by: requestedBy },
    });
    return response.data;
  },
};

export default analysisService;
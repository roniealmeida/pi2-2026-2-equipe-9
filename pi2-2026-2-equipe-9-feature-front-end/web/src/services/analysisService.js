import api from "../api/api";

export const analysisService = {
  sendAnalysisImage: async (base64Image, userId) => {
    const response = await api.post("/analysis/", {
      image: base64Image,
      user_id: userId,
    });
    return response.data;
  },

  getUserHistory: async (userId) => {
    const response = await api.get(`/analysis/`, {
      params: { user_id: userId },
    });
    return response.data;
  },

  getAnalysisDetails: async (id, userId) => {
    const response = await api.get(`/analysis/${id}/`, {
      params: { user_id: userId },
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
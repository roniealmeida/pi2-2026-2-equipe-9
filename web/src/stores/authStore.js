import { create } from "zustand";
import api from "../api/api";

const formatPhoneE164 = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
};

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,

  login: async (telefone, password) => {
    set({ loading: true });

    try {
      const formattedPhone = formatPhoneE164(telefone);
      const response = await api.post("users/login/", {
        phone: formattedPhone,
        password: password,
      });

      const data = response.data;
      let userData = data.user || data;

      // BLINDAGEM NO LOGIN: Se tem registro profissional ou papel de técnico, garante o role "tecnico"
      const isTecnicoLogin = 
        Boolean(userData?.professional_register) || 
        userData?.role === "technician" || 
        userData?.role === "tecnico" || 
        userData?.tipo === "tecnico";

      userData = {
        ...userData,
        role: isTecnicoLogin ? "tecnico" : "produtor",
        professional_register: userData?.professional_register || (isTecnicoLogin ? "REG-TECNICO" : null)
      };

      set({
        user: userData,
        token: data.token,
        loading: false,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (payload) => {
    set({ loading: true });

    try {
      const isTecnicoForm = 
        Boolean(payload.professional_register) || 
        payload.role === "technician" || 
        payload.role === "tecnico" || 
        payload.tipo === "tecnico";

      const formattedPayload = {
        ...payload,
        phone: formatPhoneE164(payload.phone),
        role: isTecnicoForm ? "tecnico" : "produtor"
      };

      const response = await api.post("users/", formattedPayload);
      const data = response.data;

      let userData = data.user || data;

      userData = {
        ...userData,
        role: isTecnicoForm ? "tecnico" : "produtor",
        professional_register: payload.professional_register || userData.professional_register || (isTecnicoForm ? "REG-TECNICO" : null)
      };

      set({
        user: userData,
        token: data.token || useAuthStore.getState().token,
        loading: false,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
    });
  },
}));

export default useAuthStore;
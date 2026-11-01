import { create } from "zustand";
import api from "../api/api";

const formatPhoneE164 = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
};

const useAuthStore = create((set) => ({
  user: null,
  token: null,
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

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (payload) => {
    set({ loading: true });

    try {
      const formattedPayload = {
        ...payload,
        phone: formatPhoneE164(payload.phone),
      };

      const response = await api.post("users/", formattedPayload);
      const data = response.data;

      set({
        user: data.user,
        loading: false,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
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
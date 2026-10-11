import { create } from "zustand";
import api from "../api/api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,

  login: async (telefone, password) => {
    set({ loading: true });

    try {
      const response = await api.post("users/login/", {
        phone: telefone,
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
      const response = await api.post("users/", payload);

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

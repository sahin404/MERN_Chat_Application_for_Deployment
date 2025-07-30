import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BaseURL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";


export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  //Get User
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ user: res.data });
      get().connectSocket();
    } catch (err) {
      set({ user: null });
      console.log(err.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  //Sign Up User
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ user: res.data });
      toast.success("Account Created Successfully!");
      get().connectSocket();
    } catch {
      toast.error("Something Went Wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  //Log in user
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ user: res.data });
      toast.success("Logged in Successfully!");
      get().connectSocket();
    } catch {
      toast.error("Invalid Credentials");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  //Log Out user
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success("Account Logout Successfully!");
      get().disconnectSocket();
    } catch {
      toast.error("Something Went Wrong!");
    }
  },

  // Update Profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ user: res.data });
      toast.success("Updated Profile Successfully!");
    } catch (err) {
      console.log("Error in update profile:", err.message);
      toast.error(err.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || (get().socket && get().socket.connected)) return;
    const socket = io(BaseURL, {
      query: {
        id: user._id,
      }
    });

    socket.connect();
    set({ socket: socket });
    socket.on("onlineUsers", (ids)=>{
        set({onlineUsers:ids});
    })
    
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

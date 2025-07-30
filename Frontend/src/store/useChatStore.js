import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  isUsersLoading: false,
  isMessagesLoading: false,
  selectedUser: null,
  users: [],
  messages: [],

  //get users for sidebar
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      console.log("Error in chat store: ", err.message);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  //get message for selected user
  getSelectedUserMessages: async (selectedUserId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/get/${selectedUserId}`);
      set({ messages: res.data });
    } catch (err) {
      console.log("Error in chat store: ", err.message);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //send message for save
  sendMessage: async (data) => {
    try {
      const { selectedUser, messages } = get();
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data
      );
      set({ messages: [...messages, res.data] });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  //Subscribe to messages
  subscribesToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("sendNewMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        selectedUser._id === newMessage.senderId;
      if (!isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  //unsubscribe from messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("sendNewMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser: selectedUser });
  },
}));

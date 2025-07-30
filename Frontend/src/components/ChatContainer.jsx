import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "../components/skeletons/MessageSkeleton";
import { useEffect } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utility";
import { useRef } from "react";

const ChatContainer = () => {
  const {
    messages,
    getSelectedUserMessages,
    isMessagesLoading,
    selectedUser,
    subscribesToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { user} = useAuthStore();
  const messageEndRef = useRef(null);
  

  useEffect(() => {
    getSelectedUserMessages(selectedUser._id);
    subscribesToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser._id,
    getSelectedUserMessages,
    subscribesToMessages,
    unsubscribeFromMessages,
  ]);

  //latest message to down
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader></ChatHeader>
        <MessageSkeleton></MessageSkeleton>
        <MessageInput></MessageInput>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader></ChatHeader>
      {/* Messages Container for showing message */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === user._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={`${
                    message.senderId == selectedUser._id
                      ? selectedUser.profilePic || "avatar.png"
                      : user.profilePic || "avatar.png"
                  }`}
                  alt="profile pic"
                />
              </div>
            </div>
            <div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <MessageInput></MessageInput>
    </div>
  );
};

export default ChatContainer;

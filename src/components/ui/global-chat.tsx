import Chat from "../chat-components/chat";

export default function GlobalChat() {
  return (
    <Chat
      contactId="global"
      currentUserId="system"
      fetchMessagesUrl="/api/chat/messages"
      sendMessageUrl="/api/chat/messages"
      deleteMessageUrl="/api/chat/messages"
      socketPath="/socket.io"
    />
  );
}

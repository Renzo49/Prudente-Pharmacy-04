export interface Message {
  id: string
  customerName: string
  customerEmail: string
  message: string
  timestamp: string
  status: "unread" | "read" | "replied"
  adminReply?: string
  replyTimestamp?: string
}

export const saveMessage = (message: Omit<Message, "id" | "timestamp" | "status">) => {
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: "unread",
  }

  const existingMessages = JSON.parse(localStorage.getItem("pharmacy-messages") || "[]")
  const updatedMessages = [newMessage, ...existingMessages]
  localStorage.setItem("pharmacy-messages", JSON.stringify(updatedMessages))

  // Trigger event for real-time updates
  window.dispatchEvent(new CustomEvent("newMessage", { detail: newMessage }))

  return newMessage
}

export const getMessages = (): Message[] => {
  return JSON.parse(localStorage.getItem("pharmacy-messages") || "[]")
}

export const updateMessage = (messageId: string, updates: Partial<Message>) => {
  const messages = getMessages()
  const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
  localStorage.setItem("pharmacy-messages", JSON.stringify(updatedMessages))

  // Trigger event for real-time updates
  window.dispatchEvent(new CustomEvent("messageUpdate", { detail: { messageId, updates } }))

  return updatedMessages
}

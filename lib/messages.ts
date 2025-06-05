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

export function getMessages(): Message[] {
  if (typeof window === "undefined") return []

  const saved = localStorage.getItem("pharmacy-messages")
  return saved ? JSON.parse(saved) : []
}

export function saveMessage(message: Omit<Message, "id" | "timestamp" | "status">): void {
  if (typeof window === "undefined") return

  const messages = getMessages()
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    status: "unread",
  }

  messages.unshift(newMessage)
  localStorage.setItem("pharmacy-messages", JSON.stringify(messages))

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent("newMessage", { detail: newMessage }))
}

export function updateMessage(messageId: string, updates: Partial<Message>): void {
  if (typeof window === "undefined") return

  const messages = getMessages()
  const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))

  localStorage.setItem("pharmacy-messages", JSON.stringify(updatedMessages))

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent("messageUpdate"))
}

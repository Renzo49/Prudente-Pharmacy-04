"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Package,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Plus,
  Minus,
  Save,
  Reply,
  Check,
  Clock,
  User,
} from "lucide-react"
import { useInventory } from "@/contexts/InventoryContext"
import { getMessages, updateMessage, type Message } from "@/lib/messages"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "admin" && password === "admin") {
      localStorage.setItem("admin-auth", "true")
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-400">Prudente Pharmacy</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button type="submit" className="w-full btn-primary">
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Default credentials: admin / admin
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "messages" | "analytics">("orders")
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const { products, updateStock } = useInventory()

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("pharmacy-orders") || "[]")
    setOrders(savedOrders)
    setMessages(getMessages())

    // Listen for real-time updates
    const handleNewMessage = (event: any) => {
      setMessages(getMessages())
    }

    const handleMessageUpdate = () => {
      setMessages(getMessages())
    }

    window.addEventListener("newMessage", handleNewMessage)
    window.addEventListener("messageUpdate", handleMessageUpdate)

    return () => {
      window.removeEventListener("newMessage", handleNewMessage)
      window.removeEventListener("messageUpdate", handleMessageUpdate)
    }
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("pharmacy-orders", JSON.stringify(updatedOrders))
  }

  const handleStockUpdate = (productId: string, newStock: number) => {
    updateStock(productId, newStock)
    setEditingStock((prev) => ({ ...prev, [productId]: newStock }))
  }

  const saveStockChanges = (productId: string) => {
    const newStock = editingStock[productId]
    if (newStock !== undefined) {
      updateStock(productId, newStock)
      setEditingStock((prev) => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
    }
  }

  const handleReply = (messageId: string) => {
    if (!replyText.trim()) return

    updateMessage(messageId, {
      status: "replied",
      adminReply: replyText,
      replyTimestamp: new Date().toISOString(),
    })

    setReplyingTo(null)
    setReplyText("")
    setMessages(getMessages())
  }

  const markAsRead = (messageId: string) => {
    updateMessage(messageId, { status: "read" })
    setMessages(getMessages())
  }

  const lowStockProducts = products.filter((p) => p.inStock <= 5 && p.inStock > 0)
  const outOfStockProducts = products.filter((p) => p.inStock === 0)
  const unreadMessages = messages.filter((m) => m.status === "unread")

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-blue-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="flex items-center space-x-2">
                {unreadMessages.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages.length} new messages
                  </span>
                )}
                {lowStockProducts.length > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {lowStockProducts.length} low stock
                  </span>
                )}
              </div>
              <button onClick={onLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-600"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === "inventory"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-600"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {lowStockProducts.length + outOfStockProducts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === "messages"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-600"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages ({messages.length})</span>
            {unreadMessages.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadMessages.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-600"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">Order Management</h2>
            {orders.length === 0 ? (
              <div className="card p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-blue-900 dark:text-blue-100">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1 border border-blue-200 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.name} × {item.quantity}
                        </span>
                        <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-blue-200 dark:border-gray-600 pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₱{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">Inventory Management</h2>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400">Live inventory updates</span>
              </div>
            </div>

            {/* Alerts */}
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
              <div className="space-y-4">
                {outOfStockProducts.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <h3 className="font-semibold text-red-800 dark:text-red-400">
                        Out of Stock ({outOfStockProducts.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {outOfStockProducts.map((product) => (
                        <span key={product.id} className="text-sm text-red-700 dark:text-red-300">
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {lowStockProducts.length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <h3 className="font-semibold text-orange-800 dark:text-orange-400">
                        Low Stock ({lowStockProducts.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {lowStockProducts.map((product) => (
                        <span key={product.id} className="text-sm text-orange-700 dark:text-orange-300">
                          {product.name} ({product.inStock} left)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="card p-4">
                  <div className="flex items-start space-x-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{product.category}</p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">₱{product.price.toFixed(2)}</p>

                      {/* Stock Management */}
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Stock:</span>
                          {editingStock[product.id] !== undefined ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  setEditingStock((prev) => ({
                                    ...prev,
                                    [product.id]: Math.max(0, (prev[product.id] || product.inStock) - 1),
                                  }))
                                }
                                className="w-6 h-6 rounded bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                value={editingStock[product.id]}
                                onChange={(e) =>
                                  setEditingStock((prev) => ({
                                    ...prev,
                                    [product.id]: Number.parseInt(e.target.value) || 0,
                                  }))
                                }
                                className="w-12 text-center text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                min="0"
                              />
                              <button
                                onClick={() =>
                                  setEditingStock((prev) => ({
                                    ...prev,
                                    [product.id]: (prev[product.id] || product.inStock) + 1,
                                  }))
                                }
                                className="w-6 h-6 rounded bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => saveStockChanges(product.id)}
                                className="w-6 h-6 rounded bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center text-xs"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingStock((prev) => ({ ...prev, [product.id]: product.inStock }))}
                              className={`text-xs px-2 py-1 rounded ${
                                product.inStock === 0
                                  ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                                  : product.inStock <= 5
                                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                                    : "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                              }`}
                            >
                              {product.inStock} {product.inStock === 1 ? "item" : "items"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">Customer Messages</h2>
            {messages.length === 0 ? (
              <div className="card p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No messages yet</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`card p-6 ${message.status === "unread" ? "border-l-4 border-blue-500" : ""}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">{message.customerName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{message.customerEmail}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          message.status === "unread"
                            ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                            : message.status === "replied"
                              ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                              : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {message.status === "unread" && <Clock className="w-3 h-3 inline mr-1" />}
                        {message.status === "replied" && <Check className="w-3 h-3 inline mr-1" />}
                        {message.status}
                      </span>
                      {message.status === "unread" && (
                        <button
                          onClick={() => markAsRead(message.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Message:</h4>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {message.message}
                    </p>
                  </div>

                  {message.adminReply && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Reply:</h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        {message.adminReply}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Replied on {new Date(message.replyTimestamp!).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {replyingTo === message.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReply(message.id)}
                          disabled={!replyText.trim()}
                          className="btn-primary text-sm disabled:opacity-50"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText("")
                          }}
                          className="btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    !message.adminReply && (
                      <button
                        onClick={() => setReplyingTo(message.id)}
                        className="btn-primary text-sm flex items-center space-x-2"
                      >
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">Analytics Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{products.length}</h3>
                <p className="text-gray-600 dark:text-gray-400">Total Products</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{orders.length}</h3>
                <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{lowStockProducts.length}</h3>
                <p className="text-gray-600 dark:text-gray-400">Low Stock Items</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{unreadMessages.length}</h3>
                <p className="text-gray-600 dark:text-gray-400">Unread Messages</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Recent Orders</h3>
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600 dark:text-blue-400">₱{order.total.toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
                            : order.status === "ready"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                              : "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Recent Messages</h3>
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{message.customerName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {message.message.substring(0, 50)}...
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          message.status === "unread"
                            ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                            : message.status === "replied"
                              ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                              : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

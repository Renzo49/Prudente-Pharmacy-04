"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Minus, Trash2, ShoppingBag, X } from "lucide-react"
import Navigation from "@/components/Navigation"
import QRCodeGenerator from "@/components/QRCodeGenerator"
import type { CartItem, Order } from "@/lib/products"

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("pharmacy-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("pharmacy-cart", JSON.stringify(cart))
    // Trigger storage event for floating cart
    window.dispatchEvent(new Event("storage"))
  }, [cart])

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const submitOrder = async () => {
    if (cart.length === 0) return

    setIsSubmitting(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const order: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: cartTotal,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    // Save order to localStorage (in a real app, this would go to a database)
    const existingOrders = JSON.parse(localStorage.getItem("pharmacy-orders") || "[]")
    localStorage.setItem("pharmacy-orders", JSON.stringify([...existingOrders, order]))

    // Clear cart and show success
    setCart([])
    setSubmittedOrder(order)
    setIsSubmitting(false)
    setOrderSubmitted(true)
    setShowCheckoutModal(false)
  }

  if (orderSubmitted && submittedOrder) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
        <Navigation />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="card p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">Order Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your order has been received and will be ready for pickup within 30-60 minutes. We'll call you when it's
              ready.
            </p>

            {/* QR Code */}
            <div className="mb-6">
              <QRCodeGenerator orderId={submittedOrder.id} size={150} />
            </div>

            <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pickup Instructions</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Show this QR code or mention Order ID: <strong>{submittedOrder.id}</strong> when you arrive at Prudente
                Pharmacy.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setOrderSubmitted(false)
                  setSubmittedOrder(null)
                }}
                className="block w-full btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      <Navigation cartItemCount={cartItemCount} />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-400">Review your items before checkout</p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-blue-300 dark:text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started</p>
              <a href="/shop" className="btn-primary">
                Browse Products
              </a>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  Cart Items ({cartItemCount})
                </h2>
                {cart.map((item) => (
                  <div key={item.id} className="card p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">₱{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="card p-6 h-fit">
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-blue-200 dark:border-gray-600 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-blue-900 dark:text-blue-100">
                    <span>Total</span>
                    <span>₱{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pickup Information</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    <strong>Location:</strong> Prudente Pharmacy, Jaro, Iloilo City
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    <strong>Ready in:</strong> 30-60 minutes
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    We'll call you when your order is ready for pickup.
                  </p>
                </div>
                <button onClick={() => setShowCheckoutModal(true)} className="w-full btn-primary">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Order</h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Order Summary</h4>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between font-bold text-blue-900 dark:text-blue-100">
                    <span>Total</span>
                    <span>₱{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pickup Instructions</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Your order will be ready for pickup at Prudente Pharmacy within 30-60 minutes.
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We'll call you when it's ready. No payment required until pickup.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={submitOrder}
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting Order..." : "Confirm Order"}
                </button>
                <button onClick={() => setShowCheckoutModal(false)} className="w-full btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

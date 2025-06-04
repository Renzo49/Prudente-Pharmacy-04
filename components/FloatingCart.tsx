"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, X } from "lucide-react"
import type { CartItem } from "@/lib/products"

export default function FloatingCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("pharmacy-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    // Listen for cart updates
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem("pharmacy-cart")
      if (updatedCart) {
        setCart(JSON.parse(updatedCart))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItemCount === 0) return null

  return (
    <>
      {/* Floating Cart Button */}
      <button onClick={() => setIsOpen(true)} className="floating-cart">
        <ShoppingBag className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {cartItemCount}
        </span>
      </button>

      {/* Cart Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shopping Cart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-4 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 py-2">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-blue-600">₱{cartTotal.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Link href="/cart" onClick={() => setIsOpen(false)} className="block w-full btn-primary text-center">
                  View Cart
                </Link>
                <button onClick={() => setIsOpen(false)} className="w-full btn-secondary">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Plus, Minus } from "lucide-react"
import { useInventory } from "@/contexts/InventoryContext"

interface QuickViewProps {
  product: any | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: any, quantity: number) => void
}

export default function QuickView({ product, isOpen, onClose, onAddToCart }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const { getProduct } = useInventory()

  if (!isOpen || !product) return null

  // Get real-time product data
  const currentProduct = getProduct(product.id) || product

  const handleAddToCart = () => {
    onAddToCart(currentProduct, quantity)
    setQuantity(1)
    onClose()
  }

  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case "new":
        return "badge-new"
      case "bestseller":
        return "badge-bestseller"
      case "lowstock":
        return "badge-lowstock"
      default:
        return ""
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick View</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative">
              <Image
                src={currentProduct.image || "/placeholder.svg"}
                alt={currentProduct.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover rounded-lg"
              />
              {currentProduct.badge && (
                <span className={`absolute top-2 left-2 ${getBadgeClass(currentProduct.badge)}`}>
                  {currentProduct.badge === "bestseller"
                    ? "Best Seller"
                    : currentProduct.badge === "lowstock"
                      ? "Low Stock"
                      : "New"}
                </span>
              )}
              {currentProduct.inStock === 0 && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{currentProduct.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{currentProduct.category}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{currentProduct.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">₱{currentProduct.price.toFixed(2)}</p>

              {/* Real-time stock display */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  In stock:{" "}
                  <span className={`font-medium ${currentProduct.inStock <= 5 ? "text-orange-500" : "text-green-600"}`}>
                    {currentProduct.inStock}
                  </span>
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live inventory"></div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, currentProduct.inStock))}
                    disabled={quantity >= currentProduct.inStock}
                    className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={currentProduct.inStock === 0 || quantity > currentProduct.inStock}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentProduct.inStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              {/* Pickup Notice */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Pickup Only:</strong> Order will be ready in 30-60 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Plus, Minus, Eye, AlertTriangle } from "lucide-react"
import Navigation from "@/components/Navigation"
import FloatingCart from "@/components/FloatingCart"
import QuickView from "@/components/QuickView"
import { useInventory } from "@/contexts/InventoryContext"
import { categories, type CartItem } from "@/lib/products"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const { products, decreaseStock } = useInventory()

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "All")
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pharmacy-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pharmacy-cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("storage"))
  }, [cart])

  // Update category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // Listen for real-time inventory updates
  useEffect(() => {
    const handleInventoryUpdate = () => {
      // Force re-render when inventory updates
      setQuantities((prev) => ({ ...prev }))
    }

    window.addEventListener("inventoryUpdate", handleInventoryUpdate)
    return () => window.removeEventListener("inventoryUpdate", handleInventoryUpdate)
  }, [])

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory)

  const getQuantity = (productId: string) => quantities[productId] || 1

  const setQuantity = (productId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, quantity),
    }))
  }

  const addToCart = (product: any, quantity: number = getQuantity(product.id)) => {
    // Check if enough stock is available
    if (product.inStock < quantity) {
      alert(`Sorry, only ${product.inStock} items available in stock.`)
      return
    }

    // Decrease stock in real-time
    decreaseStock(product.id, quantity)

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prev, { ...product, quantity }]
    })
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }))

    // Show success message
    const toast = document.createElement("div")
    toast.className = "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 fade-in"
    toast.textContent = `${product.name} added to cart!`
    document.body.appendChild(toast)
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  const openQuickView = (product: any) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
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

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      <Navigation cartItemCount={cartItemCount} />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">Shop Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Browse our wide selection of healthcare products</p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live inventory updates</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === "All"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                }`}
              >
                All Products ({products.length})
              </button>
              {categories.map((category) => {
                const count = products.filter((p) => p.category === category).length
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {category} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card p-4 hover:shadow-lg transition-all duration-300 group">
                <div className="relative mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {product.badge && (
                    <span className={`absolute top-2 left-2 ${getBadgeClass(product.badge)}`}>
                      {product.badge === "bestseller"
                        ? "Best Seller"
                        : product.badge === "lowstock"
                          ? "Low Stock"
                          : "New"}
                    </span>
                  )}
                  {product.inStock <= 5 && product.inStock > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Low Stock</span>
                    </span>
                  )}
                  {product.inStock === 0 && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => openQuickView(product)}
                    className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">₱{product.price.toFixed(2)}</p>

                {/* Real-time stock display */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    In stock:{" "}
                    <span className={`font-medium ${product.inStock <= 5 ? "text-orange-500" : "text-green-600"}`}>
                      {product.inStock}
                    </span>
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live inventory"></div>
                </div>

                {/* Pickup Notice */}
                <div className="bg-blue-50 dark:bg-gray-700 p-2 rounded-lg mb-4">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Pickup Only</strong> - Ready in 30-60 min
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(product.id, getQuantity(product.id) - 1)}
                      className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{getQuantity(product.id)}</span>
                    <button
                      onClick={() => setQuantity(product.id, Math.min(getQuantity(product.id) + 1, product.inStock))}
                      disabled={getQuantity(product.id) >= product.inStock}
                      className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.inStock === 0 || getQuantity(product.id) > product.inStock}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.inStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>

      <FloatingCart />
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={addToCart}
      />
    </div>
  )
}

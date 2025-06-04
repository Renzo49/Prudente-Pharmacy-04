"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { products as initialProducts, type Product } from "@/lib/products"

interface InventoryContextType {
  products: Product[]
  updateStock: (productId: string, newStock: number) => void
  decreaseStock: (productId: string, quantity: number) => void
  getProduct: (productId: string) => Product | undefined
  refreshInventory: () => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  // Load inventory from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("pharmacy-inventory")
    if (savedInventory) {
      setProducts(JSON.parse(savedInventory))
    } else {
      setProducts(initialProducts)
      localStorage.setItem("pharmacy-inventory", JSON.stringify(initialProducts))
    }
  }, [])

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("pharmacy-inventory", JSON.stringify(products))
      // Trigger custom event for real-time updates
      window.dispatchEvent(new CustomEvent("inventoryUpdate", { detail: products }))
    }
  }, [products])

  const updateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, inStock: Math.max(0, newStock) } : product)),
    )
  }

  const decreaseStock = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, inStock: Math.max(0, product.inStock - quantity) } : product,
      ),
    )
  }

  const getProduct = (productId: string) => {
    return products.find((product) => product.id === productId)
  }

  const refreshInventory = () => {
    const savedInventory = localStorage.getItem("pharmacy-inventory")
    if (savedInventory) {
      setProducts(JSON.parse(savedInventory))
    }
  }

  return (
    <InventoryContext.Provider
      value={{
        products,
        updateStock,
        decreaseStock,
        getProduct,
        refreshInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}

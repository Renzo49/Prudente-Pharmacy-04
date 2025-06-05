"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { products as initialProducts, type Product } from "@/lib/products"
import { pushToCloud, pullFromCloud, hasNewerData, initSyncListener } from "@/lib/cloudSync"

interface InventoryContextType {
  products: Product[]
  updateStock: (productId: string, newStock: number) => void
  decreaseStock: (productId: string, quantity: number) => void
  getProduct: (productId: string) => Product | undefined
  refreshInventory: () => void
  addProduct: (newProduct: Omit<Product, "id">) => void
  syncStatus: "synced" | "syncing" | "error"
  lastSynced: Date | null
  forceSync: () => Promise<void>
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced")
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  // Load inventory from localStorage or cloud on mount
  useEffect(() => {
    const loadInventory = () => {
      setSyncStatus("syncing")

      // Check if cloud has newer data
      if (hasNewerData()) {
        const cloudData = pullFromCloud()
        if (cloudData) {
          setProducts(cloudData.products)
          setLastSynced(new Date())
          setSyncStatus("synced")
          return
        }
      }

      // Otherwise load from local storage
      const savedInventory = localStorage.getItem("pharmacy-inventory")
      if (savedInventory) {
        try {
          const saved = JSON.parse(savedInventory)
          // Merge saved inventory with initial products to handle new products
          const mergedProducts = initialProducts.map((initialProduct) => {
            const savedProduct = saved.find((p: Product) => p.id === initialProduct.id)
            return savedProduct || initialProduct
          })
          // Add any products that exist in saved but not in initial (user-added products)
          const userAddedProducts = saved.filter(
            (savedProduct: Product) => !initialProducts.find((initial) => initial.id === savedProduct.id),
          )
          const allProducts = [...mergedProducts, ...userAddedProducts]
          setProducts(allProducts)

          // Push to cloud for other devices
          pushToCloud(allProducts)
          setLastSynced(new Date())
          setSyncStatus("synced")
        } catch (error) {
          console.error("Error loading inventory:", error)
          setProducts(initialProducts)
          localStorage.setItem("pharmacy-inventory", JSON.stringify(initialProducts))
          pushToCloud(initialProducts)
          setSyncStatus("error")
        }
      } else {
        setProducts(initialProducts)
        localStorage.setItem("pharmacy-inventory", JSON.stringify(initialProducts))
        pushToCloud(initialProducts)
        setLastSynced(new Date())
        setSyncStatus("synced")
      }
    }

    loadInventory()
  }, [])

  // Set up sync listener for changes from other tabs/devices
  useEffect(() => {
    const cleanup = initSyncListener((syncedProducts) => {
      setProducts(syncedProducts)
      setLastSynced(new Date())
      setSyncStatus("synced")
      localStorage.setItem("pharmacy-inventory", JSON.stringify(syncedProducts))
    })

    return cleanup
  }, [])

  // Save inventory to localStorage and cloud whenever it changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("pharmacy-inventory", JSON.stringify(products))
      pushToCloud(products)
      setLastSynced(new Date())

      // Trigger custom event for real-time updates
      window.dispatchEvent(new CustomEvent("inventoryUpdate", { detail: products }))
    }
  }, [products])

  const updateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              inStock: Math.max(0, newStock),
              badge:
                newStock <= 5 && newStock > 0 ? "lowstock" : product.badge === "lowstock" ? undefined : product.badge,
            }
          : product,
      ),
    )
  }

  const decreaseStock = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              inStock: Math.max(0, product.inStock - quantity),
              badge:
                product.inStock - quantity <= 5 && product.inStock - quantity > 0
                  ? "lowstock"
                  : product.badge === "lowstock"
                    ? undefined
                    : product.badge,
            }
          : product,
      ),
    )
  }

  const getProduct = (productId: string) => {
    return products.find((product) => product.id === productId)
  }

  const refreshInventory = () => {
    setSyncStatus("syncing")
    const cloudData = pullFromCloud()
    if (cloudData) {
      setProducts(cloudData.products)
      localStorage.setItem("pharmacy-inventory", JSON.stringify(cloudData.products))
      setLastSynced(new Date())
      setSyncStatus("synced")
    } else {
      setSyncStatus("error")
    }
  }

  const forceSync = async () => {
    setSyncStatus("syncing")
    try {
      pushToCloud(products)
      setLastSynced(new Date())
      setSyncStatus("synced")
    } catch (error) {
      console.error("Sync error:", error)
      setSyncStatus("error")
    }
  }

  const addProduct = (newProduct: Omit<Product, "id">) => {
    const product: Product = {
      ...newProduct,
      id: `custom-${Date.now()}`, // Generate unique ID
      image: newProduct.image || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(newProduct.name)}`,
    }
    setProducts((prev) => [...prev, product])
  }

  return (
    <InventoryContext.Provider
      value={{
        products,
        updateStock,
        decreaseStock,
        getProduct,
        refreshInventory,
        addProduct,
        syncStatus,
        lastSynced,
        forceSync,
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

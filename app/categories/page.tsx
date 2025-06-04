"use client"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import FloatingCart from "@/components/FloatingCart"
import { categories, products } from "@/lib/products"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">Product Categories</h1>
            <p className="text-gray-600 dark:text-gray-400">Browse our wide selection of healthcare products</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryProducts = products.filter((p) => p.category === category)
              const categoryImage = categoryProducts[0]?.image || "/placeholder.svg"

              return (
                <Link
                  key={category}
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="card p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="text-center">
                    <img
                      src={categoryImage || "/placeholder.svg"}
                      alt={category}
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-4 group-hover:scale-110 transition-transform"
                    />
                    <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">{category}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {categoryProducts.length} products available
                    </p>
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                      Browse Category →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <FloatingCart />
    </div>
  )
}

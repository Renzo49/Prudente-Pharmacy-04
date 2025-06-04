import Link from "next/link"
import { Phone, MapPin, ShoppingBag, Clock, Shield, Heart } from "lucide-react"
import Navigation from "@/components/Navigation"
import FloatingCart from "@/components/FloatingCart"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo Section */}
          <div className="mb-12 fade-in">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <span className="text-white font-bold text-4xl">P</span>
            </div>
            <h1 className="text-5xl font-bold text-blue-900 dark:text-blue-100 mb-4">Prudente Pharmacy</h1>
            <p className="text-xl text-blue-700 dark:text-blue-300 italic font-medium">
              "Caring for your health, one step at a time"
            </p>
          </div>

          {/* CTA Section */}
          <div className="mb-16">
            <Link href="/shop" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3 shadow-lg">
              <ShoppingBag className="w-6 h-6" />
              <span>Browse Our Products</span>
            </Link>
            <p className="text-blue-600 dark:text-blue-400 mt-4 text-sm">
              Pickup orders available • No prescription required for OTC items
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Location Card */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">Location</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Prudente Pharmacy
                <br />
                Jaro, Iloilo City
                <br />
                Philippines
              </p>
            </div>

            {/* Contact Card */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">Contact</h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Main:</span> 0999 888 7777
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Emergency:</span> 033 320 4321
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">Operating Hours</h3>
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p>Mon - Sat: 8:00 AM - 8:00 PM</p>
                <p>Sunday: 9:00 AM - 6:00 PM</p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Open Daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-12">
            Why Choose Prudente Pharmacy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Licensed Pharmacists</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All medicines dispensed by licensed pharmacists
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Pickup</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Orders ready in 30-60 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Family Care</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Trusted family-owned pharmacy since 1995</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-blue-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Prudente Pharmacy</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Your trusted neighborhood pharmacy for quality healthcare products and professional service.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                All medicines dispensed by licensed pharmacists at Prudente Pharmacy.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/shop"
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Shop Products
                </Link>
                <Link
                  href="/categories"
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Categories
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Jaro, Iloilo City</p>
                <p>0999 888 7777</p>
                <p>033 320 4321</p>
                <p>Mon-Sat: 8AM-8PM</p>
                <p>Sunday: 9AM-6PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">© 2024 Prudente Pharmacy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <FloatingCart />

      {/* Admin Link */}
      <div className="fixed bottom-4 right-20">
        <Link
          href="/admin"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs underline"
        >
          Admin
        </Link>
      </div>
    </div>
  )
}

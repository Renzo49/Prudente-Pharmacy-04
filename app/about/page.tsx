import { Heart, Shield, Users, Award } from "lucide-react"
import Navigation from "@/components/Navigation"
import FloatingCart from "@/components/FloatingCart"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">P</span>
            </div>
            <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">About Prudente Pharmacy</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 italic">
              "Caring for your health, one step at a time"
            </p>
          </div>

          {/* Story Section */}
          <div className="card p-8 mb-12">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">Our Story</h2>
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Founded in 1995, Prudente Pharmacy has been serving the Jaro community in Iloilo City for nearly three
                decades. What started as a small family-owned pharmacy has grown into a trusted healthcare partner for
                thousands of families.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our commitment to providing quality healthcare products, professional pharmaceutical services, and
                personalized customer care has made us a cornerstone of the community. We believe that everyone deserves
                access to affordable, high-quality healthcare products and expert pharmaceutical guidance.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Today, we continue to uphold the same values that our founders established: integrity, compassion, and
                excellence in everything we do. Our licensed pharmacists are always ready to provide professional advice
                and ensure that every customer receives the care they deserve.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Compassionate Care</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We treat every customer like family, providing personalized attention and care for their health needs.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Professional Excellence</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  All our medicines are dispensed by licensed pharmacists with years of experience and expertise.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Community Focus</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We're deeply rooted in the Jaro community and committed to improving local health outcomes.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Quality Assurance</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We source only the highest quality products from trusted suppliers and manufacturers.
                </p>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Pharmaceutical Services</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Prescription dispensing</li>
                  <li>• Over-the-counter medications</li>
                  <li>• Medication counseling</li>
                  <li>• Drug interaction checking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Health Products</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                  <li>• Vitamins and supplements</li>
                  <li>• First aid supplies</li>
                  <li>• Personal care items</li>
                  <li>• Health monitoring devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingCart />
    </div>
  )
}

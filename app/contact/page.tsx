"use client"

import type React from "react"

import { useState } from "react"
import { Phone, MapPin, Clock, Send } from "lucide-react"
import Navigation from "@/components/Navigation"
import FloatingCart from "@/components/FloatingCart"
import { saveMessage } from "@/lib/messages"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerName || !formData.customerEmail || !formData.message) {
      alert("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save message
    saveMessage(formData)

    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ customerName: "", customerEmail: "", message: "" })

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">Contact Us</h1>
            <p className="text-gray-600 dark:text-gray-400">Get in touch with Prudente Pharmacy</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Phone Numbers</h3>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Main Line:</span> 0999 888 7777
                  </p>
                  <p>
                    <span className="font-medium">Emergency:</span> 033 320 4321
                  </p>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Location</h3>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Prudente Pharmacy
                  <br />
                  Jaro, Iloilo City
                  <br />
                  Philippines
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Operating Hours</h3>
                  </div>
                </div>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
                  <p>Sunday: 9:00 AM - 6:00 PM</p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">Open Daily</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-6">Send us a Message</h3>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Message Sent!</h4>
                  <p className="text-gray-600 dark:text-gray-400">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <FloatingCart />
    </div>
  )
}

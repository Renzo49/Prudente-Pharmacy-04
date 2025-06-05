import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { InventoryProvider } from "@/contexts/InventoryContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prudente Pharmacy - Your Trusted Healthcare Partner",
  description:
    "Family-owned pharmacy providing quality healthcare products with pickup service. Browse our wide selection of medicines, vitamins, and health essentials.",
  keywords: "pharmacy, medicine, healthcare, vitamins, prescription, pickup, family pharmacy",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <InventoryProvider>{children}</InventoryProvider>
      </body>
    </html>
  )
}

"use client"

interface QRCodeProps {
  orderId: string
  size?: number
}

export default function QRCodeGenerator({ orderId, size = 200 }: QRCodeProps) {
  // Simple QR code placeholder - in a real app, you'd use a QR code library
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=PICKUP-${orderId}`

  return (
    <div className="text-center">
      <img
        src={qrCodeUrl || "/placeholder.svg"}
        alt={`QR Code for order ${orderId}`}
        className="mx-auto mb-4 border border-gray-200 rounded-lg"
        width={size}
        height={size}
      />
      <p className="text-sm text-gray-600 dark:text-gray-400">Show this QR code at pickup</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Order ID: {orderId}</p>
    </div>
  )
}

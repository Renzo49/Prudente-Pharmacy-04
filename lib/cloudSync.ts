import type { Product } from "./products"

// This is a simple implementation of cloud sync using localStorage as a base
// In a real application, you would use a database or cloud storage service

const SYNC_KEY = "pharmacy-cloud-sync"
const SYNC_TIMESTAMP_KEY = "pharmacy-sync-timestamp"

// Generate a unique device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem("pharmacy-device-id")
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem("pharmacy-device-id", deviceId)
  }
  return deviceId
}

// Push local changes to "cloud" (simulated with localStorage)
export const pushToCloud = (products: Product[]) => {
  const timestamp = Date.now()
  const deviceId = getDeviceId()

  const syncData = {
    products,
    timestamp,
    deviceId,
    lastUpdated: new Date().toISOString(),
  }

  localStorage.setItem(SYNC_KEY, JSON.stringify(syncData))
  localStorage.setItem(SYNC_TIMESTAMP_KEY, timestamp.toString())

  // Dispatch a custom event that other tabs/windows can listen for
  const syncEvent = new CustomEvent("pharmacy-cloud-sync", {
    detail: { timestamp, deviceId },
  })
  window.dispatchEvent(syncEvent)

  return timestamp
}

// Pull changes from "cloud" (simulated with localStorage)
export const pullFromCloud = (): { products: Product[]; timestamp: number } | null => {
  const syncDataStr = localStorage.getItem(SYNC_KEY)
  if (!syncDataStr) return null

  try {
    const syncData = JSON.parse(syncDataStr)
    return {
      products: syncData.products,
      timestamp: syncData.timestamp,
    }
  } catch (error) {
    console.error("Error parsing sync data:", error)
    return null
  }
}

// Check if cloud has newer data
export const hasNewerData = (): boolean => {
  const localTimestamp = Number(localStorage.getItem(SYNC_TIMESTAMP_KEY) || "0")
  const syncDataStr = localStorage.getItem(SYNC_KEY)

  if (!syncDataStr) return false

  try {
    const syncData = JSON.parse(syncDataStr)
    return syncData.timestamp > localTimestamp
  } catch (error) {
    return false
  }
}

// Listen for sync events from other tabs/windows
export const initSyncListener = (onSync: (products: Product[]) => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === SYNC_KEY && event.newValue) {
      try {
        const syncData = JSON.parse(event.newValue)
        const localTimestamp = Number(localStorage.getItem(SYNC_TIMESTAMP_KEY) || "0")

        // Only update if the cloud data is newer
        if (syncData.timestamp > localTimestamp) {
          localStorage.setItem(SYNC_TIMESTAMP_KEY, syncData.timestamp.toString())
          onSync(syncData.products)
        }
      } catch (error) {
        console.error("Error handling sync event:", error)
      }
    }
  }

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent
    if (customEvent.detail && customEvent.detail.deviceId !== getDeviceId()) {
      const cloudData = pullFromCloud()
      if (cloudData) {
        onSync(cloudData.products)
      }
    }
  }

  window.addEventListener("storage", handleStorageChange)
  window.addEventListener("pharmacy-cloud-sync", handleCustomEvent)

  return () => {
    window.removeEventListener("storage", handleStorageChange)
    window.removeEventListener("pharmacy-cloud-sync", handleCustomEvent)
  }
}

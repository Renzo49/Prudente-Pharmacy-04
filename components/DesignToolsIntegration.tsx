"use client"

import { useState } from "react"
import { ImageUpload } from "./ImageUpload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Download, ExternalLink, FileImage } from "lucide-react"

interface DesignToolsIntegrationProps {
  onImageSelected: (url: string) => void
  currentImage?: string
}

export function DesignToolsIntegration({ onImageSelected, currentImage }: DesignToolsIntegrationProps) {
  const [figmaUrl, setFigmaUrl] = useState("")
  const [figmaNodeId, setFigmaNodeId] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [sketchUrl, setSketchUrl] = useState("")

  const handleFigmaImport = async () => {
    if (!figmaUrl) return

    setIsImporting(true)
    try {
      // In a real implementation, this would call an API to extract the image from Figma
      // For now, we'll simulate the process with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a placeholder URL based on the Figma URL to simulate the import
      const importedUrl = `/api/design-import?source=figma&url=${encodeURIComponent(figmaUrl)}&node=${encodeURIComponent(figmaNodeId)}`

      // In a real implementation, we would upload this to Vercel Blob
      // For now, we'll just pass it to the parent component
      onImageSelected(importedUrl)
    } catch (error) {
      console.error("Failed to import from Figma:", error)
      alert("Failed to import from Figma. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const handleSketchImport = async () => {
    if (!sketchUrl) return

    setIsImporting(true)
    try {
      // Simulate Sketch import
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const importedUrl = `/api/design-import?source=sketch&url=${encodeURIComponent(sketchUrl)}`
      onImageSelected(importedUrl)
    } catch (error) {
      console.error("Failed to import from Sketch:", error)
      alert("Failed to import from Sketch. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Product Image</h3>

      <Tabs defaultValue="upload">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="upload">Direct Upload</TabsTrigger>
          <TabsTrigger value="figma">Figma</TabsTrigger>
          <TabsTrigger value="sketch">Sketch/XD</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-4">
          <ImageUpload onImageUploaded={onImageSelected} currentImage={currentImage} />
        </TabsContent>

        <TabsContent value="figma" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Figma File URL</label>
            <Input
              placeholder="https://www.figma.com/file/..."
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Node ID (optional)</label>
            <Input
              placeholder="Node ID for specific element"
              value={figmaNodeId}
              onChange={(e) => setFigmaNodeId(e.target.value)}
            />
          </div>

          <Button onClick={handleFigmaImport} disabled={!figmaUrl || isImporting} className="w-full">
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing from Figma...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import from Figma
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <p>Make sure your Figma file is set to public or anyone with the link can view.</p>
          </div>
        </TabsContent>

        <TabsContent value="sketch" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sketch/XD Share URL</label>
            <Input
              placeholder="https://sketch.cloud/s/..."
              value={sketchUrl}
              onChange={(e) => setSketchUrl(e.target.value)}
            />
          </div>

          <Button onClick={handleSketchImport} disabled={!sketchUrl || isImporting} className="w-full">
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing from Sketch/XD...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import from Sketch/XD
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <p>Make sure your design is shared publicly or with anyone who has the link.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <FileImage className="w-4 h-4 mr-1" />
          Supported: PNG, JPG, SVG, WebP
        </span>

        <a
          href="https://www.figma.com/community/plugin/1149686177931976227/export-to-vercel-blob"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Figma Plugin
        </a>
      </div>
    </div>
  )
}

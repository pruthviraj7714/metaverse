'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BACKEND_URL } from "@/config/config"
import ElementCard from "@/components/ElementCard"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AddMapPage() {
  const [mapElements, setMapElements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapConfig, setMapConfig] = useState({
    name: "",
    description: "",
    backgroundUrl: "",
    height: "",
    width: ""
  })
  const [placedElements, setPlacedElements] = useState<any[]>([])

  useEffect(() => {
    const fetchMapElements = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/available/elements`)
        setMapElements(res.data.elements)
      } catch (error) {
        toast.error("Error while fetching map elements")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMapElements()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setMapConfig(prevConfig => ({ ...prevConfig, [name]: value }))
  }

  const handleElementDrag = (e: React.DragEvent, element: any) => {
    e.dataTransfer.setData("element", JSON.stringify(element))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const element = JSON.parse(e.dataTransfer.getData("element"))
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setPlacedElements(prevElements => [
      ...prevElements,
      { ...element, x, y, id: Date.now() }
    ])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleElementMove = (id: number, newX: number, newY: number) => {
    setPlacedElements(prevElements =>
      prevElements.map(el =>
        el.id === id ? { ...el, x: newX, y: newY } : el
      )
    )
  }

  const addMap = async () => {
    const { name, description, backgroundUrl, height, width } = mapConfig
    try {
      await axios.post(
        `${BACKEND_URL}/admin/add-map`,
        {
          name,
          description,
          backgroundBaseUrl: backgroundUrl,
          dimensions: { height : parseInt(height), width : parseInt(width) },
          elements: placedElements
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      toast.success("Map Successfully Added")
    } catch (error) {
      toast.error("Error while adding map")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="w-80 border-r">
        <SidebarHeader className="p-4 text-xl font-bold">Map Elements</SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : mapElements.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 p-2">
                {mapElements.map((element, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleElementDrag(e, element)}
                    className="cursor-move"
                  >
                    <ElementCard item={element} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-muted-foreground">No elements available</div>
            )}
          </ScrollArea>
        </SidebarContent>
      </Sidebar>

      <div className="ml-16 flex flex-col w-[950px]">
        <div className="pl-4 bg-muted">
          <h1 className="text-2xl font-bold mb-4">Create New Map</h1>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Map Name</Label>
              <Input
                id="name"
                placeholder="Enter name for Map"
                name="name"
                value={mapConfig.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="backgroundUrl">Background Image URL</Label>
              <Input
                id="backgroundUrl"
                placeholder="Enter background image URL"
                name="backgroundUrl"
                value={mapConfig.backgroundUrl}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="height">Map Height</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                name="height"
                value={mapConfig.height}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="width">Map Width</Label>
              <Input
                id="width"
                type="number"
                placeholder="Enter width"
                name="width"
                value={mapConfig.width}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description for Map"
                name="description"
                value={mapConfig.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <Card className="relative overflow-hidden" style={{
            height: mapConfig.height ? `${mapConfig.height}px` : '600px',
            width: mapConfig.width ? `${mapConfig.width}px` : '100%'
          }}>
            <CardContent
              className="absolute inset-0"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {mapConfig.backgroundUrl && (
                <img
                  src={mapConfig.backgroundUrl}
                  alt="map base"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {placedElements.map((element) => (
                <DraggableElement
                  key={element.id}
                  element={element}
                  onMove={handleElementMove}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0 p-4 bg-muted">
          <Button onClick={addMap} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Map
          </Button>
        </div>
      </div>
    </div>
  )
}

interface DraggableElementProps {
  element: any
  onMove: (id: number, newX: number, newY: number) => void
}

function DraggableElement({ element, onMove }: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', '')
  }

  const handleDrag = (e: React.DragEvent) => {
    if (isDragging) {
      const parentRect = e.currentTarget.parentElement?.getBoundingClientRect()
      if (parentRect) {
        const newX = e.clientX - parentRect.left
        const newY = e.clientY - parentRect.top
        onMove(element.id, newX, newY)
      }
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s'
      }}
    >
      <ElementCard item={element} />
    </div>
  )
}
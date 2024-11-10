"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { PlusCircle, Loader2 } from "lucide-react"
import { BACKEND_URL } from "@/config/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface MapElement {
  id: string
  name: string
  imageUrl: string
  dimensions: {
    height: number
    width: number
  }
  position: {
    x: number
    y: number
  }
}

export default function AddMapElement() {
  const [mapElements, setMapElements] = useState<MapElement[]>([])
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [height, setHeight] = useState("")
  const [width, setWidth] = useState("")
  const [positionX, setPositionX] = useState("0")
  const [positionY, setPositionY] = useState("0")
  const [isLoading, setIsLoading] = useState(true)

  const fetchMapElements = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/available/elements`)
      setMapElements(res.data.elements)
    } catch (error) {
      toast.error('Error while fetching map elements')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMapElements()
  }, [])

  const handleAddMapElement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !imageUrl || !height || !width) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      const newElement: Omit<MapElement, 'id'> = {
        name,
        imageUrl,
        dimensions: {
          height: parseFloat(height),
          width: parseFloat(width)
        },
        position: {
          x: parseFloat(positionX),
          y: parseFloat(positionY)
        }
      }
      await axios.post(`${BACKEND_URL}/map-elements`, newElement)
      toast.success('Map element added successfully')
      setName("")
      setImageUrl("")
      setHeight("")
      setWidth("")
      setPositionX("0")
      setPositionY("0")
      fetchMapElements()
    } catch (error) {
      toast.error('Error adding map element')
    }
  }

  const handleDeleteMapElement = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/map-elements/${id}`)
      toast.success('Map element deleted successfully')
      fetchMapElements()
    } catch (error) {
      toast.error('Error deleting map element')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Map Element</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMapElement} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Element name"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Element image URL"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Width"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Height"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="positionX">Position X</Label>
                <Input
                  id="positionX"
                  type="number"
                  value={positionX}
                  onChange={(e) => setPositionX(e.target.value)}
                  placeholder="X coordinate"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="positionY">Position Y</Label>
                <Input
                  id="positionY"
                  type="number"
                  value={positionY}
                  onChange={(e) => setPositionY(e.target.value)}
                  placeholder="Y coordinate"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Map Element
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Map Elements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : mapElements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mapElements.map((element) => (
                <Card key={element.id} className="overflow-hidden">
                  <img
                    src={element.imageUrl}
                    alt={element.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{element.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Dimensions: {element.dimensions.width}W x {element.dimensions.height}H
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Position: ({element.position.x}, {element.position.y})
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMapElement(element.id)}
                      className="mt-2"
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No map elements added yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
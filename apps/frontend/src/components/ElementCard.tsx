import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, Move } from "lucide-react"

interface FurnitureItem {
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

interface FurnitureCardProps {
  item: FurnitureItem
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onMove?: (id: string) => void
}

export default function ElementCard({ item, onEdit, onDelete, onMove }: FurnitureCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <AspectRatio ratio={4/3}>
        <img
          src={item.imageUrl}
          alt={`Image of ${item.name}`}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate" title={item.name}>
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {item.dimensions.width}W x {item.dimensions.height}H
        </p>
        <p className="text-sm text-muted-foreground">
          Position: ({item.position.x}, {item.position.y})
        </p>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50">
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(item.id)}
            className="hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove?.(item.id)}
            className="hover:text-primary"
          >
            <Move className="h-4 w-4" />
            <span className="sr-only">Move</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(item.id)}
            className="hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"


export default function AvatarCard({
  name,
  imageUrl,
}: {
  name: string
  imageUrl: string
}) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <AspectRatio ratio={1}>
        <img
          src={imageUrl}
          alt={`Avatar of ${name}`}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate" title={name}>
          {name}
        </h3>
      </CardContent>
    </Card>
  )
}
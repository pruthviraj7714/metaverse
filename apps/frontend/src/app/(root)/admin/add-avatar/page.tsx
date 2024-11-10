"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { PlusCircle, Loader2 } from "lucide-react"
import { BACKEND_URL } from "@/config/config"
import AvatarCard from "@/components/Avatarcard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddAvatarPage() {
  const [avatars, setAvatars] = useState<any[]>([])
  const [avatarName, setAvatarName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchAvatars = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/available/avatars`)
      setAvatars(res.data.avatars)
    } catch (error) {
      toast.error('Error while fetching avatars')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAvatars()
  }, [])

  const handleAddAvatar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!avatarName || !avatarUrl) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      await axios.post(`${BACKEND_URL}/admin/add-avatar`, { name: avatarName, imageUrl: avatarUrl }, {
        headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success('Avatar added successfully')
      setAvatarName("")
      setAvatarUrl("")
      fetchAvatars()
    } catch (error) {
      toast.error('Error adding avatar')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAvatar} className="space-y-4">
            <Input
              type="text"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              placeholder="Avatar name"
              aria-label="Avatar name"
            />
            <Input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Avatar image URL"
              aria-label="Avatar image URL"
            />
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Avatar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Avatars</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : avatars && avatars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {avatars.map((avatar, index) => (
                <div key={avatar.id || index} className="transition-all duration-300 ease-in-out hover:scale-105">
                  <AvatarCard name={avatar.name} imageUrl={avatar.imageUrl} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No avatars added yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
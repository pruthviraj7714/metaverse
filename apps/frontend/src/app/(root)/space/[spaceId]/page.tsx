"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"
import { toast } from "sonner"
import { BACKEND_URL } from "@/config/config"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  x: number
  y: number
}

interface SpaceInfo {
  id: string
  name: string
  map: {
    backgroundBaseUrl: string
    dimensions: {
      width: number
      height: number
    }
  }
}

export default function SpacePage({
  params,
}: {
  params: Promise<{
    spaceId: string;
  }>
}) {
  const [spaceId, setSpaceId] = useState<string | null>(null)
  const [spaceInfo, setSpaceInfo] = useState<SpaceInfo | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Unwrap the params Promise
    async function unwrapParams() {
      const resolvedParams = await params;
      setSpaceId(resolvedParams.spaceId);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!spaceId) return;

    const fetchSpace = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

      if (!token) {
        toast.error("No token found")
        router.push('/')
        return
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/space/${spaceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setSpaceInfo(res.data)
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred")
        router.push('/')
      }
    }

    fetchSpace()
  }, [spaceId, router])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) return

    const ws = new WebSocket(`ws://localhost:8080/`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connection established')
      ws.send(JSON.stringify({
        type: 'join',
        payload: { spaceId, token }
      }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('Received message:', data)

      switch (data.type) {
        case 'user-joined':
          if (data.payload.spawn) {
            setCurrentUser({ id: 'current', ...data.payload.spawn })
            setUsers(data.payload.users)
          } else {
            setUsers(prevUsers => [...prevUsers, { id: data.payload.userId, x: data.payload.x, y: data.payload.y }])
          }
          break
        case 'movement':
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === data.payload.userId ? { ...user, ...data.payload } : user
            )
          )
          break
        case 'user-left':
          setUsers(prevUsers => prevUsers.filter(user => user.id !== data.payload.userId))
          break
      }
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [spaceInfo, spaceId])

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!currentUser || !wsRef.current) return

    let newX = currentUser.x
    let newY = currentUser.y

    switch (direction) {
      case 'up':
        newY = Math.max(0, currentUser.y - 1)
        break
      case 'down':
        newY = Math.min((spaceInfo?.map.dimensions.height || 0) - 1, currentUser.y + 1)
        break
      case 'left':
        newX = Math.max(0, currentUser.x - 1)
        break
      case 'right':
        newX = Math.min((spaceInfo?.map.dimensions.width || 0) - 1, currentUser.x + 1)
        break
    }

    wsRef.current.send(JSON.stringify({
      type: 'move',
      payload: { x: newX, y: newY }
    }))

    setCurrentUser(prev => prev ? { ...prev, x: newX, y: newY } : null)
  }

  if (!spaceInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <img 
        src={spaceInfo.map.backgroundBaseUrl} 
        alt={`Background for ${spaceInfo.name}`} 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <div className="relative w-full h-full">
          {users.map((user) => (
            <Avatar
              key={user.id}
              className="absolute"
              style={{
                left: `${(user.x / spaceInfo.map.dimensions.width) * 100}%`,
                top: `${(user.y / spaceInfo.map.dimensions.height) * 100}%`,
              }}
            >
              <AvatarFallback>{'A'}</AvatarFallback>
            </Avatar>
          ))}
          {currentUser && (
            <Avatar
              className="absolute border-2 border-green-500"
              style={{
                left: `${(currentUser.x / spaceInfo.map.dimensions.width) * 100}%`,
                top: `${(currentUser.y / spaceInfo.map.dimensions.height) * 100}%`,
              }}
            >
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-opacity-80 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <Button onClick={() => handleMove('up')}>Up</Button>
          <div></div>
          <Button onClick={() => handleMove('left')}>Left</Button>
          <div></div>
          <Button onClick={() => handleMove('right')}>Right</Button>
          <div></div>
          <Button onClick={() => handleMove('down')}>Down</Button>
          <div></div>
        </div>
      </Card>
    </div>
  )
}

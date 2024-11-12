"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Plus, User, LogOut } from "lucide-react";

export default function Appbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded?.role === "Admin") {
      setIsAdmin(true);
    }
    if (decoded?.username) {
      setUsername(decoded.username);
    }
  }, [router]);


  return (
    <div className="flex justify-between items-center p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Metaverse</h1>
        {isAdmin && (
          <nav className="hidden md:flex space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/add-map")}
            >
              <MapPin className="mr-2 h-4 w-4" /> Add Map
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/add-element")}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Element
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/add-avatar")}
            >
              <User className="mr-2 h-4 w-4" /> Add Avatar
            </Button>
          </nav>
        )}
        <Button
          onClick={() => {
            router.push("/create-space");
          }}
        >
          Create Space
        </Button>
      </div>

      <div>
        <Button
          variant={"destructive"}
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

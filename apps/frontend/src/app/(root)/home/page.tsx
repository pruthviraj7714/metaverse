"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "@/config/config";
import Appbar from "@/components/Appbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchSpaces = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/space/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSpaces(res.data.spaces);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch spaces");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <Appbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Your Spaces
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : spaces && spaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card
                onClick={() => {
                  router.push(`/space/${space.id}`);
                }}
                key={space.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader className="p-0">
                  <img
                    src={space.map.backgroundBaseUrl}
                    alt={`Background for ${space.name}`}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{space.name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created on {new Date(space.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full group">
                    View Space
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-md mx-auto text-center p-6">
            <CardContent>
              <p className="text-xl mb-4">No Spaces found!</p>
              <Button onClick={() => router.push('/create-space')} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Space
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

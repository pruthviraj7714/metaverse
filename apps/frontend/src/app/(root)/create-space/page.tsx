"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "@/config/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateSpacePage() {
  const [maps, setMaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chosenMapId, setChosenMapId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/available/maps`);
        setMaps(res.data.maps);
      } catch (error) {
        toast.error("Error while fetching maps");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaps();
  }, []);

  const handleMapSelect = (mapId: number) => {
    setChosenMapId(mapId);
    toast.success("Map selected!");
  };

  const createSpace = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/space/create`,
        {
          mapId: chosenMapId,
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Space Successfully Created!");
      router.push("/home");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Create Your Space
      </h1>

      {/* Thumbnail Input */}
      <div className="w-full max-w-lg">
        <Input
          type="text"
          placeholder="Enter Name for space"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Map Selection */}
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Choose a Map
        </h2>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            Loading... {/* Display a spinner while loading */}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {maps.length > 0 ? (
              maps.map((map) => (
                <div
                  key={map.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 shadow-lg transition-transform transform hover:scale-105 ${
                    chosenMapId === map.id
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleMapSelect(map.id)}
                >
                  <img
                    src={map.backgroundBaseUrl}
                    alt={map.name}
                    className="object-cover w-full h-40 filter brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                    <p className="text-white text-lg font-semibold">
                      {map.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No maps available</p>
            )}
          </div>
        )}
      </div>

      {/* Create Button */}
      <Button
        disabled={!name || chosenMapId === null}
        onClick={createSpace}
        className="w-full max-w-lg mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Create Space
      </Button>
    </div>
  );
}

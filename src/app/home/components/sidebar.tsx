"use client"

import { Button } from "@/components/ui/button" 
import { ChevronRight, LogOut  } from "lucide-react" 
import { useRouter } from "next/navigation"

export default function Sidebar(){
    const sidebarOptions = [
    { name: "Ver Pokémons", path: "/pokemons" },
    { name: "Gerenciar Time", path: "/team-management" },
    { name: "Criar Time", path: "/create-team" },
    ]

    const router = useRouter()

    const logout = () => {

    }

    return (
        <aside className="w-64 min-h-screen bg-neutral-900 text-white p-4 shadow-lg flex flex-col">
            <h1 className="text-xl font-bold mb-4 text-red-500 border-b border-red-500 pb-2 text-center font-pokeHollow">
                PokeTeam
            </h1>

            <div className="flex-1 flex flex-col space-y-2">
                {sidebarOptions.map((option) => (
                <Button
                    key={option.name}
                    variant="ghost"
                    className="justify-start text-left text-sm font-medium hover:bg-red-700 hover:text-white transition-colors duration-200 focus:ring-1 focus:ring-red-500"
                    onClick={() => router.push(`home/${option.path}`)}
                >
                    <ChevronRight className="mr-2 h-4 w-4 text-red-500" />
                    {option.name}
                </Button>
                ))}
            </div>

            <LogOut onClick={logout} className="mt-auto cursor-pointer hover:text-gray-500" />
        </aside>
    )
}
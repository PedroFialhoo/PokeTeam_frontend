"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const sidebarOptions = [
    { name: "Ver Pokémons", path: "/pokemons" },
    { name: "Criar Time", path: "/create-team" },
    { name: "Gerenciar Time", path: "/management-team" },
  ]

  function logout (){
    const token = localStorage.getItem("poketeam-token")

    fetch("http://127.0.0.1:8000/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        localStorage.removeItem("poketeam-token")
        router.replace("/")
      }
    })
  }
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-2 left-0 z-[9999] bg-neutral-900 text-white p-2 rounded-r-xl shadow-lg"
      >
        {open ? <ChevronLeft /> : <ChevronRight />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-neutral-900 text-white shadow-lg
                    transition-all duration-300 flex flex-col p-4
                    ${open ? "w-56 z-40" : "w-0 overflow-hidden"}`}
      >
        {open && (
          <>
            <h1 className="text-xl font-bold mb-4 text-red-500 border-b border-red-500 pb-2 text-center font-pokeHollow">
              PokeTeam
            </h1>

            <div className="flex-1 flex flex-col space-y-2">
              {sidebarOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="ghost"
                  className="justify-start text-left text-sm font-medium
                             hover:bg-red-700 hover:text-white transition-colors"
                  onClick={() => router.replace(`/home/${option.path}`)}
                >
                  <ChevronRight className="mr-2 h-4 w-4 text-red-500" />
                  {option.name}
                </Button>
              ))}
            </div>

            <LogOut
              onClick={() => logout()}
              className="mt-auto cursor-pointer hover:text-gray-500"
            />
          </>
        )}
      </aside>
    </>
  )
}

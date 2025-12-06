"use client"

import { useEffect, useState } from "react"
import PokeCard from "./components/pokeCard";
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  number: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  photo: string;
}

export default function Pokemons() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  function getPokemons() {
    setLoading(true)
    const token = localStorage.getItem('poketeam-token')
    fetch("http://127.0.0.1:8000/api/pokemon/getPokemons", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data)
        setLoading(false)
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    getPokemons()
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {loading ? (
        <div className="flex flex-row items-center justify-center space-y-2 mt-4">
          <Spinner className="w-8 h-8 text-red-500" />
          <span className="ml-2 text-red-500 font-semibold text-4xl">Carregando...</span>
        </div>
      ) : (
        <>
          {pokemons.map((pokemon) => (
            <PokeCard key={pokemon.id} pokemon={pokemon} />
          ))}
          <Button className="flex items-center justify-center bg-red-800">
            <Plus />
          </Button>
        </>
      )}
    </div>
  )
}

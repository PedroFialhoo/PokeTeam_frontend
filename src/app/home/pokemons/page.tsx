"use client"

import { useEffect, useState } from "react"
import PokeCard from "./components/pokeCard";
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

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
    const currentOffset = pokemons.length 

    fetch(`http://127.0.0.1:8000/api/pokemon/getPokemons?offset=${currentOffset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setPokemons((prev) => [...prev, ...data])
        setLoading(false)
      })
      .catch((err) => console.error(err))
  }


  useEffect(() => {
    if (pokemons.length === 0) {
      getPokemons();
    }
  }, []);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 max-w-[50%]">
        <div className="relative flex-1">
          <Input
            className="pl-10 hover:bg-neutral-300"
            placeholder="Buscar pelo nome..."
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <Button className="bg-red-500 hover:border-2 hover:bg-gray-800 hover:border-red-500">Buscar</Button>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">     
        {pokemons.map((pokemon) => (
            <PokeCard key={pokemon.id} pokemon={pokemon} />
        ))}

        {!loading && (
          <Button className="flex items-center justify-center bg-red-800" onClick={() =>getPokemons()}>
            <p>Carregar mais</p>
            <Plus />
          </Button>
        )}

        {loading && (
          <div className="flex flex-row items-center justify-center space-y-2 mt-4">
            <Spinner className="w-8 h-8 text-red-500" />
            <span className="ml-2 text-red-500 font-semibold text-4xl">Carregando...</span>
          </div>
        )}
        
      </div>
    </div>
  )
}

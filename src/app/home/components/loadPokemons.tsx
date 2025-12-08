/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import PokeCard from "./pokeCard";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Pokemon {
  id: number;
  name: string;
  number: number;
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
  photo: string;
}

export default function LoadPokemons({team, setTeam, allowAdd,}: {team?: any[]; setTeam?: (newTeam: any[]) => void; allowAdd: boolean;}){
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonSearch, setPokemonSearch] = useState<Pokemon>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [offset, setOffset] = useState(0);
  const loadedIds = useRef(new Set<number>());
  const [nameSearch, setNameSearch] = useState<string>("")

  function getPokemons() {
    if (loading) return
    setLoading(true);
    const token = localStorage.getItem("poketeam-token");

    fetch(
      `http://127.0.0.1:8000/api/pokemon/getPokemons?offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((p: Pokemon) => {
          if (loadedIds.current.has(p.id)) return false;
            loadedIds.current.add(p.id);
            return true;
        });
        
        setPokemons(prev => [...prev, ...filtered]);
        setOffset((prev) => prev + 20);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }

  function getPokemonByName() {
    console.log("Buscando pokemon por nome:", nameSearch);
    if (!nameSearch.trim()) {
      alert("Digite um nome para buscar");
      return;
    }

    if (loadingSearch) return;
    setLoadingSearch(true);

    const token = localStorage.getItem("poketeam-token");

    fetch(`http://127.0.0.1:8000/api/pokemon/getPokemonByName`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: nameSearch.toLowerCase() }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPokemonSearch(data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSearch(false))
      
      
  }

  useEffect(() => {
    if (!nameSearch.trim()) {
      setPokemonSearch(undefined);
    }
  }, [nameSearch]);

  useEffect(() => {
    getPokemons();
  }, []);

  function addPokemon(pokemon: any) {
    if (!allowAdd || !team || !setTeam) return;

    const index = team.findIndex((slot) => !slot);
    if (index !== -1) {
      const newTeam = [...team];
      newTeam[index] = pokemon;
      setTeam(newTeam);
      alert(`${pokemon.name} adicionado ao time!`);
      return;
    }
    else{
      alert('Time completo, para adicionar um novo pokémon clique em um pokemon já selecionado para remove-lo do time!')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 max-w-[50%]">
        <div className="relative flex-1">
          <Input
            className="pl-10 hover:bg-neutral-300"
            placeholder="Buscar pelo nome..."
            value={nameSearch}            
            onChange={(e) => setNameSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        </div>
        <Button
          className="bg-red-500 hover:border-2 hover:bg-gray-800 hover:border-red-500"
          onClick={() => getPokemonByName()}
          disabled={loadingSearch} 
        >
          {loadingSearch ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pokemonSearch && 
        <PokeCard
            key={pokemonSearch.id}
            pokemon={pokemonSearch}
            onClick={() => addPokemon(pokemonSearch)}
          />}
        {pokemons.map((pokemon) => (
          <PokeCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => addPokemon(pokemon)}
          />
        ))}

        {!loading && (
          <Button
            className="flex items-center justify-center bg-red-800"
            onClick={() => getPokemons()}
          >
            <p>Carregar mais</p>
            <Plus />
          </Button>
        )}

        {loading && (
          <div className="flex flex-row items-center justify-center space-y-2 mt-4">
            <Spinner className="w-8 h-8 text-red-500" />
            <span className="ml-2 text-red-500 font-semibold text-4xl">
              Carregando...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

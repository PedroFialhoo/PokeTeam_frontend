/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PokeCard from "@/app/home/components/pokeCard";
import { ChevronLeft } from "lucide-react";

interface Pokemon {
  id: number;
  name: string;
  photo: string;
  photo_shiny: string | null;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
  abilities: {
    ability: { name: string };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
}

export default function TeamPage() {
  const [team, setTeam] = useState<(Pokemon | null)[]>([null, null, null, null, null,]);
  const [teamName, setTeamName] = useState<string>("");

  const { idTeam } = useParams();
  function getTeam() {
    const token = localStorage.getItem("poketeam-token");

    fetch("http://127.0.0.1:8000/api/team/get", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ team_id: idTeam }),
    })
    .then((response) => response.json())
    .then((data) => {
        const pokes = data.team.pokemons || [];

        const formatted = pokes.map((p: any) => ({
        ...p,
        id: p.pokemon_id, 
        }))
        setTeam([
            formatted[0] || null,
            formatted[1] || null,
            formatted[2] || null,
            formatted[3] || null,
            formatted[4] || null,
        ])
        setTeamName(data.team.name)
    })
    .catch((err) => console.log(err))
    }

  useEffect(() => {
    getTeam();
  }, []);

  const router = useRouter()
  function seeDetails(pokemon: any) {
    router.replace(`/home/pokemons/${pokemon.id}`);
  }
  
  return (
    <div className="flex flex-col ">
        <div className="flex hover:text-red-600" onClick={() => router.replace("/home/management-team")}>
            <ChevronLeft />
            <p>Voltar</p>
        </div>
        <h1 className="font-pokeSolid text-red-500 fine-border text-5xl mb-10 md:text-5xl text-center drop-shadow-lg">{teamName}</h1>
        <div className="flex flex-wrap gap-6 justify-center">
            {team.map((poke) => (
                poke && (
                <div key={poke.id}
                className="md:w-96">
                    <PokeCard                
                    pokemon={poke}
                    onClick={() => {
                        seeDetails(poke)
                    }}
                    /> 
                </div>     
                )    
            ))}
        </div>
      </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyCard from "../components/emptyCard";
import LoadPokemons from "../components/loadPokemons";

export default function CreateTeam() {
  const [team, setTeam] = useState<(any | null)[]>([null, null, null, null, null]);
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<boolean>();

  function removePokemon(poke: any, index: number) {
    if (!poke) return;
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  }

  function createTeam() {
    if (!name || !team || team.every((slot) => slot === null)) {
      return alert("Insira o nome e pelo menos 1 pokémon");
    }

    const pokemons_id = [];
    for (let i = 0; i < team.length; i++) {
      const pokemon = team[i];
      if (pokemon !== null) {
        pokemons_id.push(pokemon.id);
      }
    }

    const token = localStorage.getItem("poketeam-token");
    fetch("http://127.0.0.1:8000/api/team/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        pokemons_id: pokemons_id,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setMessage("Time criado com sucesso");
          setStatus(true);
        } else {
          setMessage("Erro ao criar time");
          setStatus(true);
        }
      })
      .catch(() => {
        setMessage("Erro ao criar time");
        setStatus(true);
      });

    setTeam([null, null, null, null, null]);
    setName("");
  }

  return (
    <div className="px-4 md:px-0">
      <h1 className="font-semibold text-3xl md:text-5xl mb-3 text-center drop-shadow-lg">
        Monte o melhor time
        <span className="font-pokeSolid text-red-500 fine-border">Pokemon</span>!
      </h1>
      
      <div className="border-2 border-gray-200 flex flex-col rounded-2xl p-4 bg-slate-200 mb-6">
        <Input
          className="bg-slate-50 pl-4 hover:bg-neutral-300 mb-4 w-full md:w-[50%] drop-shadow-md self-center"
          placeholder="Nome da equipe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-4 md:flex md:space-x-4 md:justify-center md:items-center">
          {team.map((poke, index) => (
            <EmptyCard
              key={index}
              pokemon={poke}
              onClick={() => removePokemon(poke, index)}
            />
          ))}
        </div>
        <Button
          className="bg-red-500 hover:border-2 hover:bg-gray-800 hover:border-red-500 w-full md:w-[20%] self-center mt-4"
          onClick={() => createTeam()}
        >
          Criar time
        </Button>

        {status && <p className="text-center mt-3">{message}</p>}
      </div>

      <LoadPokemons team={team} setTeam={setTeam} allowAdd={true} />
    </div>
  );
}

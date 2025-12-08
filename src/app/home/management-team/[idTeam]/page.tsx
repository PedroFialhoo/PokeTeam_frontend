/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyCard from "../../components/emptyCard";
import LoadPokemons from "../../components/loadPokemons";
import { useParams } from "next/navigation";

export default function CreateTeam() {
  const [team, setTeam] = useState<(any | null)[]>([null,null,null,null,null,]) //definindo tamanho maximo de 5 pokemons
  const [name, setName] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [status, setStatus] = useState<boolean>()

  const { idTeam} = useParams()
  function removePokemon(poke: any, index: number) {
    if (!poke) return;
    const newTeam = [...team]
    newTeam[index] = null
    setTeam(newTeam)
  }

  function editTeam() {
    if (!name || !team || team.every((slot) => slot === null)) {
      return alert("Insira o nome e pelo menos 1 pokémon")
    }
    const pokemons_id = []

    for (let i = 0; i < team.length; i++) {
        const pokemon = team[i]
        if (pokemon !== null) {
        pokemons_id.push(pokemon.id)
        }
    }
    const token = localStorage.getItem('poketeam-token')
    fetch('http://127.0.0.1:8000/api/team/edit', {
        method: 'PUT',
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify({
            name: name,
            pokemons_id: pokemons_id,
            team_id: idTeam
        })
    })
    .then(res => {
        if (res.ok) {
            setMessage("Time editado com sucesso");
            setStatus(true);
        }else{
            setMessage("Erro ao editar time");
            setStatus(true);
        }
    })
    .catch((error) => {
        console.error("Edit team: error! Error:", error)
        setMessage("Erro ao editar time")
        setStatus(true)
      })
  }

  function deleteTeam(){}//fazer

  function getTeam(){
    const token = localStorage.getItem("poketeam-token");

    fetch("http://127.0.0.1:8000/api/team/get", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ team_id: idTeam }),
    })
    .then((res) => res.json())
    .then((data) => {
      const pokemons = data.team.pokemons || []
      const fiveSlots = Array(5).fill(null)
      for (let i = 0; i < pokemons.length; i++) {
        fiveSlots[i] = pokemons[i]
      }
      setTeam(fiveSlots)
      setName(data.team.name)
    })
    .catch((err) => {
      console.error(err);
   });
  }
  useEffect(() => {
    getTeam()
  }, []);

  return (
    <div className="">
      <h1 className="font-semibold text-5xl mb-3 text-center drop-shadow-lg">
        Monte o melhor time{" "}
        <span className="font-pokeSolid text-red-500 fine-border">Pokemon</span>
        !
      </h1>

      <div className="border-2 border-gray-200 flex flex-col rounded-2xl p-4 bg-slate-200 mb-6 min-h-max">
        <Input
          className="bg-slate-50 pl-4 hover:bg-neutral-300 mb-4 w-[50%] drop-shadow-md self-center "
          placeholder="Nome da equipe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex space-x-4 justify-center items-center">
          {team.map((poke, index) => (
            <EmptyCard
              key={index}
              pokemon={poke}
              onClick={() => removePokemon(poke, index)}
            />
          ))}
        </div>
        <div className="flex flex-row self-center gap-4 w-full justify-center">
          <Button
            className="bg-red-500 hover:border-2 hover:bg-gray-800 hover:border-red-500 w-[20%] self-center mt-4"
            onClick={() => editTeam()}
          >
            Editar time
          </Button>
          <Button
            className="hover:bg-red-500 border-2 bg-gray-800 border-red-500 w-[20%] self-center mt-4"
            onClick={() => deleteTeam()}
          >
            Excluir time
          </Button>
        </div>        
        {status && <p className="text-center mt-3">{message}</p>}
      </div>

      <LoadPokemons team={team} setTeam={setTeam} allowAdd={true} />
    </div>
  );
}

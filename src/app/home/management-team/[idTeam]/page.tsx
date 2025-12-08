/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyCard from "../../components/emptyCard";
import LoadPokemons from "../../components/loadPokemons";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function CreateTeam() {
  const [team, setTeam] = useState<(any | null)[]>([null,null,null,null,null,]) //definindo tamanho maximo de 5 pokemons
  const [name, setName] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [status, setStatus] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingAction, setLoadingAction] = useState<boolean>(false)
  const [loadingAction2, setLoadingAction2] = useState<boolean>(false)
  const router = useRouter()

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
    setLoadingAction(true)

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
            setLoadingAction(false)
        }else{
            setMessage("Erro ao editar time");
            setStatus(true);
            setLoadingAction(false)
        }
    })
    .catch((error) => {
        console.error("Edit team: error! Error:", error)
        setMessage("Erro ao editar time")
        setStatus(true)
        setLoadingAction(false)
      })
  }

  function deleteTeam(){
    const token = localStorage.getItem('poketeam-token')
    setLoadingAction2(true)
    fetch('http://127.0.0.1:8000/api/team/delete', {
        method: 'DELETE',
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify({
            team_id: idTeam
        })
    })
    .then(res => {
        if (res.ok) {
            setMessage("Time excluido com sucesso");
            setStatus(true);
            router.replace('/home/management-team')
            setLoadingAction2(false)            
        }else{
            setMessage("Erro ao excluir time");
            setStatus(true);
            setLoadingAction2(false)
        }
    })
    .catch((error) => {
        console.error("Delete team: error! Error:", error)
        setMessage("Erro ao excluir time")
        setStatus(true)
      })
  }

  function getTeam(){
    const token = localStorage.getItem("poketeam-token");
    setLoading(true);

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
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
   });
  }
  useEffect(() => {
    getTeam()
  }, []);

  return (
    <div className="px-4 md:px-0">
      <h1 className="font-semibold text-3xl md:text-5xl mb-3 text-center drop-shadow-lg">
        Monte o melhor time{" "}
        <span className="font-pokeSolid text-red-500 fine-border">Pokemon</span>!
      </h1>
      <div className="flex hover:text-red-600" onClick={() => router.replace("/home/management-team")}>
        <ChevronLeft />
        <p>Voltar</p>
      </div>
      <div className="border-2 border-gray-200 flex flex-col rounded-2xl p-4 bg-slate-200 mb-6">
        <Input
          className="bg-slate-50 pl-4 hover:bg-neutral-300 mb-4 w-full md:w-[50%] drop-shadow-md self-center"
          placeholder="Nome da equipe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-4 md:flex md:space-x-4 md:justify-center md:items-center">
          {team.map((poke, index) => (
            <EmptyCard key={index} pokemon={poke} onClick={() => removePokemon(poke, index)} />
          ))}
        </div>

        <div className="flex flex-col md:flex-row self-center gap-4 w-full justify-center">
          <Button
            className="bg-red-500 hover:border-2 hover:bg-gray-800 hover:border-red-500 w-full md:w-[20%] mt-4"
            onClick={() => editTeam()}
            disabled={loading}
          >
            {loading ? "Buscando time..." : loadingAction ? "Editando time..." : "Editar time"}
          </Button>

          <Button
            className="hover:bg-red-500 border-2 bg-gray-800 border-red-500 w-full md:w-[20%] mt-4"
            onClick={() => deleteTeam()}
            disabled={loading}
          >
            {loading ? "Buscando time..." : loadingAction2 ? "Excluindo time..." : "Excluir time"}
          </Button>
        </div>

        {status && <p className="text-center mt-3">{message}</p>}
      </div>

      <LoadPokemons team={team} setTeam={setTeam} allowAdd={true} />
    </div>
  )
}

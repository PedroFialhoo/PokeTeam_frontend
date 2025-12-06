/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import TeamCard from "./components/teamCard";
import { Spinner } from "@/components/ui/spinner";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("poketeam-token");
    setLoading(true);

    fetch("http://127.0.0.1:8000/api/team/getAll", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTeams(data.teams || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-semibold text-5xl mb-5 text-center drop-shadow-2xl">
        Meus Times
      </h1>

      {loading && (
        <div className="flex flex-row items-center justify-center mt-4">
          <Spinner className="w-8 h-8 text-red-500" />
          <span className="ml-2 text-red-500 font-semibold text-4xl">
            Carregando...
          </span>
        </div>
      )}

      {!loading && teams.length === 0 && (
        <p className="text-center text-xl mt-4">Nenhum time encontrado!</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import LoadPokemons from "../../components/loadPokemons";

export default function EditTeamPage() {
  const [team, setTeam] = useState<any[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Editar Time</h1>

      <LoadPokemons team={team} setTeam={setTeam} allowAdd />
    </div>
  );
}

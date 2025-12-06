/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TeamCard({ team }: any) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.replace(`/home/management-team/${team.id}`)}
      className="cursor-pointer bg-slate-200 p-4 rounded-xl hover:bg-slate-300 transition-transform duration-200 hover:-translate-y-3 "
    >
      <h2 className="text-xl font-semibold mb-2 text-center">{team.name}</h2>

      <div className="flex gap-2 flex-wrap justify-center">
        {(team.pokemons || []).map((p: any) => (          
          <Image 
            key={p.id}
            src={p.photo}
            alt={p.name}
            width={60}
            height={60}
          />
        ))}
      </div>
    </div>
  );
}

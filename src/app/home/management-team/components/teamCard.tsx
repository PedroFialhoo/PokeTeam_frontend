/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Pencil, View } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TeamCard({ team }: any) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.replace(`/home/management-team/${team.id}`)}
      className="cursor-pointer bg-slate-200 p-4 rounded-xl hover:bg-slate-300 transition-transform duration-200 hover:-translate-y-3 "
    >
      <div className="flex items-center justify-center gap-6">
        <h2 className="text-xl font-semibold mb-2 text-center">{team.name}</h2>

        <View className="hover:text-red-700" onClick={(e) => {
          e.stopPropagation()
          router.replace(`/home/management-team/view-team/${team.id}`)}
          }/>

        <Pencil className="hover:text-red-700" onClick={(e) => {
          e.stopPropagation()
          router.replace(`/home/management-team/${team.id}`)}
          }/>
      </div>      
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

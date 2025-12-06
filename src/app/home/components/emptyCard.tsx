/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusCircle } from "lucide-react";
import Image from "next/image";

export default function EmptyCard({pokemon, onClick}: {pokemon?: any | null; onClick?: () => void;}){
  return (
    <div
      onClick={onClick}
      className="p-2 rounded-xl border-dashed border-2 border-gray-400 w-40 h-40 flex justify-center items-center bg-slate-100 cursor-pointer"
    >
      {pokemon ? (
        <Image
          src={pokemon.photo}
          alt={pokemon.name}
          width={120}
          height={120}
          className="object-contain"
        />
      ) : (
        <PlusCircle className="w-8 h-8 text-gray-500" />
      )}
    </div>
  );
}

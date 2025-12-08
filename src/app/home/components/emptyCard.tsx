/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusCircle } from "lucide-react";
import Image from "next/image";

export default function EmptyCard({pokemon, onClick}: {pokemon?: any | null; onClick?: () => void;}){
  return (
    <div
      onClick={onClick}
      className="p-2 rounded-xl border-dashed border-2 border-gray-400 w-20 h-20 md:w-40 md:h-40 flex justify-center items-center bg-slate-100 cursor-pointer"
    >
      {pokemon ? (
        <Image
          src={pokemon.photo}
          alt={pokemon.name}
          width={90}
          height={90}
          className="object-contain md:w-[120px] md:h-[120px]"
        />
      ) : (
        <PlusCircle className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
      )}
    </div>
  )
}

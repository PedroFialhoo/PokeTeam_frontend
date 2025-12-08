/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

// { formato do retorno
//   "id": 4,
//   "stats": [
//       {
//           "base_stat": 39,
//           "effort": 0,
//           "stat": {
//               "name": "hp",
//               "url": "https://pokeapi.co/api/v2/stat/1/"
//           }
//       },
//   ],
//   "url": null,
//   "name": "charmander",
//   "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
//   "photo_shiny": null,
//   "types": [
//       {
//           "slot": 1,
//           "type": {
//               "name": "fire",
//               "url": "https://pokeapi.co/api/v2/type/10/"
//           }
//       }
//   ],
//   "height": 0.6,
//   "weight": 8.5,
//   "abilities": [
//       {
//           "ability": {
//               "name": "blaze",
//               "url": "https://pokeapi.co/api/v2/ability/66/"
//           },
//           "is_hidden": false,
//           "slot": 1
//       },
//   ],
//   "status": []
// }

export default function PokemonPage() {
  const { id } = useParams();
  const token = localStorage.getItem("poketeam-token");

  const [pokemonSearch, setPokemonSearch] = useState<Pokemon | null>(null);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(true);

  const router = useRouter()

  useEffect(() => {
    if (!id || !token) return;

    fetch(`http://127.0.0.1:8000/api/pokemon/getPokemon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pokemon_id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPokemonSearch(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSearch(false));
  }, [id, token]);

  const [photo, setPhoto] = useState<string>("")

  useEffect(() => {
    if (!pokemonSearch) return;
    setPhoto(pokemonSearch.photo)
  }, [pokemonSearch])

  function changeShiny() {
    if (!pokemonSearch || !pokemonSearch.photo_shiny) return
    if(photo === pokemonSearch.photo) {      
      setPhoto(pokemonSearch.photo_shiny)
    }
    else if(photo === pokemonSearch.photo_shiny){
      setPhoto(pokemonSearch.photo)
    }
  }
  return (
    <div>
      <div className="flex hover:text-red-600" onClick={() => router.replace("/home/pokemons")}>
        <ChevronLeft />
        <p>Voltar</p>
      </div>
      

      {loadingSearch && (
        <div className="flex flex-row items-center justify-center space-y-2 mt-4">
          <Spinner className="w-8 h-8 text-red-500" />
          <span className="ml-2 text-red-500 font-semibold text-4xl">
            Carregando...
          </span>
        </div>
      )}

      {!loadingSearch && pokemonSearch && (
        <>
          <h1 className="font-semibold text-3xl md:text-5xl mb-3 text-center drop-shadow-lg">
            Detalhes do
            <span className="font-pokeSolid text-red-500 fine-border"> Pokemon</span>!
          </h1>
          <div
            id="pokemonDetail"
            className="bg-zinc-800 flex flex-col justify-center items-center w-[700px] max-w-[90vw] p-10 pb-10 mx-auto rounded-2xl"
          >
            <div className="poke-container relative w-full h-[300px] flex justify-center items-end rounded-2xl overflow-hidden mb-5">
              <div
                className="poke-background absolute inset-0 bg-cover bg-center blur-[1px] brightness-90"
                style={{
                  backgroundImage: `url('/assets/images/background-${pokemonSearch.types[0].type.name}.png'), url('/assets/images/background-normal.png')`,
                }}
              ></div>

              <Image
                src={photo}
                alt={pokemonSearch.name}
                width={90}
                height={90}
                className="w-[290px] relative z-[1]"
              />
            </div>

            <h1 className="text-4xl font-bold capitalize text-slate-200">
              {pokemonSearch.name}
            </h1>

            <button className="bg-slate-300 px-4 py-2 mt-2 rounded-xl font-semibold hover:bg-slate-400" onClick={() => changeShiny()}>
              Shiny
            </button>
            <div className="infos-details w-full bg-slate-300 m-2 rounded-2xl p-4">
              <h3 className="text-xl font-semibold mb-2">Tipo</h3>
              <ol>
                {pokemonSearch.types.map((t, i) => (
                  <li key={i} className="capitalize">
                    {t.type.name}
                  </li>
                ))}
              </ol>
            </div>
            <div className="infos-details w-full bg-slate-300 m-2 rounded-2xl p-4">
              <h3 className="text-xl font-semibold mb-2">Atributos</h3>
              <ol>
                <li>Altura - {pokemonSearch.height} m</li>
                <li>Peso - {pokemonSearch.weight} kg</li>
              </ol>
            </div>
            <div className="infos-details w-full bg-slate-300 m-2 rounded-2xl p-4">
              <h3 className="text-xl font-semibold mb-2">Habilidades</h3>
              <ol>
                {pokemonSearch.abilities.map((a, i) => (
                  <li key={i} className="capitalize">
                    {a.ability.name}
                  </li>
                ))}
              </ol>
            </div>
            <div
              id="status"
              className="infos-details w-full bg-slate-300 m-2 rounded-2xl p-6 gap-4"
            >
              <h3 className="text-xl font-semibold">Status</h3>

              {pokemonSearch.stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <p className="capitalize font-medium">{stat.stat.name} – {stat.base_stat}%</p>

                  <div className="w-full h-[12px] bg-gray-400 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${stat.base_stat}%` }}
                    />
                  </div>
                </div>
              ))}

            </div>
          </div>
        </>
      )}
    </div>
  );
}

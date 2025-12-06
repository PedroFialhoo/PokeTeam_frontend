interface Pokemon {
  id: number;
  name: string;
  number: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  photo: string;
}

interface PokeCardProps {
  pokemon: Pokemon;
}

const typeColors: Record<string, string> = {
  normal: "bg-[#8d8e72]",
  grass: "bg-[#53a02f]",
  fire: "bg-[#ce661c]",
  water: "bg-[#678fee]",
  electric: "bg-[#ddb100]",
  ice: "bg-[#98d5d7]",
  ground: "bg-[#a08d59]",
  flying: "bg-[#a98ff0]",
  poison: "bg-[#a040a0]",
  fighting: "bg-[#bf3029]",
  psychic: "bg-[#f65687]",
  dark: "bg-[#725847]",
  rock: "bg-[#b8a137]",
  bug: "bg-[#a8b720]",
  ghost: "bg-[#6e5896]",
  steel: "bg-[#b9b7cf]",
  dragon: "bg-[#6f38f6]",
  fairy: "bg-[#f9aec7]",
};

export default function PokeCard({ pokemon }: PokeCardProps) {
  return (
    <div
      className={`p-4 rounded-xl shadow flex flex-col transition-transform duration-200 hover:-translate-y-3 hover:brightness-90 ${
        typeColors[pokemon.types[0].type.name] || "bg-gray-400"
      }`}
    >
      <span className="text-black opacity-30 text-right text-sm">#{pokemon.id}</span>
      <h2 className="text-white text-lg font-bold capitalize mb-1">{pokemon.name}</h2>
      <div className="flex justify-between items-center mt-2">
        <ul className="flex flex-col space-y-2 ">
          {pokemon.types.map((t) => (
            <li
              key={t.slot}
              className={`text-white px-3 py-2 rounded-3xl text-s font-light brightness-125 shadow-sm min-w-[80px] text-center ${
                typeColors[t.type.name] || "bg-gray-500"
              }`}
            >
              {t.type.name}
            </li>
          ))}
        </ul>
        <img
            src={pokemon.photo}
            alt={pokemon.name}
            className="w-[100px] h-[100px] object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
}
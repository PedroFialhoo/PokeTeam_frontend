"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RegisterProps {
  setSection: (section: string) => void;
}

export default function Register({ setSection }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(false);
    setSuccess(false);


    if (name.length < 3 || !validateEmail(email) || password.length < 3) {        
        setCreating(true)
        setSuccess(false)        
        return
    }

    fetch("http://127.0.0.1:8000/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => {
        setCreating(true);
        if (response.ok) {
          console.log("Register user: successfully!");
          setSuccess(true);
        } else {
          console.error("Register user: unsuccessfully! Status:", response.status);
          setSuccess(false);
        }
      })
      .catch((error) => {
        console.error("Register user: error! Error:", error);
        setCreating(true);
        setSuccess(false);
      });
  };

  return (
    <div className="min-h-[450px] p-8 sm:p-20 rounded-xl bg-red-900/80 text-white space-y-8 sm:space-y-32 shadow-2xl border-2 border-cyan-950 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <h1 className="font-semibold text-4xl font-pokeSolid text-stroke whitespace-nowrap">PokeTeam | Cadastro</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 justify-end">
        <Input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-200 text-black placeholder-gray-500 focus:bg-gray-300 hover:bg-gray-300"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-200 text-black placeholder-gray-500 focus:bg-gray-300 hover:bg-gray-300"
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-200 text-black placeholder-gray-500 focus:bg-gray-300 hover:bg-gray-300"
        />
        <Button type="submit" className="bg-gray-900 hover:bg-gray-800">Cadastrar</Button>
        {creating && success && (
          <p className="text-green-500 font-bold">Conta criada com sucesso!</p>
        )}
        {creating && !success && (
          <p className="text-red-500 font-bold">Erro ao criar conta!</p>
        )}
        <p
          className="text-white hover:text-gray-400 cursor-pointer"
          onClick={() => setSection("login")}
        >
          Já possui uma conta? Realize o login
        </p>
      </form>
    </div>
  );
}

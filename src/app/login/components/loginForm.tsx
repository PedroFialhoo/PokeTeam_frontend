"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface LoginProps {
  setSection: (section: string) => void;
}

export default function Login({ setSection }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [logging, setLogging] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogging(false);
    setSuccess(false);

    if (!validateEmail(email) || password.length < 3) {
      setLogging(true);
      setSuccess(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        setLogging(true);
        if (response.ok) {
          return response.json();
        } else {
          setSuccess(false);
          throw new Error(`User login: unsuccessfully! Status: ${response.status}`);
        }
      })
      .then((result) => {
        const token = result.token;
        localStorage.setItem("authToken", token);
        console.log("User login: successfully! Token saved.");
        setSuccess(true);
        router.push("/home");
      })
      .catch((error) => {
        console.error("User login: error!\nError:", error);
        setSuccess(false);
      });
  };

  return (
    <div className="min-h-[450px] p-8 sm:p-20 rounded-xl bg-red-900 text-white space-y-8 sm:space-y-32 shadow-2xl border-2 border-cyan-950 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <h1 className="font-semibold text-4xl">PokeTeam | Login</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 justify-end">
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
        <Button type="submit" className="bg-gray-900 hover:bg-gray-800">Entrar</Button>

        {logging && success && (
          <p className="text-green-500 font-bold">Login realizado com sucesso!</p>
        )}
        {logging && !success && (
          <p className="text-red-500 font-bold">Erro ao realizar login!</p>
        )}

        <p
          className="text-white hover:text-gray-400 cursor-pointer"
          onClick={() => setSection("register")}
        >
          Não tem uma conta? Cadastre-se
        </p>
      </form>
    </div>
  );
}

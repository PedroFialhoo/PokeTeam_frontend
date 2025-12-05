"use client"

import Image from "next/image";
import { useState } from "react";
import Login from "./components/loginForm";
import Register from "./components/registerForm";

export default function Auth() {
  const [section, setSection] = useState("login");

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center">
      
      <Image
        src="/assets/images/banner.jpg"
        alt="Banner"
        fill
        className="object-cover brightness-50 z-0"
      />

      <div className="absolute z-10 flex flex-col items-center justify-center">
        {section === "login" && <Login setSection={setSection}/>}        
        {section === "register" && <Register setSection={setSection}/>}      
      </div>
      



    </div>
  );
}

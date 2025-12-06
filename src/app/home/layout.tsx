"use client"
import { useEffect } from "react";
import Sidebar from "./components/sidebar";
import { useRouter } from "next/navigation";

export default function HomeLayout({ children }: { children: React.ReactNode }) {

const router = useRouter() 
useEffect(() => { 
    const token = localStorage.getItem('poketeam-token')
    if (!token){
         router.push('/login') }
    }, [router])

    return (
        <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-neutral-100">{children}</main>
        </div>
    );
}

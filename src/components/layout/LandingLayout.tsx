"use client";
import Features from "../landing-page/Features";
import Hero from "../landing-page/Hero";
import Navbar from "../landing-page/Navbar";
import About from "../landing-page/About";
import Footer from "../landing-page/Footer";
import {  useEffect, useState } from "react";
import { getalldata } from "@/utils/api/decentralized/publicapi";
import TaskDashboard from "./TaskDashboard";
// import TaskDashboard from "./TaskDashboard";

export default function LandingLayout() {
  const [data,setData]=useState(null);
  const fetchalldata=async()=>{
   try {
    const res=await getalldata()
    setData(res.data)

   } catch (error:any) {
    console.log(error)
   }
  }

 useEffect(() => {
  fetchalldata()
 }, [])
 console.log("All Task data",data)
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-blue-200 selection:text-blue-900">
      <Navbar />

      <main className="flex-grow">
        {/* <Hero />
        <Features />
        <About /> */}
        <TaskDashboard/>
      </main>

      <Footer />
    </div>
  );
}

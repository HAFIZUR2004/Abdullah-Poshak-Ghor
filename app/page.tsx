"use client";

import { useState, useEffect } from "react";
import BeautyShopSectionsPage from "@/components/BeautyShopSectionsPage";
import Reviews from "@/components/Reviews";
import PremiumLoader from "@/components/PremiumLoader";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (API call এর জন্য)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PremiumLoader />;
  }

  return (
    <>
    <Navbar/>
      <Hero />
      <BeautyShopSectionsPage />
      <Reviews />
      <Footer/>
    </>
  );
}

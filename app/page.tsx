"use client";

import { useState, useEffect } from "react";
import Reviews from "@/components/Reviews";
import PremiumLoader from "@/components/PremiumLoader";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoriesPage from "@/components/categories";
import Categories from "@/components/categories";
import CustomizationSection from "@/components/CustomizationSection";
import BestSellers from "@/components/BestSellers";
import CraftedForComfortBanner from "@/components/CraftedForComfortBanner";
import NewArrivalsPage from "@/components/NewArrivalsPage";
import MakeYourSpace from "@/components/todaydeals";
import WhyChoose from "@/components/WhyChoose";
import StatsBar from "@/components/StatsBar";
import DealOfTheWeek from "@/components/DealOfTheWeek";
import TopRatedProducts from "@/components/TopRatedProducts";
import DesignThatDefines from "@/components/DesignThatDefines";

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
      <Categories/>
      <CustomizationSection/>
      <BestSellers />
      <CraftedForComfortBanner/>
      <NewArrivalsPage/>
      <MakeYourSpace/>
      <WhyChoose/>
      <StatsBar/>
      <DealOfTheWeek/>
      <TopRatedProducts/>
      {/* <DesignThatDefines/> */}
      <Reviews />
      <Footer/>
    </>
  );
}

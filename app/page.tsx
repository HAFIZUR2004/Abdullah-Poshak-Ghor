// app/page.tsx
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Categories from "@/components/categories";
import CustomizationSection from "@/components/CustomizationSection";
import BestSellers from "@/components/BestSellers";
import CraftedForComfortBanner from "@/components/CraftedForComfortBanner";
import NewArrivalsPage from "@/components/NewArrivalsPage";
import MakeYourSpace from "@/components/todaydeals";
import StatsBar from "@/components/StatsBar";
import DealOfTheWeek from "@/components/DealOfTheWeek";
import TopRatedProducts from "@/components/TopRatedProducts";

// ✅ Server-side এ hero data fetch
async function getHeroImages(): Promise<string[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/hero`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch hero");
    const data = await res.json();

    if (data?.success && Array.isArray(data.hero?.heroImages)) {
      return data.hero.heroImages;
    }
    return [];
  } catch (error) {
    console.error("Failed to load hero images:", error);
    return [];
  }
}

export default async function Home() {
  const heroImages = await getHeroImages();

  return (
    <>
      <Navbar />
      <Hero initialImages={heroImages} />
      <Categories />
      <CustomizationSection />
      <BestSellers />
      <CraftedForComfortBanner />
      <NewArrivalsPage />
      <MakeYourSpace />
      <StatsBar />
      <DealOfTheWeek />
      <TopRatedProducts />
      <Footer />
    </>
  );
}
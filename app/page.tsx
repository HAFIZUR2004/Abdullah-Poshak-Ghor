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
import clientPromise from "@/lib/mongodb";

// ✅ ISR — 60 সেকেন্ডে একবার page rebuild
export const revalidate = 60;

// ✅ সরাসরি MongoDB থেকে — API route bypass
async function getHeroImages(): Promise<string[]> {
  try {
    const client = await clientPromise;
    const db = client.db("sareng_furniture");
    const data = await db.collection("heroes").findOne({});

    if (Array.isArray(data?.heroImages)) {
      return data.heroImages.filter(
        (img: unknown) => typeof img === "string" && img.trim() !== ""
      );
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
      {/* ✅ initialImages দিলে Hero client fetch করবে না, সাথে সাথে দেখাবে */}
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
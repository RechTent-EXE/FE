import { notFound } from "next/navigation";
import CategoryTabs from "@/components/product-page/category-tabs";
import CategoryHero from "@/components/product-page/category-hero";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
  params: Promise<{
    category: string;
  }>;
}

const validCategories = ["camera", "laptop", "dashcam", "flycam"];

export default async function ProductPage({ params }: ProductPageProps) {
  const { category } = await params;

  if (!validCategories.includes(category)) {
    notFound();
  }

  return (
    <div className="bg-gray-50 pt-20">
      <CategoryTabs />

      {/* Dynamic Hero Section */}
      <CategoryHero category={category} />

      {/* Main Content */}
      <ProductPageClient category={category} />
    </div>
  );
}

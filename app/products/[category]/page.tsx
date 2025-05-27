import { notFound } from "next/navigation";
import CategoryTabs from "@/components/product-page/category-tabs";
import CategoryHero from "@/components/product-page/category-hero";
import ProductFilters from "@/components/product-page/product-filters";
import ProductGrid from "@/components/product-page/product-grid";

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
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters category={category} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}

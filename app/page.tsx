import HeroSection from "@/components/homepage/hero-section";
import CategoriesSection from "@/components/homepage/categories-section";
import FeaturedProducts from "@/components/homepage/featured-products";
import HowItWorks from "@/components/homepage/how-it-works";
import BenefitsSection from "@/components/homepage/benefits-section";
import TestimonialsSection from "@/components/homepage/testimonials-section";

export default function RechTentLanding() {
  return (
    <div className="bg-white">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <HowItWorks />
      <BenefitsSection />
      <TestimonialsSection />
    </div>
  );
}

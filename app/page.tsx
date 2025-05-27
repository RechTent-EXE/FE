import Header from "@/components/homepage/header";
import HeroSection from "@/components/homepage/hero-section";
import CategoriesSection from "@/components/homepage/categories-section";
import FeaturedProducts from "@/components/homepage/featured-products";
import HowItWorks from "@/components/homepage/how-it-works";
import BenefitsSection from "@/components/homepage/benefits-section";
import TestimonialsSection from "@/components/homepage/testimonials-section";
import Footer from "@/components/homepage/footer";

export default function RechTentLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <HowItWorks />
      <BenefitsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}

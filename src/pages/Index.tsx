import Hero from "@/components/features/Hero";
import Subscription from "@/components/features/Subscription";
import About from "@/components/features/About";
import FAQ from "@/components/features/FAQ";
import Team from "@/components/features/Team";
import Testimonials from "@/components/features/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Subscription />
      <About />
      <FAQ />
      <Team />
      <Testimonials />
    </div>
  );
};

export default Index;

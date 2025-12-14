import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Subscription from "@/components/Subscription";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";


const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
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

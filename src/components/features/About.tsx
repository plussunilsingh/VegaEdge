import { Button } from "@/components/ui/button";
import { Lightbulb, Heart, Phone } from "lucide-react";
import { COMPANY_PHONE } from "@/config";

const About = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-primary text-xl font-bold mb-4">About Us</h4>
            <h1 className="text-4xl font-bold mb-6">
              Meet our company unless miss the opportunity
            </h1>
            <p className="text-muted-foreground mb-8">
              The data and prices on the website are not necessarily provided by any market or
              exchange, but may be provided by market makers, and so prices may not be accurate and
              may differ from the actual price at any given market, meaning prices are indicative
              and not appropriate for trading purposes.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Lightbulb className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Business Consulting</h4>
                  <p className="text-sm text-muted-foreground">
                    Start trading thousands of financial products online from secure trading
                    platforms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Heart className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Year Of Expertise</h4>
                  <p className="text-sm text-muted-foreground">
                    Over the years, a financial markets platform providing real-time data.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Button size="lg" className="rounded-full">
                Discover Now
              </Button>
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-primary" />
                <div>
                  <h4 className="font-bold">Call Us</h4>
                  <p className="text-lg tracking-wide">{COMPANY_PHONE}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary rounded-2xl overflow-hidden">
              <img src="/img/about-2.png" className="w-full" alt="About" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

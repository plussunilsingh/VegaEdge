import Team from "@/components/Team";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h4 className="text-primary text-xl font-bold mb-4">About Us</h4>
              <h1 className="text-4xl font-bold mb-6">Who We Are</h1>
              <p className="text-muted-foreground text-lg">
                Vega Greeks Calculator is a leading financial markets platform providing real-time data, quotes, charts, and breaking news analysis. We help traders and investors make informed decisions with cutting-edge VEGA prediction technology.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <div className="bg-card rounded-2xl p-8 text-center shadow-lg">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower traders with advanced analytics and real-time market insights for smarter trading decisions.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 text-center shadow-lg">
                <div className="text-5xl mb-4">👁️</div>
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the world's most trusted platform for market direction prediction and financial analysis.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 text-center shadow-lg">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-3">Our Values</h3>
                <p className="text-muted-foreground">
                  Accuracy, transparency, innovation, and commitment to our traders' success drive everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Team />

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Vega Greeks Calculator?</h2>
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 shadow">
                  <h3 className="text-xl font-bold mb-3">Advanced VEGA Technology</h3>
                  <p className="text-muted-foreground">
                    Our proprietary VEGA analysis system helps predict market direction with unprecedented accuracy, giving you the edge you need.
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow">
                  <h3 className="text-xl font-bold mb-3">Real-Time Data</h3>
                  <p className="text-muted-foreground">
                    Access live market data, charts, and analysis across multiple exchanges and financial instruments.
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow">
                  <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                  <p className="text-muted-foreground">
                    Our team of experienced market analysts is here to help you navigate complex trading scenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;

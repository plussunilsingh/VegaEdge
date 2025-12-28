import { ShieldCheck } from "lucide-react";
import { COMPANY_NAME } from "@/config";


const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-lg">
            <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Market Data Accuracy</h2>
                <p>
                  The data and prices on the website are not necessarily provided by any market or exchange, but may be provided by market makers. Therefore, prices may not be accurate and may differ from the actual price at any given market. This means prices are indicative and not appropriate for trading purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Investment Risk</h2>
                <p>
                  Trading in financial instruments involves a high degree of risk and may not be suitable for all investors. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. You should be aware of all the risks associated with trading and seek advice from an independent financial advisor if you have any doubts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">No Financial Advice</h2>
                <p>
                  The information provided on this platform is for educational and informational purposes only and should not be construed as financial advice. {COMPANY_NAME} does not provide investment advice, and any information shared should not be considered as recommendations to buy or sell any financial instrument.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Past Performance</h2>
                <p>
                  Past performance is not indicative of future results. Any historical returns, expected returns, or probability projections may not reflect actual future performance. All investments involve risk, and investments may lose value.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Content</h2>
                <p>
                  {COMPANY_NAME} may display content from third-party sources. We do not control, endorse, or adopt any third-party content and shall have no responsibility for the accuracy or completeness of such content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Liability Limitation</h2>
                <p>
                  {COMPANY_NAME} and its affiliates will not be liable for any losses or damages in connection with the use of this platform. This includes, but is not limited to, loss of profits, trading losses, or any other damages resulting from the use or inability to use our services.
                </p>
              </section>
            </div>

            <div className="mt-12 p-6 bg-primary/10 rounded-xl">
              <p className="text-center font-semibold">
                By using {COMPANY_NAME}, you acknowledge that you have read, understood, and agree to this disclaimer.
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Disclaimer;

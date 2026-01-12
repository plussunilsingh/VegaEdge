import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is the difference between Stock and Share?",
      answer:
        "A stock and a share are essentially one and the same. They both represent a part of the capital of a joint stock company. In India it was always called shares whereas in the US they have been referred to as stocks. They essentially mean the same thing.",
    },
    {
      question: "What Instruments Are Traded In The Stock Markets?",
      answer:
        "The stock market trades equity shares of various listed companies. In addition, the markets also trade other instruments like index futures, index options, stock futures, stock options, VIX futures etc. Both equity and derivative products are traded in stock markets.",
    },
    {
      question: "Where Do I Find Stock Related Information?",
      answer:
        "There are various sources for finding stock related information like the newspaper, websites, company annual reports etc. Brokerage houses like Tradebulls also provide a plethora of rich stock market content and analytics on the website itself.",
    },
    {
      question: "What Are The Factors That Determine The Price Of The Stock?",
      answer:
        "Price of the stock is normally determined by growth prospects and the profitability of the company. Normally, based on the attractiveness of the stock a P/E ratio is assigned by the market. Stock prices also depend on demand and supply as well as news flows.",
    },
    {
      question: "How Would You Choose Stock For Your Portfolio?",
      answer:
        "You choose stock by screening the stocks in the market on profitability, risk, valuations etc. Such analytics are available on the Tradebulls website for traders to easily create a portfolio. It is always advisable to check with your RM or advisor before taking portfolio decisions.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h4 className="text-primary text-xl font-bold mb-4">FAQs</h4>
          <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Investing.com is a financial markets platform providing real-time data, quotes, charts,
            financial tools, breaking news and analysis across 250 exchanges around the world in 44
            language editions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="bg-muted/30 rounded-2xl p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="bg-primary rounded-2xl overflow-hidden">
            <img src="/img/about-2.png" className="w-full" alt="FAQ" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

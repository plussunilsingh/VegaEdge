import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "1-month",
    name: "1 Month",
    price: "₹799",
    duration: "Per Month",
    features: ["Real-time Greeks", "Delta/Gamma Analysis", "Market Prediction", "Technical Support"],
    recommended: false,
  },
  {
    id: "3-month",
    name: "3 Months",
    price: "₹1,999",
    duration: "Per Quarter",
    features: ["Basic + Advanced Insights", "Multi-index Tracking", "Strategy Builder", "Priority Support"],
    recommended: true,
  },
  {
    id: "6-month",
    name: "6 Months",
    price: "₹3,499",
    duration: "Half Year",
    features: ["All Features Included", "Custom Alerts", "Data Export (CSV)", "Direct Expert Access"],
    recommended: false,
  },
  {
    id: "12-month",
    name: "12 Months",
    price: "₹5,999",
    duration: "Yearly",
    features: ["Ultimate Value Plan", "Beta Feature Access", "One-on-One Session", "Dedicated Manager"],
    recommended: false,
  },
];

const Subscription = () => {
  const navigate = useNavigate();

  const handlePlanClick = (plan: any) => {
    navigate("/pricing-details", { state: { plan } });
  };

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h4 className="text-primary font-bold uppercase tracking-widest mb-4">Pricing Plans</h4>
          <h2 className="text-slate-900 text-4xl md:text-5xl font-extrabold mb-6">
            Choose the Perfect Plan for Your Trading
          </h2>
          <p className="text-slate-500 text-lg">
            Unlock advanced market insights and start making data-driven decisions today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => handlePlanClick(plan)}
              className={`relative group cursor-pointer transition-all duration-500 hover:-translate-y-4 rounded-3xl p-8 border ${
                plan.recommended 
                  ? 'bg-[#0f172a] border-primary shadow-[0_0_40px_rgba(225,29,72,0.15)]' 
                  : 'bg-[#1e293b] border-gray-700 hover:border-gray-400'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full rounded-2xl h-12 font-bold transition-all ${
                  plan.recommended 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center p-8 rounded-3xl bg-gray-50 border border-gray-100">
           <h4 className="text-slate-900 text-xl font-bold mb-2">Lifetime Access Special</h4>
           <p className="text-slate-500">Want unlimited access forever? Contact our support for the exclusive Enterprise License.</p>
        </div>
      </div>
    </section>
  );
};

export default Subscription;

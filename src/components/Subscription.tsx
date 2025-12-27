import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "1-month",
    name: "1 Month",
    price: "₹1,999",
    duration: "Per Month",
    features: ["Full Greeks Dashboard", "Live Delta, Gamma, Theta, Vega", "Basic Email Support"],
    color: "#2F80ED", // Blue
    glow: "rgba(47, 128, 237, 0.5)",
    recommended: false,
  },
  {
    id: "3-month",
    name: "3 Months",
    price: "₹3,999",
    duration: "Per Quarter",
    features: ["All 1M Features", "Priority Updates", "Email + WhatsApp Support"],
    color: "#22C55E", // Green
    glow: "rgba(34, 197, 94, 0.5)",
    recommended: false,
  },
  {
    id: "6-month",
    name: "6 Months",
    price: "₹5,999",
    duration: "Half Year",
    features: ["Strategy Backtest Tools", "Advanced Alerts", "Premium Support"],
    color: "#A855F7", // Purple
    glow: "rgba(168, 85, 247, 0.5)",
    recommended: false,
  },
  {
    id: "12-month",
    name: "12 Months",
    price: "₹9,999",
    duration: "Yearly",
    features: ["All Pro Features", "Future Tools Access", "Dedicated Support"],
    color: "#EAB308", // Yellow/Gold
    glow: "rgba(234, 179, 8, 0.5)",
    bestValue: true,
    recommended: true,
  },
];

const Subscription = () => {
  const navigate = useNavigate();

  const handlePlanClick = (plan: any) => {
    navigate("/pricing-details", { state: { plan } });
  };

  return (
    <section id="pricing" className="py-24 bg-[#020617] relative overflow-hidden text-white font-inter">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full translate-y-1/2 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex justify-center items-center gap-2 mb-6">
             <img src="/img/logo.png" alt="Logo" className="h-10 w-10" />
             <h4 className="text-white text-2xl font-black tracking-tighter uppercase">Option <span className="text-primary">Greeks</span> <span className="text-slate-500">Lab</span></h4>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Elevate Your <span className="text-primary italic">Intelligence</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium">
             Unlock the power of deep volatility data and Greeks analysis for explosive trading performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 perspective-container py-10 px-8">
          {plans.map((plan, index) => (
            <div 
              key={plan.id}
              onClick={() => handlePlanClick(plan)}
              className="relative preserve-3d group cursor-pointer transition-all duration-700"
              style={{
                transform: `rotateX(8deg) rotateY(5deg) translateZ(0)`,
                zIndex: plan.recommended ? 20 : 10,
              } as any}
            >
              {/* Card Thickness/Side (3D Look) */}
              <div 
                className="absolute top-0 -left-6 w-6 h-full bg-white/5 border-l-2 border-y-2 border-white/10 rounded-l-[40px] origin-right transform -rotate-y-90 preserve-3d"
                style={{ background: `linear-gradient(to right, ${plan.color}30, transparent)` } as any}
              />

              <div 
                className="absolute inset-0 rounded-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                style={{ 
                  background: plan.color,
                  filter: 'blur(30px)',
                  transform: 'translateZ(-60px)'
                }}
              />
              
              <div className="relative bg-[#0f172a]/90 backdrop-blur-2xl rounded-[40px] p-8 border-2 border-white/10 shadow-2xl transition-all duration-700 group-hover:rotate-y-0 group-hover:rotate-x-0 group-hover:translate-z-30 group-hover:-translate-y-6 preserve-3d overflow-hidden"
                   style={{ borderTopColor: plan.color, borderRightColor: plan.color } as any}>
                
                {/* Gloss Effect */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {(plan as any).bestValue && (
                  <div className="absolute top-6 right-6 bg-[#EAB308]/20 border border-[#EAB308] text-[#EAB308] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Best Value
                  </div>
                )}
                
                <div className="mb-10 pt-4">
                  <h3 className="text-slate-100 text-2xl font-black mb-1 flex items-baseline gap-2">
                    {plan.name}
                    <span className="text-[10px] text-slate-500 font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">({plan.color})</span>
                  </h3>
                  <div className="flex flex-col mt-4">
                    <span className="text-5xl font-black text-white tracking-tighter" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">{plan.duration}</span>
                  </div>
                </div>

                <div className="w-10 h-1 rounded-full mb-8" style={{ background: plan.color }} />

                <ul className="space-y-5 mb-12">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-200 text-sm font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: plan.color }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className="w-full relative py-4 rounded-[20px] font-black text-slate-900 transition-all duration-300 transform active:scale-95 group/btn overflow-hidden"
                  style={{ background: plan.color }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Plan
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center opacity-40">
           <p className="text-xs font-bold tracking-[0.2em] uppercase">Trusted by 10,000+ Institutional Option Traders</p>
        </div>
      </div>
    </section>
  );
};

export default Subscription;

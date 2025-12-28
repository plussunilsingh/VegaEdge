import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  color: string;
  glow: string;
  recommended: boolean;
  bestValue?: boolean;
  upiImage: string;
}

const plans: Plan[] = [
  {
    id: "1-month",
    name: "1 Month",
    price: "₹1,999",
    duration: "Per Month",
    features: ["Full Greeks Dashboard", "Live Delta, Gamma, Theta, Vega", "Basic Email Support"],
    color: "#2F80ED",
    glow: "rgba(47, 128, 237, 0.5)",
    recommended: false,
    upiImage: "/price_plan_1999.jpeg"
  },
  {
    id: "3-month",
    name: "3 Months",
    price: "₹3,999",
    duration: "Per Quarter",
    features: ["All 1M Features", "Priority Updates", "Email + WhatsApp Support"],
    color: "#22C55E",
    glow: "rgba(34, 197, 94, 0.5)",
    recommended: false,
    upiImage: "/price_plan_3999.jpeg"
  },
  {
    id: "6-month",
    name: "6 Months",
    price: "₹5,999",
    duration: "Half Year",
    features: ["Strategy Backtest Tools", "Advanced Alerts", "Premium Support"],
    color: "#A855F7",
    glow: "rgba(168, 85, 247, 0.5)",
    recommended: false,
    upiImage: "/price_plan_5999.jpeg"
  },
  {
    id: "12-month",
    name: "12 Months",
    price: "₹9,999",
    duration: "Yearly",
    features: ["All Pro Features", "Future Tools Access", "Dedicated Support"],
    color: "#EAB308",
    glow: "rgba(234, 179, 8, 0.5)",
    bestValue: true,
    recommended: true,
    upiImage: "/price_plan_9999.jpeg"
  },
];

const PricingCard = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="relative preserve-3d group cursor-pointer transition-all duration-1000 animate-float"
      style={{
        zIndex: plan.recommended ? 20 : 10,
      } as any}
    >
      {/* 3D Glass Lid Layering (Refraction Look) */}
      <div className="absolute inset-x-0 -top-4 bottom-4 bg-white/5 backdrop-blur-3xl rounded-[40px] border-t border-x border-white/20 transform translate-z-20 preserve-3d" />
      
      {/* Side Refraction Edge */}
      <div 
        className="absolute top-0 -left-6 w-6 h-full bg-white/5 border-l-2 border-y-2 border-white/10 rounded-l-[40px] origin-right transform -rotate-y-90 preserve-3d"
        style={{ background: `linear-gradient(to right, ${plan.color}20, transparent)` } as any}
      >
        <div className="absolute top-0 right-0 w-[1px] h-full bg-white/40" />
      </div>

      {/* Internal Diamond Glow */}
      <div 
        className="absolute inset-8 rounded-full opacity-30 animate-diamond-glow pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${plan.color} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          transform: 'translateZ(-20px)'
        }}
      />
      
      {/* Outer Halo Glow */}
      <div 
        className="absolute inset-0 rounded-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"
        style={{ 
          background: plan.color,
          filter: 'blur(60px)',
          transform: 'translateZ(-80px) translateY(20px)'
        }}
      />
      
      {/* Ground Shadow */}
      <div 
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-black/40 blur-3xl rounded-[100%] transition-opacity duration-1000 opacity-50 group-hover:opacity-80 pointer-events-none"
        style={{ transform: 'rotateX(90deg)' }}
      />

      {/* Main Glass Body */}
      <div className="relative bg-slate-950/80 backdrop-blur-2xl rounded-[40px] p-8 border-2 border-white/10 shadow-2xl transition-all duration-1000 group-hover:rotate-y-0 group-hover:rotate-x-0 group-hover:translate-z-80 group-hover:-translate-y-12 preserve-3d overflow-hidden"
           style={{ borderTopColor: plan.color, borderRightColor: plan.color } as any}>
        
        {/* Surface Gloss Sweep */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-[45deg] -translate-x-full group-hover:animate-gloss-sweep pointer-events-none" />

        {plan.bestValue && (
          <div className="absolute top-8 right-8 bg-[#EAB308] text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-transform duration-1000 group-hover:translate-z-100"
               style={{ transform: 'translateZ(40px)' }}>
            Diamond Class
          </div>
        )}
        
        <div className="relative preserve-3d">
          <div className="mb-8 transform transition-transform duration-1000 group-hover:translate-z-40">
            <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1" style={{ transform: 'translateZ(60px)' }}>
              <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
              <span className="text-white/40 font-bold uppercase tracking-wider text-xs">{plan.duration}</span>
            </div>
          </div>

          <div className="space-y-4 mb-10 transform transition-transform duration-1000 group-hover:translate-z-20">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: plan.color, boxShadow: `0 0 10px ${plan.color}` }} />
                <span className="text-sm font-semibold tracking-wide">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            className="w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all duration-500 active:scale-95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transform group-hover:translate-z-80 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
            style={{ 
              backgroundColor: plan.color,
              color: '#000',
              transform: 'translateZ(20px)'
            }}
          >
            Unlock Access
          </button>
        </div>
      </div>
    </div>
  );
};

const Subscription = () => {
  const navigate = useNavigate();

  const handlePlanClick = (plan: Plan) => {
    navigate("/pricing-details", { state: { plan } });
  };

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden text-foreground font-inter">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full translate-y-1/2 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex justify-center items-center gap-2 mb-6">
             <img src="/img/logo.png" alt="Logo" className="h-10 w-10" />
             <h4 className="text-foreground text-2xl font-black tracking-tighter uppercase">Option <span className="text-primary">Greeks</span> <span className="text-muted-foreground">Lab</span></h4>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Elevate Your <span className="text-primary italic">Intelligence</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
             Unlock the power of deep volatility data and Greeks analysis for explosive trading performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 perspective-container py-10 px-8">
          {plans.map((plan) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              onClick={() => handlePlanClick(plan)} 
            />
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

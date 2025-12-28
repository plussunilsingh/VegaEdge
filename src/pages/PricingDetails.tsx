import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";

const PricingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || { 
    plan: { 
      name: "Standard Plan", 
      price: "₹799", 
      duration: "Per Month",
      features: ["All Premium Features Included"]
    } 
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="text-gray-400 hover:text-white mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" />
          Back to Plans
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 items-start perspektive-container">
          {/* Left Side: Plan Details (Diamond Glass Aesthetic) */}
          <div className="relative preserve-3d animate-float">
            {/* 3D Glass Lid Layering */}
            <div className="absolute inset-x-0 -top-4 bottom-4 bg-white/5 backdrop-blur-3xl rounded-[40px] border-t border-x border-white/20 transform translate-z-20 preserve-3d" />
            
            {/* Internal Diamond Glow */}
            <div 
              className="absolute inset-20 rounded-full opacity-30 animate-diamond-glow pointer-events-none"
              style={{ 
                background: `radial-gradient(circle, ${plan.color || '#10b981'} 0%, transparent 70%)`,
                filter: 'blur(40px)',
                transform: 'translateZ(-20px)'
              }}
            />

            <div 
              className="relative bg-slate-950/80 backdrop-blur-2xl rounded-[40px] p-10 border-2 border-white/10 shadow-2xl preserve-3d overflow-hidden"
              style={{ borderTopColor: plan.color || '#10b981', borderRightColor: plan.color || '#10b981' } as any}
            >
              {/* Surface Gloss */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
              
              <div className="relative z-10">
                <h1 className="text-white text-5xl font-black mb-4 tracking-tighter">{plan.name}</h1>
                <div className="flex items-baseline gap-2 mb-10 transform translate-z-40">
                  <span className="text-primary text-6xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-white/40 font-bold uppercase tracking-widest text-sm">{plan.duration}</span>
                </div>

                <div className="space-y-6 mb-12">
                   <h3 className="text-white text-xl font-black flex items-center gap-3 mb-6">
                     <div className="p-2 bg-primary/20 rounded-xl">
                       <ShieldCheck className="w-6 h-6 text-primary" />
                     </div>
                     Diamond Class Benefits
                   </h3>
                   {plan.features?.map((feature: string, idx: number) => (
                     <div key={idx} className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl transform hover:translate-x-2 transition-transform border border-white/5">
                       <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                       <p className="text-gray-200 font-medium text-lg leading-relaxed">{feature}</p>
                     </div>
                   ))}
                </div>

                <div className="bg-primary/10 border border-primary/30 p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <h4 className="text-primary font-black text-lg mb-3 tracking-wide flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Activation Protocol:
                  </h4>
                  <p className="text-gray-300 font-medium leading-relaxed relative z-10">
                    After successful payment, screenshot your receipt and send to <span className="text-white font-black text-lg">+91 7830175650</span>. Your institutional-grade dashboard will be live in <span className="text-primary italic font-black">30 mins</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Payment QR */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_100px_rgba(255,255,255,0.08)] mb-8 max-w-md w-full border border-gray-100 transform hover:scale-[1.01] transition-all duration-500">
              <div className="text-center mb-8">
                 <div className="bg-primary/10 p-4 rounded-2xl inline-block mb-4">
                   <CreditCard className="w-10 h-10 text-primary" />
                 </div>
                 <h2 className="text-4xl font-black text-black tracking-tighter">Scan to Pay</h2>
                 <p className="text-gray-500 font-black uppercase tracking-widest text-xs mt-2 opacity-60">Verified Institutional Merchant</p>
              </div>
              
              <div className="aspect-square bg-white rounded-[40px] overflow-hidden border-2 border-dashed border-primary/40 p-10 flex items-center justify-center animate-scan-pulse relative shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                <img 
                  src={plan.upiImage || "/dinesh_QR.jpeg"} 
                  alt="UPI QR Code" 
                  className="w-full h-full object-contain relative z-10"
                />
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="font-black text-2xl text-black mb-8 tracking-tight">Account: Dinesh Tarkar</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center px-4 mt-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 flex items-center">
                          <img src="/img/gpay-logo.svg" alt="GPAY" className="h-5 w-auto object-contain" />
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">G-Pay</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 flex items-center">
                          <img src="/img/upi-logo.png" alt="UPI" className="h-5 w-auto object-contain" />
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">UPI</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 flex items-center">
                          <img src="/img/paytm-logo.svg" alt="Paytm" className="h-5 w-auto object-contain" />
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Paytm</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 flex items-center">
                          <img src="/img/phonepe-logo.png" alt="PhonePe" className="h-5 w-auto object-contain" />
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">PhonePe</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 flex items-center">
                          <img src="/img/bharatpe-logo.png" alt="BharatPe" className="h-5 w-auto object-contain" />
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">BharatPe</span>
                    </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm font-bold tracking-widest uppercase opacity-40">Strictly No Refunds After Activation</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingDetails;

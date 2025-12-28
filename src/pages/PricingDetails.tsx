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

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Plan Details */}
          <div className="bg-gray-900/50 rounded-[40px] p-10 border border-gray-800">
            <h1 className="text-white text-4xl font-extrabold mb-4">{plan.name}</h1>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-primary text-5xl font-black">{plan.price}</span>
              <span className="text-gray-500">{plan.duration}</span>
            </div>

            <div className="space-y-6 mb-10">
               <h3 className="text-white text-lg font-bold flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6 text-primary" />
                 Included Features
               </h3>
               {plan.features?.map((feature: string, idx: number) => (
                 <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl transform hover:scale-[1.02] transition-transform">
                   <CheckCircle2 className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                   <p className="text-gray-200">{feature}</p>
                 </div>
               ))}
            </div>

            <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl">
              <h4 className="text-primary font-bold mb-2">Important Note:</h4>
              <p className="text-sm text-gray-300">
                After successful payment, please take a screenshot and send it along with your registered email to <strong>+91 7830175650</strong>. Your account will be activated within 30 minutes.
              </p>
            </div>
          </div>

          {/* Right Side: Payment QR */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_100px_rgba(255,255,255,0.08)] mb-8 max-w-md w-full border border-gray-100 transform hover:scale-[1.01] transition-transform duration-500">
              <div className="text-center mb-8">
                 <div className="bg-primary/10 p-3 rounded-2xl inline-block mb-4">
                   <ShieldCheck className="w-10 h-10 text-primary" />
                 </div>
                 <h2 className="text-3xl font-black text-black tracking-tight">Scan to Pay</h2>
                 <p className="text-gray-500 font-medium mt-1">Fast & Secure UPI Payment</p>
              </div>
              
              <div className="aspect-square bg-white rounded-[32px] overflow-hidden border-2 border-dashed border-primary/30 p-8 flex items-center justify-center animate-scan-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                <img 
                  src={plan.upiImage || "/dinesh_QR.jpeg"} 
                  alt="UPI QR Code" 
                  className="w-full h-full object-contain relative z-10"
                />
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="font-extrabold text-xl text-black mb-6">Account Name: Dinesh Tarkar</p>
                <div className="flex justify-center items-center gap-6 opacity-80 hover:opacity-100 transition-opacity">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPAY" className="h-6 w-auto" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-5 w-auto" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/Paytm_Logo.ro.svg" alt="Paytm" className="h-5 w-auto" />
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">Strictly No Refunds After Activation</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingDetails;

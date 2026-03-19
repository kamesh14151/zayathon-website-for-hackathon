import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Get registration ID from navigation state
  const registrationId = location.state?.registrationId;

  // Dodo setup
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"initial" | "processing" | "error">("initial");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getButtonText = () => {
    if (status === "processing") return "Redirecting...";
    if (status === "error") return "Try Again";
    return "Continue to Payment (₹200)";
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!registrationId) {
      toast({
        title: "Registration ID missing",
        description: "Please complete registration first",
        variant: "destructive",
      });
      navigate("/register");
      return;
    }

    setStatus("processing");
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          customer: { email, name: fullName },
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      const checkoutUrl = data?.checkout_url || data?.checkoutUrl || data?.url;

      if (!checkoutUrl || typeof checkoutUrl !== "string") {
        throw new Error("Checkout URL was not returned by the server");
      }

      await supabase
        .from('registrations')
        .update({ payment_status: 'checkout_initialized' })
        .eq('id', registrationId);

      window.location.assign(checkoutUrl);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unknown error occurred during checkout");
      toast({
        title: "Checkout failed",
        description: err.message || "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (status !== "error") setStatus("initial");
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-display font-normal text-foreground mb-2">Payment Initialized!</h2>
          <p className="text-muted-foreground">Redirecting you to checkout...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-normal text-foreground mb-4">
              Complete Your Registration
            </h1>
            <p className="text-muted-foreground text-lg">
              Secure your spot by completing the payment. Follow the Dodo Payments flow securely.
            </p>
          </div>

          <Card className="glow-card border-border">
            <CardHeader className="text-center pb-8 border-b border-border/50">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-display font-normal text-2xl">Team Fee</CardTitle>
              <CardDescription className="text-3xl font-display text-primary mt-2">
                ₹200 <span className="text-base text-muted-foreground ml-1">INR</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <form onSubmit={handleCheckout} className="space-y-5">
                <div className="space-y-4">
                  <Input
                    placeholder="Full name"
                    type="text"
                    className="h-12 bg-transparent focus-visible:ring-accent focus-visible:border-accent"
                    value={fullName}
                    onChange={(e) => setFullName(e.currentTarget.value)}
                    required
                  />
                  <Input
                    placeholder="Email address"
                    type="email"
                    className="h-12 bg-transparent focus-visible:ring-accent focus-visible:border-accent"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    required
                  />
                </div>
                
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-body font-medium tracking-wide text-[1rem] transition-all"
                  type="submit"
                  disabled={status === "processing"}
                >
                  {getButtonText()}
                </Button>
                
                {status === "error" && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm text-center font-medium bg-destructive/10 py-3 rounded-lg border border-destructive/20 mt-4"
                  >
                    {errorMessage}
                  </motion.p>
                )}
                
                <p className="text-xs text-center text-muted-foreground pt-4 flex items-center justify-center gap-1.5">
                  Secured by <strong className="text-foreground">Dodo Payments</strong>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;

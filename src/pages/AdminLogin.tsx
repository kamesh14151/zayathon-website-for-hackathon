import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { ADMIN_SESSION_KEY, isAdminCredentials } from '@/lib/adminAuth';
import BrandWordmark from '@/components/BrandWordmark';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const hasLocalAdminSession = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    if (hasLocalAdminSession) {
      navigate('/admin');
      setChecking(false);
      return;
    }

    // Check if already logged in with Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        navigate('/admin');
      }
      setChecking(false);
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdminCredentials(email, password)) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        toast({
          title: 'Login Successful!',
          description: 'Redirecting to admin dashboard...',
        });
        navigate('/admin');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Login Successful!',
        description: 'Redirecting to admin dashboard...',
      });
      navigate('/admin');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5f8] px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-5 sm:gap-7 items-stretch">
          <section className="rounded-[20px] border border-[#e7eaf0] bg-[#f7f8fb] p-5 sm:p-7 md:px-14 md:py-12 flex flex-col justify-center">
            <div className="mb-8 sm:mb-11 max-w-[440px] w-full mx-auto lg:mx-0">
              <img src="/zaya.png" alt="ZAYATHON" className="h-8 w-auto mb-8" />
              <h1 className="text-[2rem] sm:text-[2.45rem] leading-[1.1] font-semibold text-[#1f2a3d] mb-1">
                Welcome back!
              </h1>
              <p className="text-[#718095] text-[1.1rem] sm:text-[1.62rem] leading-[1.25] font-normal">
                Login to your <BrandWordmark /> admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-[440px] w-full mx-auto lg:mx-0">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[#2a3442] text-[15px]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a94a6]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-[9px] bg-white border-[#d0d7e2] text-[15px] placeholder:text-[#9aa6b7] focus-visible:ring-0 focus-visible:border-[#121212]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-[#2a3442] text-[15px]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a94a6]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-[9px] bg-white border-[#d0d7e2] text-[15px] placeholder:text-[#9aa6b7] focus-visible:ring-0 focus-visible:border-[#121212]"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-[46px] rounded-[9px] bg-[#050608] hover:bg-[#171b23] text-white text-[15px] font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </section>

          <section className="hidden lg:block rounded-[20px] overflow-hidden border border-[#e1e5ee] shadow-[0_18px_50px_rgba(23,35,58,0.10)] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6f8398] via-[#9ca9ba] to-[#e6b39a]" />
            <div className="absolute inset-0 opacity-70" style={{
              backgroundImage:
                'radial-gradient(circle at 72% 18%, rgba(255,255,255,0.55) 0 10px, transparent 11px), radial-gradient(circle at 65% 58%, rgba(255,160,120,0.42) 0 110px, transparent 130px), linear-gradient(to top, rgba(40,90,50,0.82), rgba(40,90,50,0.1) 45%, transparent 60%)',
            }} />
            <div className="absolute left-1/2 bottom-12 -translate-x-1/2 w-20 h-[58%] rounded-full bg-gradient-to-t from-[#f4e2a8] via-[#ffe7ba] to-[#fff8dd] shadow-[0_0_50px_rgba(255,230,180,0.55)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#12261a]/70 to-transparent" />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

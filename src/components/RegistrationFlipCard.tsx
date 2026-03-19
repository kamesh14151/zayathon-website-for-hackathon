import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Check, X, Mail, Edit, Trash2, Phone, User, MapPin, AtSign, Users,
  Star
} from 'lucide-react';

interface RegistrationFlipCardProps {
  registration: {
    id: string;
    team_id?: string;
    team_name: string;
    team_members: Array<{ name: string; email: string }>;
    contact_email: string;
    contact_phone: string;
    institution: string;
    year_of_study: string;
    problem_statement: string;
    status: 'pending' | 'approved' | 'rejected';
    updated_at?: string;
    payment_status?: string;
    payment_screenshot?: string;
    created_at: string;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEmail: (id: string) => void;
  onEdit: (reg: any) => void;
  onDelete: (reg: any) => void;
  isProcessing: boolean;
}

export const RegistrationFlipCard = ({
  registration,
  onApprove,
  onReject,
  onEmail,
  onEdit,
  onDelete,
  isProcessing,
}: RegistrationFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Custom Colors from the image
  const theme = {
    bg: "bg-[#332828]", // Dark brownish/charcoal
    accent: "bg-[#C69076]", // Copper/Tan
    accentText: "text-[#C69076]",
    text: "text-white",
  };

  return (
    <motion.div
      className="h-full w-full min-h-[280px]"
      style={{ perspective: 1200 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full shadow-2xl rounded-xl"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className={`absolute inset-0 w-full h-full ${theme.bg} rounded-xl overflow-hidden flex flex-col items-center justify-center border-none`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative Waves (CSS Shapes) */}
          <div className={`absolute top-0 left-0 w-32 h-32 ${theme.accent} rounded-full blur-[0px] -translate-x-12 -translate-y-12 opacity-90`} />
           <div className={`absolute top-0 left-0 w-40 h-40 ${theme.accent} rounded-br-full -translate-x-16 -translate-y-16`} 
               style={{ borderRadius: '50% 40% 60% 30% / 30% 50% 60% 40%' }} // attempt organic shape
          />
          
          {/* Top Left Curve */}
          <svg className="absolute top-0 left-0 w-48 h-32 opacity-100 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 0 H 100 Q 60 40 40 100 H 0 V 0 Z" fill="#C69076" />
          </svg>

          {/* Bottom Right Curve */}
          <svg className="absolute bottom-0 right-0 w-48 h-32 opacity-100 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M100 100 H 0 Q 40 60 60 0 H 100 V 100 Z" fill="#C69076" />
          </svg>

          {/* Decor Dots/Stars */ }
          <Star className="absolute top-8 left-8 text-white w-3 h-3 fill-white opacity-80" />
          <Star className="absolute top-16 right-32 text-white w-2 h-2 fill-white opacity-60" />
          <div className={`absolute bottom-20 left-10 w-6 h-6 rounded-full ${theme.accent} opacity-80`} />
          <div className={`absolute top-20 right-5 w-4 h-4 rounded-full ${theme.accent} opacity-80`} />

          {/* CENTER CONTENT */}
          <div className="z-10 flex flex-col items-center text-center px-4 w-full">
            {/* Circle generic logo place holder */}
            <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white flex items-center justify-center mb-4 relative overflow-hidden shadow-lg">
                <span className="text-[#332828] font-bold text-xs tracking-widest">TEAM</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#332828]/10 to-transparent" />
            </div>

            <h2 className={`text-2xl font-serif font-bold text-white tracking-wide mb-1 uppercase drop-shadow-md break-words max-w-full`}>
              {registration.team_name}
            </h2>
            <p className="text-white/90 text-sm font-medium tracking-wider uppercase mb-1">
              {registration.institution}
            </p>
            <p className="text-[#C69076] text-xs font-light italic">
              {registration.team_id ? `#${registration.team_id}` : 'Processing ID...'} • {registration.year_of_study} Year
            </p>
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center z-10">
             <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Click to flip</p>
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div
          className={`absolute inset-0 w-full h-full ${theme.bg} rounded-xl overflow-hidden flex flex-col`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
           {/* Decorative Waves Back */}
           <svg className="absolute top-0 right-0 w-64 h-48 opacity-100 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M100 0 V 80 Q 50 100 0 0 H 100 Z" fill="#C69076" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-48 h-32 opacity-100 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 H 100 Q 50 20 0 50 V 100 Z" fill="#C69076" />
          </svg>
          
           {/* Decor */}
           <Star className="absolute top-12 right-6 text-white w-3 h-3 fill-white opacity-80" />
           <Star className="absolute top-32 right-1/2 text-white w-2 h-2 fill-white opacity-60" />

          {/* Content Container */}
          <div className="flex-1 z-10 p-6 flex flex-col md:flex-row gap-4 overflow-y-auto custom-scrollbar">
            
            {/* Left Col: Contact Info */}
            <div className="flex-1 flex flex-col justify-center space-y-4 text-white">
                <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#C69076]" />
                    <div>
                        <p className="text-sm font-bold leading-tight">{registration.team_members?.[0]?.name || "Team Leader"}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-wider">Team Leader</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C69076]" />
                    <p className="text-xs tracking-wide">{registration.contact_phone || "No Phone"}</p>
                </div>

                <div className="flex items-center gap-3">
                    <AtSign className="w-4 h-4 text-[#C69076]" />
                    <p className="text-xs tracking-wide break-all line-clamp-1" title={registration.contact_email}>{registration.contact_email}</p>
                </div>

                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#C69076]" />
                    <p className="text-xs tracking-wide leading-tight line-clamp-2">
                        {registration.institution}
                    </p>
                </div>
                 
                 <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#C69076]" />
                    <p className="text-xs tracking-wide">
                        {registration.team_members?.length} Members
                    </p>
                </div>
            </div>

             {/* Right Col: Status / Badge (Replacing the image in original design) */}
             <div className="w-24 flex flex-col items-center justify-center gap-2">
                <div className="w-20 h-20 rounded-full border-2 border-[#C69076] overflow-hidden bg-black/20 relative group">
                     {/* Pseudo-image or Status Indicator */}
                     <div className={`absolute inset-0 flex items-center justify-center font-bold text-xs uppercase text-center p-1
                        ${registration.status === 'approved' ? 'bg-green-500/20 text-green-200' : 
                          registration.status === 'rejected' ? 'bg-red-500/20 text-red-200' : 
                          'bg-amber-500/20 text-amber-200'}`}>
                        {registration.status}
                     </div>
                </div>
                {/* Payment Status Pill */}
                {registration.payment_screenshot && (
                     <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                        Paid
                     </span>
                )}
             </div>
          </div>

          {/* Action Footer (Integrated) */}
          <div className="z-20 p-2 bg-black/20 backdrop-blur-sm border-t border-white/5 flex gap-2 justify-between">
             {registration.status === 'pending' ? (
                 <>
                    <Button 
                        size="sm" 
                        variant="ghost"
                        className="flex-1 h-8 text-xs hover:bg-green-500/20 hover:text-green-300 text-green-400 border border-green-500/30"
                        onClick={(e) => { e.stopPropagation(); onApprove(registration.id); }}
                    >
                        Approve
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost"
                        className="flex-1 h-8 text-xs hover:bg-red-500/20 hover:text-red-300 text-red-400 border border-red-500/30"
                        onClick={(e) => { e.stopPropagation(); onReject(registration.id); }}
                    >
                        Reject
                    </Button>
                 </>
             ) : (
                <>
                    <Button 
                        size="sm" 
                        variant="ghost"
                        className="flex-1 h-8 text-xs hover:bg-white/10 text-white/80 border border-white/20"
                        onClick={(e) => { e.stopPropagation(); onEdit(registration); }}
                    >
                        Edit
                    </Button>
                    {registration.status === 'rejected' && (
                         <Button 
                            size="sm" 
                            variant="ghost"
                            className="flex-1 h-8 text-xs hover:bg-red-500/20 text-red-400 border border-red-500/30"
                            onClick={(e) => { e.stopPropagation(); onDelete(registration); }}
                        >
                            Delete
                        </Button>
                    )}
                </>
             )}
              <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0 text-xs hover:bg-[#C69076]/20 text-[#C69076] border border-[#C69076]/40"
                    title="Send Email"
                    onClick={(e) => { e.stopPropagation(); onEmail(registration.id); }}
                >
                    <Mail className="w-4 h-4" />
              </Button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

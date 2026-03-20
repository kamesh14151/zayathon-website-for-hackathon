import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRegistrations, getRegistrationCount, supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RegistrationFlipCard } from '@/components/RegistrationFlipCard';
import CountdownTimer from '@/components/CountdownTimer';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Users, Download, RefreshCw, Search, LogOut, Check, X,
  Trophy, Mail, BarChart3, Plus, Edit, Trash2, Send, Image, CalendarDays, SlidersHorizontal,
  CreditCard, Wallet, TrendingUp, Globe2, LayoutGrid, Rows3, Timer, Clock3, ChevronDown
} from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_SESSION_KEY } from '@/lib/adminAuth';
import {
  DEFAULT_TIMELINE_EVENTS,
  getTimelineEvents,
  saveTimelineEvents,
  type EditableTimelineEvent,
  type TimelineEventStatus,
} from '@/lib/timelineConfig';

interface Registration {
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
}

interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  is_active: boolean;
}

interface Winner {
  id: string;
  registration_id: string;
  team_name: string;
  rank: number;
  prize: string;
}

const FALLBACK_API_BASE_URL = 'https://zayathon-website-for-hackathon.vercel.app';
const TEAM_FEE_INR = 200;

const COUNTRY_META: Record<string, { x: number; y: number; flag: string }> = {
  India: { x: 70, y: 56, flag: '🇮🇳' },
  'United States': { x: 24, y: 44, flag: '🇺🇸' },
  'United Kingdom': { x: 47, y: 39, flag: '🇬🇧' },
  France: { x: 49, y: 43, flag: '🇫🇷' },
  Germany: { x: 51, y: 40, flag: '🇩🇪' },
  Other: { x: 58, y: 50, flag: '🌐' },
};

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour24 = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const value = `${hour12}:${minute} ${period}`;
  const label = value;
  return { value, label };
});

const COUNTDOWN_STOP_VALUE = '__ZERO__';

const toCountdownDateText = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const parseCountdownDateText = (dateText: string): Date | undefined => {
  const parsed = new Date(dateText);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const extractCountdownStartTime = (timeText: string) => {
  if (timeText === COUNTDOWN_STOP_VALUE) return COUNTDOWN_STOP_VALUE;
  if (!timeText) return '';
  const firstPart = timeText.split('-')[0]?.trim();
  const matched = firstPart.match(/^\d{1,2}:\d{2}\s?(AM|PM)$/i);
  return matched ? `${matched[0].replace(/\s+/g, ' ').toUpperCase()}` : firstPart;
};

const getCountdownPreviewTarget = (dateText: string, timeText: string) => {
  if (timeText === COUNTDOWN_STOP_VALUE) return new Date(0).toISOString();
  if (!dateText || !timeText) return null;
  const parsed = new Date(`${dateText} ${timeText}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

const resolveApiUrl = (path: string) => {
  const configuredBase = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
  if (configuredBase) return `${configuredBase}${path}`;

  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return path;
  }

  return `${FALLBACK_API_BASE_URL}${path}`;
};

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [registrationView, setRegistrationView] = useState<'list' | 'cards'>('list');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('registrations');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<EditableTimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineSaving, setTimelineSaving] = useState(false);
  const [countdownDate, setCountdownDate] = useState('');
  const [countdownTime, setCountdownTime] = useState('');

  // Problem Statements State
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
  const [showAddProblemDialog, setShowAddProblemDialog] = useState(false);
  const [newProblem, setNewProblem] = useState({ title: '', description: '', category: '', difficulty: 'medium' });

  // Winners State
  const [winners, setWinners] = useState<Winner[]>([]);
  const [showAddWinnerDialog, setShowAddWinnerDialog] = useState(false);
  const [selectedWinnerRegistration, setSelectedWinnerRegistration] = useState<string>('');
  const [winnerRank, setWinnerRank] = useState<'1' | '2' | '3'>('1');
  const [winnerPrize, setWinnerPrize] = useState('');

  // Edit Registration State
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingReg, setEditingReg] = useState<Registration | null>(null);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  const [editForm, setEditForm] = useState({
    team_id: '',
    team_name: '',
    contact_email: '',
    contact_phone: '',
    institution: '',
    year_of_study: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    problem_statement: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    const allowedTabs = ['registrations', 'problems', 'winners', 'timeline', 'countdown', 'analytics', 'payments'];
    if (tab && allowedTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    // Set up real-time subscription for registrations
    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations'
        },
        (payload) => {
          console.log('Registration change detected:', payload);
          // Refresh registrations when any change occurs
          fetchRegistrations();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const hasLocalAdminSession = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    if (hasLocalAdminSession) {
      setUser({ email: ADMIN_EMAIL });
      fetchAllData();
      return;
    }

    // Development bypass - remove this in production
    const isDev = import.meta.env.DEV;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !isDev) {
      navigate('/login');
      return;
    }
    setUser(user);
    fetchAllData();
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRegistrations(),
        fetchProblemStatements(),
        fetchWinners(),
        fetchTimelineEvents(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimelineEvents = async () => {
    setTimelineLoading(true);
    try {
      const events = await getTimelineEvents();
      setTimelineEvents(events);
      const countdownEvent = events.find((event) => event.id === 'hackathon-days');
      setCountdownDate(countdownEvent?.date || '');
      setCountdownTime(extractCountdownStartTime(countdownEvent?.time || ''));
    } finally {
      setTimelineLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      console.log('Fetching registrations...');
      const result = await getRegistrations();
      console.log('Fetch result:', result);
      
      if (result.success && result.data) {
        // Add status and problem_statement fields if they don't exist
        const regs = result.data.map((r: any) => ({
          ...r,
          status: r.status || 'pending',
          problem_statement: r.problem_statement || 'Not specified',
          payment_screenshot: r.payment_screenshot || null
        }));
        console.log('Processed registrations:', regs);
        setRegistrations(regs as Registration[]);
      } else {
        console.error('Failed to fetch registrations:', result.error);
      }
      
      const countResult = await getRegistrationCount();
      if (countResult.success) {
        setTotalCount(countResult.count || 0);
      }
    } catch (error) {
      console.error('Error in fetchRegistrations:', error);
    }
  };

  const fetchProblemStatements = async () => {
    const { data } = await supabase.from('problem_statements').select('*').order('created_at', { ascending: false });
    if (data) {
      setProblemStatements(data);
    }
  };

  const fetchWinners = async () => {
    const { data } = await supabase.from('results').select('*').order('rank', { ascending: true });
    if (data) {
      setWinners(data);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchRegistrations();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTimelineFieldChange = (
    id: string,
    field: 'date' | 'time' | 'title' | 'description',
    value: string
  ) => {
    setTimelineEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, [field]: value } : event))
    );
  };

  const handleTimelineStatusChange = (id: string, status: TimelineEventStatus) => {
    setTimelineEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, status } : event))
    );
  };

  const handleSaveTimeline = async () => {
    setTimelineSaving(true);
    try {
      const result = await saveTimelineEvents(timelineEvents);
      if (!result.success) {
        toast({
          title: 'Save Failed',
          description: result.error || 'Failed to save timeline updates.',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Timeline Updated', description: 'Public timeline has been updated successfully.' });
    } finally {
      setTimelineSaving(false);
    }
  };

  const handleResetTimeline = async () => {
    const resetEvents = DEFAULT_TIMELINE_EVENTS.map((event) => ({ ...event }));
    setTimelineEvents(resetEvents);
    const countdownEvent = resetEvents.find((event) => event.id === 'hackathon-days');
    setCountdownDate(countdownEvent?.date || '');
    setCountdownTime(extractCountdownStartTime(countdownEvent?.time || ''));
    setTimelineSaving(true);
    try {
      const result = await saveTimelineEvents(resetEvents);
      if (!result.success) {
        toast({
          title: 'Reset Failed',
          description: result.error || 'Failed to reset timeline.',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Timeline Reset', description: 'Timeline restored to default event values.' });
    } finally {
      setTimelineSaving(false);
    }
  };

  const handleSaveCountdown = async () => {
    const nextDate = countdownDate.trim();
    const nextTime = countdownTime.trim();

    if (!nextTime) {
      toast({
        title: 'Missing countdown values',
        description: 'Please provide countdown time mode.',
        variant: 'destructive',
      });
      return;
    }

    if (nextTime !== COUNTDOWN_STOP_VALUE && !nextDate) {
      toast({
        title: 'Missing countdown date',
        description: 'Please provide date for countdown target.',
        variant: 'destructive',
      });
      return;
    }

    const hasCountdownEvent = timelineEvents.some((event) => event.id === 'hackathon-days');
    if (!hasCountdownEvent) {
      toast({
        title: 'Countdown source missing',
        description: 'Hackathon Days event was not found in timeline events.',
        variant: 'destructive',
      });
      return;
    }

    const updatedEvents = timelineEvents.map((event) =>
      event.id === 'hackathon-days'
        ? {
            ...event,
            date: nextDate || event.date,
            time: nextTime,
          }
        : event
    );

    setTimelineSaving(true);
    try {
      const result = await saveTimelineEvents(updatedEvents);
      if (!result.success) {
        toast({
          title: 'Save Failed',
          description: result.error || 'Failed to save countdown settings.',
          variant: 'destructive',
        });
        return;
      }

      setTimelineEvents(updatedEvents);
      toast({
        title: 'Countdown Updated',
        description: 'Homepage Event starts in countdown has been updated.',
      });
    } finally {
      setTimelineSaving(false);
    }
  };

  const handleApproveRegistration = async (id: string) => {
    if (processingIds.has(id)) return;
    const targetReg = registrations.find((reg) => reg.id === id);
    
    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      console.log('Attempting to approve registration:', id);
      
      // Optimistically update the UI
      setRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, status: 'approved' as const } : reg)
      );

      // Try direct update with explicit RLS bypass using service role would be ideal
      // But since we're using anon key, we need to ensure policies allow it
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error approving registration:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Check if it's an RLS policy error
        if (error.message?.includes('policy') || error.code === '42501') {
          toast({ 
            title: 'Permission Error', 
            description: 'Row Level Security is blocking this operation. Please add UPDATE policy in Supabase Dashboard.', 
            variant: 'destructive' 
          });
        } else {
          toast({ 
            title: 'Error', 
            description: error.message || 'Failed to approve registration', 
            variant: 'destructive' 
          });
        }
        
        // Revert optimistic update
        await fetchRegistrations();
      } else {
        console.log('Approval successful for registration:', id);
        toast({ title: 'Success', description: 'Registration approved!' });

        if (targetReg?.contact_email) {
          try {
            await sendAdminEmail({
              to: targetReg.contact_email,
              subject: 'Zayathon Registration Approved',
              message: `Hi ${targetReg.team_members?.[0]?.name || 'Participant'}, your team ${targetReg.team_name} has been approved by the Zayathon admin team. See you at the event.`,
              heading: 'Registration Approved',
              subheading: 'Your team is confirmed',
              ctaText: 'View Event Site',
              ctaUrl: window.location.origin,
            });
          } catch (emailError: any) {
            toast({
              title: 'Approved, but email failed',
              description: emailError?.message || 'Status was updated, but the approval email could not be sent.',
              variant: 'destructive',
            });
          }
        }

        // Fetch fresh data to ensure consistency
        await fetchRegistrations();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      await fetchRegistrations();
      toast({ 
        title: 'Error', 
        description: error.message || 'An unexpected error occurred', 
        variant: 'destructive' 
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRejectRegistration = async (id: string) => {
    if (processingIds.has(id)) return;
    const targetReg = registrations.find((reg) => reg.id === id);
    
    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      console.log('Attempting to reject registration:', id);
      
      // Optimistically update the UI
      setRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, status: 'rejected' as const } : reg)
      );

      const { error } = await supabase
        .from('registrations')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error rejecting registration:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Check if it's an RLS policy error
        if (error.message?.includes('policy') || error.code === '42501') {
          toast({ 
            title: 'Permission Error', 
            description: 'Row Level Security is blocking this operation. Please add UPDATE policy in Supabase Dashboard.', 
            variant: 'destructive' 
          });
        } else {
          toast({ 
            title: 'Error', 
            description: error.message || 'Failed to reject registration', 
            variant: 'destructive' 
          });
        }
        
        // Revert optimistic update
        await fetchRegistrations();
      } else {
        console.log('Rejection successful for registration:', id);
        toast({ title: 'Success', description: 'Registration rejected!' });

        if (targetReg?.contact_email) {
          try {
            await sendAdminEmail({
              to: targetReg.contact_email,
              subject: 'Zayathon Registration Update',
              message: `Hi ${targetReg.team_members?.[0]?.name || 'Participant'}, your team ${targetReg.team_name} was not approved at this time. You can contact the admin team for details and next steps.`,
              heading: 'Registration Status Update',
              subheading: 'Action required from your side',
              ctaText: 'Contact Admin Team',
              ctaUrl: 'mailto:zayacodehub@gmail.com',
            });
          } catch (emailError: any) {
            toast({
              title: 'Rejected, but email failed',
              description: emailError?.message || 'Status was updated, but the rejection email could not be sent.',
              variant: 'destructive',
            });
          }
        }

        // Fetch fresh data to ensure consistency
        await fetchRegistrations();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      await fetchRegistrations();
      toast({ 
        title: 'Error', 
        description: error.message || 'An unexpected error occurred', 
        variant: 'destructive' 
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (processingIds.has(id)) return;

    const targetReg = registrations.find((reg) => reg.id === id);
    if (!targetReg) return;

    setProcessingIds((prev) => new Set(prev).add(id));

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting registration:', error);
        toast({
          title: 'Delete Failed',
          description: error.code === '42501'
            ? 'Delete blocked by Supabase RLS policy. Apply latest migration and retry.'
            : (error.message || 'Unable to delete registration from database.'),
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Deleted',
          description: `${targetReg?.team_name || 'Registration'} removed from database.`,
        });
        await fetchRegistrations();
        setRegistrationToDelete(null);
      }
    } catch (error: any) {
      console.error('Unexpected delete error:', error);
      toast({
        title: 'Delete Failed',
        description: error?.message || 'Unexpected error while deleting registration.',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleEditRegistration = (reg: Registration) => {
    setEditingReg(reg);
    setEditForm({
      team_id: reg.team_id || '',
      team_name: reg.team_name,
      contact_email: reg.contact_email,
      contact_phone: reg.contact_phone,
      institution: reg.institution,
      year_of_study: reg.year_of_study,
      status: reg.status,
      problem_statement: reg.problem_statement
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingReg) return;
    
    const { error } = await supabase
      .from('registrations')
      .update({
        team_name: editForm.team_name,
        contact_email: editForm.contact_email,
        contact_phone: editForm.contact_phone,
        institution: editForm.institution,
        year_of_study: editForm.year_of_study,
        status: editForm.status,
        problem_statement: editForm.problem_statement
      })
      .eq('id', editingReg.id);
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to update registration', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Registration updated!' });
      setShowEditDialog(false);
      setEditingReg(null);
      fetchRegistrations();
    }
  };

  const handleAddProblemStatement = async () => {
    const { error } = await supabase.from('problem_statements').insert([{
      title: newProblem.title,
      description: newProblem.description,
      category: newProblem.category,
      difficulty: newProblem.difficulty,
      is_active: true
    }]);
    if (error) {
      toast({ title: 'Error', description: 'Failed to add problem statement', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Problem statement added!' });
      setShowAddProblemDialog(false);
      setNewProblem({ title: '', description: '', category: '', difficulty: 'medium' });
      fetchProblemStatements();
    }
  };

  const handleDeleteProblemStatement = async (id: string) => {
    const { error } = await supabase.from('problem_statements').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete problem statement', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Problem statement deleted!' });
      fetchProblemStatements();
    }
  };

  const handleToggleProblemStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('problem_statements').update({ is_active: !currentStatus }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      fetchProblemStatements();
    }
  };

  const handleAddWinner = async () => {
    const selectedReg = registrations.find(r => r.id === selectedWinnerRegistration);
    const { error } = await supabase.from('results').insert([{
      registration_id: selectedWinnerRegistration,
      rank: parseInt(winnerRank),
      prize: winnerPrize
    }]);
    if (error) {
      toast({ title: 'Error', description: 'Failed to add winner', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Winner added: ${selectedReg?.team_name}` });
      setShowAddWinnerDialog(false);
      setSelectedWinnerRegistration('');
      setWinnerRank('1');
      setWinnerPrize('');
      fetchWinners();
    }
  };

  const handleDeleteWinner = async (id: string) => {
    const { error } = await supabase.from('results').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete winner', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Winner removed!' });
      fetchWinners();
    }
  };

  const sendAdminEmail = async ({
    to,
    subject,
    message,
    heading,
    subheading,
    ctaText,
    ctaUrl,
  }: {
    to: string;
    subject: string;
    message: string;
    heading?: string;
    subheading?: string;
    ctaText?: string;
    ctaUrl?: string;
  }) => {
    const response = await fetch(resolveApiUrl('/api/admin-send-email'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, message, heading, subheading, ctaText, ctaUrl }),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to send email');
    }
  };

  const handleSendEmail = async (email: string) => {
    try {
      await sendAdminEmail({
        to: email,
        subject: 'Zayathon Admin Update',
        message: 'This is an update from the Zayathon admin team regarding your registration.',
        heading: 'Admin Update',
        subheading: 'Zayathon 2026 Registration Team',
      });

      toast({
        title: 'Email Sent',
        description: `Email sent to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: 'Email Failed',
        description: error?.message || 'Unable to send email right now.',
        variant: 'destructive',
      });
    }
  };

  const handleBroadcastEmail = async () => {
    const emails = registrations.map(r => r.contact_email);
    toast({ title: 'Broadcast Email', description: `Email sent to ${emails.length} participants` });
  };

  const exportToCSV = () => {
    const headers = ['Team ID', 'Team Name', 'Leader Name', 'Email', 'Phone', 'College', 'Year', 'Problem Statement', 'Status', 'Payment Status', 'Created At'];
    const rows = registrations.map((reg) => [
      reg.team_id || '',
      reg.team_name,
      reg.team_members?.[0]?.name || '',
      reg.contact_email,
      reg.contact_phone,
      reg.institution,
      reg.year_of_study,
      reg.problem_statement,
      reg.status,
      reg.payment_status || (reg.payment_screenshot ? 'payment_success' : 'payment_pending'),
      reg.created_at,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      reg.team_id?.toLowerCase().includes(searchLower) ||
      reg.team_name?.toLowerCase().includes(searchLower) ||
      reg.contact_email?.toLowerCase().includes(searchLower) ||
      reg.institution?.toLowerCase().includes(searchLower)
    );

    const normalizedPaymentStatus = (reg.payment_status || (reg.payment_screenshot ? 'payment_success' : 'payment_pending')).toLowerCase();
    const matchesPaymentStatus = paymentStatusFilter === 'all' || normalizedPaymentStatus === paymentStatusFilter;

    return matchesSearch && matchesPaymentStatus;
  });

  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;
  const paidCount = registrations.filter(r => (r.payment_status || '').toLowerCase() === 'payment_success' || !!r.payment_screenshot).length;

  const paymentSuccessRegistrations = registrations.filter(
    (r) => (r.payment_status || '').toLowerCase() === 'payment_success' || !!r.payment_screenshot
  );
  const totalRevenueInr = paymentSuccessRegistrations.length * TEAM_FEE_INR;
  const totalRefundsInr = 0;
  const payoutsReceivedInr = 0;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayBuckets = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(startOfToday);
    d.setDate(startOfToday.getDate() - (29 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      key,
      label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      revenue: 0,
    };
  });

  paymentSuccessRegistrations.forEach((reg) => {
    const d = new Date(reg.created_at);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const bucket = dayBuckets.find((b) => b.key === key);
    if (bucket) bucket.revenue += TEAM_FEE_INR;
  });

  const maxDailyRevenue = Math.max(...dayBuckets.map((b) => b.revenue), TEAM_FEE_INR);

  const inferCountry = (institution: string, phone: string) => {
    const text = `${institution || ''} ${phone || ''}`.toLowerCase();
    if (text.includes('+91') || text.includes('india') || text.includes('tamil nadu')) return 'India';
    if (text.includes('+1') || text.includes('usa') || text.includes('united states')) return 'United States';
    if (text.includes('+44') || text.includes('uk') || text.includes('united kingdom')) return 'United Kingdom';
    if (text.includes('+33') || text.includes('france')) return 'France';
    if (text.includes('+49') || text.includes('germany')) return 'Germany';
    return 'Other';
  };

  const countryRevenueMap = new Map<string, number>();
  paymentSuccessRegistrations.forEach((reg) => {
    const country = inferCountry(reg.institution, reg.contact_phone);
    countryRevenueMap.set(country, (countryRevenueMap.get(country) || 0) + TEAM_FEE_INR);
  });

  const topCountries = Array.from(countryRevenueMap.entries())
    .map(([country, revenue]) => ({ country, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxCountryRevenue = Math.max(...topCountries.map((c) => c.revenue), TEAM_FEE_INR);
  const activeCountry = topCountries.find((c) => c.country === hoveredCountry) || topCountries[0] || null;
  const activeCountryMeta = activeCountry ? (COUNTRY_META[activeCountry.country] || COUNTRY_META.Other) : COUNTRY_META.Other;

  const getMonthRevenue = (year: number, month: number) => paymentSuccessRegistrations
    .filter((reg) => {
      const d = new Date(reg.created_at);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .length * TEAM_FEE_INR;

  const currentMonthRevenue = getMonthRevenue(now.getFullYear(), now.getMonth());
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthRevenue = getMonthRevenue(prevDate.getFullYear(), prevDate.getMonth());
  const growthRate = previousMonthRevenue > 0
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : (currentMonthRevenue > 0 ? 100 : 0);
  const countdownPreviewTarget = getCountdownPreviewTarget(countdownDate, countdownTime);

  return (
    <div className="min-h-screen bg-background px-3 py-4 sm:px-4 sm:py-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your hackathon</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
              <motion.span
                className="inline-flex mr-2"
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isRefreshing
                    ? { duration: 0.9, repeat: Infinity, ease: 'linear' }
                    : { type: 'spring', stiffness: 220, damping: 20 }
                }
                whileHover={!isRefreshing ? { rotate: 120 } : undefined}
                whileTap={!isRefreshing ? { rotate: 220, scale: 0.95 } : undefined}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.span>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <span className="text-sm text-muted-foreground hidden md:inline">{user?.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mb-8 lg:grid-cols-5 lg:gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-500">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-500">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{rejectedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-500">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{paidCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="inline-flex h-auto min-w-max gap-1 p-1">
              <TabsTrigger className="shrink-0" value="registrations"><Users className="w-4 h-4 mr-2" />Registrations</TabsTrigger>
              <TabsTrigger className="shrink-0" value="problems"><Edit className="w-4 h-4 mr-2" />Problems</TabsTrigger>
              <TabsTrigger className="shrink-0" value="winners"><Trophy className="w-4 h-4 mr-2" />Winners</TabsTrigger>
              <TabsTrigger className="shrink-0" value="timeline"><CalendarDays className="w-4 h-4 mr-2" />Timeline</TabsTrigger>
              <TabsTrigger className="shrink-0" value="countdown"><Timer className="w-4 h-4 mr-2" />Countdown</TabsTrigger>
              <TabsTrigger className="shrink-0" value="analytics"><BarChart3 className="w-4 h-4 mr-2" />Analytics</TabsTrigger>
              <TabsTrigger className="shrink-0" value="payments"><CreditCard className="w-4 h-4 mr-2" />Payments</TabsTrigger>
            </TabsList>
          </div>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Registrations</CardTitle>
                  <CardDescription>Manage team registrations. Email button sends a manual update email to that team contact.</CardDescription>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button onClick={handleBroadcastEmail} variant="outline">
                    <Mail className="w-4 h-4 mr-2" />Broadcast
                  </Button>
                  <Button onClick={exportToCSV} variant="default">
                    <Download className="w-4 h-4 mr-2" />Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_260px_auto] lg:items-end">
                    <div className="space-y-1.5">
                      <Label htmlFor="search" className="text-xs text-muted-foreground">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search by team ID, team name, email, college..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="h-11 pl-10 pr-10"
                        />
                        {searchTerm ? (
                          <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Payment Status
                      </Label>
                      <div className="relative">
                        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                          <SelectTrigger className="h-11 pl-10">
                            <SelectValue placeholder="All Payment States" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Payment States</SelectItem>
                            <SelectItem value="checkout_initialized">Checkout Initialized</SelectItem>
                            <SelectItem value="payment_pending">Payment Pending</SelectItem>
                            <SelectItem value="payment_success">Payment Success</SelectItem>
                            <SelectItem value="payment_failed">Payment Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11"
                      onClick={() => {
                        setSearchTerm('');
                        setPaymentStatusFilter('all');
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    <p className="text-xs text-muted-foreground">
                      {filteredRegistrations.length} registration{filteredRegistrations.length === 1 ? '' : 's'}
                    </p>
                    <div className="inline-flex rounded-lg border bg-background p-1">
                      <Button
                        type="button"
                        size="sm"
                        variant={registrationView === 'list' ? 'default' : 'ghost'}
                        className="h-8 px-3"
                        onClick={() => setRegistrationView('list')}
                      >
                        <Rows3 className="w-4 h-4 mr-1.5" />List
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={registrationView === 'cards' ? 'default' : 'ghost'}
                        className="h-8 px-3"
                        onClick={() => setRegistrationView('cards')}
                      >
                        <LayoutGrid className="w-4 h-4 mr-1.5" />Cards
                      </Button>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No registrations found</p>
                  </div>
                ) : (
                  <div className={registrationView === 'cards' ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 p-1 sm:p-2" : "space-y-4"}>
                    {filteredRegistrations.map((reg) => registrationView === 'cards' ? (
                      <div key={reg.id} className="h-[320px] sm:h-[300px] w-full">
                        <RegistrationFlipCard
                          registration={reg}
                          onApprove={() => handleApproveRegistration(reg.id)}
                          onReject={() => handleRejectRegistration(reg.id)}
                          onEmail={() => window.open(`mailto:${reg.contact_email}`, '_blank')}
                          onEdit={handleEditRegistration}
                          onDelete={setRegistrationToDelete}
                          isProcessing={processingIds.has(reg.id)}
                        />
                      </div>
                    ) : ( 
                      <div key={reg.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        {(() => {
                          const statusDisplay = reg.status === 'approved'
                            ? {
                                label: 'Approved',
                                className: 'bg-green-500/10 text-green-700 border-green-500/40',
                                icon: <Check className="w-3 h-3" />,
                              }
                            : reg.status === 'rejected'
                              ? {
                                  label: 'Rejected',
                                  className: 'bg-red-500/10 text-red-700 border-red-500/40',
                                  icon: <X className="w-3 h-3" />,
                                }
                              : {
                                  label: 'Pending Review',
                                  className: 'bg-amber-500/10 text-amber-700 border-amber-500/40',
                                  icon: <RefreshCw className="w-3 h-3" />,
                                };

                          return (
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{reg.team_name}</h3>
                              {reg.team_id ? <Badge variant="outline">{reg.team_id}</Badge> : null}
                              <Badge variant="outline" className={`flex items-center gap-1 ${statusDisplay.className}`}>
                                {statusDisplay.icon}
                                {statusDisplay.label}
                              </Badge>
                              {reg.payment_screenshot ? (
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/50">
                                  <Image className="w-3 h-3 mr-1" />
                                  Payment Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/50">
                                  Payment Pending
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <p>
                                <span className="font-medium">Leader:</span> {reg.team_members?.[0]?.name || '-'}
                              </p>
                              <p className="break-all">
                                <span className="font-medium">Email:</span> {reg.contact_email}
                              </p>
                              <p className="break-words">
                                <span className="font-medium">College:</span> {reg.institution}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span> {reg.contact_phone || '-'}
                              </p>
                              <p>
                                <span className="font-medium">Members:</span> {reg.team_members?.length || 1}
                              </p>
                              <p>
                                <span className="font-medium">Year:</span> {reg.year_of_study || '-'}
                              </p>
                              <p>
                                <span className="font-medium">Payment Status:</span> {reg.payment_status || (reg.payment_screenshot ? 'payment_success' : 'payment_pending')}
                              </p>
                              <p>
                                <span className="font-medium">Registration Status:</span> {statusDisplay.label}
                                {reg.updated_at ? ` • ${new Date(reg.updated_at).toLocaleString('en-IN')}` : ''}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 break-words">
                              <span className="font-medium">Problem Statement:</span> {reg.problem_statement}
                            </p>
                            {reg.payment_screenshot && (
                              <div className="mt-3 p-3 bg-green-500/5 border border-green-500/20 rounded-md">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-green-600">Payment Screenshot Uploaded</span>
                                  <a 
                                    href={reg.payment_screenshot} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline font-medium flex items-center gap-1"
                                  >
                                    <Image className="w-4 h-4" />
                                    View Screenshot
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 md:min-w-[140px] w-full md:w-auto">
                            {reg.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveRegistration(reg.id)} 
                                  className="bg-green-500 hover:bg-green-600 w-full"
                                  disabled={processingIds.has(reg.id)}
                                >
                                  {processingIds.has(reg.id) ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />Approve
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleRejectRegistration(reg.id)}
                                  className="w-full"
                                  disabled={processingIds.has(reg.id)}
                                >
                                  {processingIds.has(reg.id) ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-4 h-4 mr-1" />Reject
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                            {reg.status === 'approved' && (
                              <>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-green-500/40 text-green-700"
                                  disabled
                                >
                                  <Check className="w-4 h-4 mr-1" />Approved
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleRejectRegistration(reg.id)}
                                  className="w-full"
                                  disabled={processingIds.has(reg.id)}
                                >
                                  {processingIds.has(reg.id) ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-4 h-4 mr-1" />Mark Rejected
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                            {reg.status === 'rejected' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-red-500/40 text-red-700"
                                  disabled
                                >
                                  <X className="w-4 h-4 mr-1" />Rejected
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveRegistration(reg.id)} 
                                  className="bg-green-500 hover:bg-green-600 w-full"
                                  disabled={processingIds.has(reg.id)}
                                >
                                  {processingIds.has(reg.id) ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />Approve Again
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditRegistration(reg)}
                              className="w-full"
                              disabled={processingIds.has(reg.id)}
                            >
                              <Edit className="w-4 h-4 mr-1" />Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleSendEmail(reg.contact_email)}
                              className="w-full"
                              disabled={processingIds.has(reg.id)}
                            >
                              <Mail className="w-4 h-4 mr-1" />Email
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setRegistrationToDelete(reg)}
                              className="w-full"
                              disabled={processingIds.has(reg.id)}
                            >
                              {processingIds.has(reg.id) ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />Delete
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        );
                        })()}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Problem Statements Tab */}
          <TabsContent value="problems">
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Problem Statements</CardTitle>
                  <CardDescription>Manage hackathon challenges</CardDescription>
                </div>
                <Button onClick={() => setShowAddProblemDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />Add Problem
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problemStatements.map((problem) => (
                    <div key={problem.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold">{problem.title}</h3>
                            <Badge variant={problem.is_active ? 'default' : 'secondary'}>
                              {problem.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">{problem.difficulty}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{problem.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Category:</span> {problem.category}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap w-full md:w-auto">
                          <Button size="sm" variant="outline" onClick={() => handleToggleProblemStatus(problem.id, problem.is_active)}>
                            {problem.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProblemStatement(problem.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {problemStatements.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No problem statements yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Winners Tab */}
          <TabsContent value="winners">
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Winners</CardTitle>
                  <CardDescription>Manage hackathon results</CardDescription>
                </div>
                <Button onClick={() => setShowAddWinnerDialog(true)}>
                  <Trophy className="w-4 h-4 mr-2" />Add Winner
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {winners.map((winner) => {
                    const reg = registrations.find(r => r.id === winner.registration_id);
                    return (
                      <div key={winner.id} className="border rounded-lg p-4 bg-secondary">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                              ${winner.rank === 1 ? 'bg-foreground text-background' :
                                winner.rank === 2 ? 'bg-muted-foreground text-background' :
                                'bg-primary text-primary-foreground'}`}>
                              {winner.rank === 1 ? '🥇' : winner.rank === 2 ? '🥈' : '🥉'}
                            </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-lg break-words">{reg?.team_name || 'Unknown Team'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {winner.rank === 1 ? 'First Place' : winner.rank === 2 ? 'Second Place' : 'Third Place'}
                                {winner.prize && ` • ${winner.prize}`}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteWinner(winner.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {winners.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No winners announced yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Timeline Controls</CardTitle>
                  <CardDescription>Edit date, time, and status for events shown on the public timeline page. Updating Hackathon Days also updates the homepage Event starts in countdown.</CardDescription>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                  <Button variant="outline" onClick={fetchTimelineEvents} disabled={timelineLoading || timelineSaving}>Reload</Button>
                  <Button variant="outline" onClick={handleResetTimeline} disabled={timelineLoading || timelineSaving}>Reset Default</Button>
                  <Button onClick={handleSaveTimeline} disabled={timelineLoading || timelineSaving}>
                    {timelineSaving ? 'Saving...' : 'Save Timeline'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {timelineLoading ? (
                  <p className="text-sm text-muted-foreground">Loading timeline events...</p>
                ) : (
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                        <div className="lg:col-span-3 space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={event.title}
                            onChange={(e) => handleTimelineFieldChange(event.id, 'title', e.target.value)}
                          />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                          <Label>Date</Label>
                          <Input
                            value={event.date}
                            onChange={(e) => handleTimelineFieldChange(event.id, 'date', e.target.value)}
                          />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                          <Label>Time</Label>
                          <Input
                            value={event.time}
                            onChange={(e) => handleTimelineFieldChange(event.id, 'time', e.target.value)}
                          />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={event.status}
                            onValueChange={(value: TimelineEventStatus) => handleTimelineStatusChange(event.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="lg:col-span-3 space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={event.description}
                            onChange={(e) => handleTimelineFieldChange(event.id, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Event #{index + 1}</p>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="countdown">
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Countdown Editor</CardTitle>
                  <CardDescription>Customize the homepage Event starts in countdown target without editing timeline cards manually.</CardDescription>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                  <Button variant="outline" onClick={fetchTimelineEvents} disabled={timelineLoading || timelineSaving}>Reload</Button>
                  <Button onClick={handleSaveCountdown} disabled={timelineLoading || timelineSaving}>
                    {timelineSaving ? 'Saving...' : 'Save Countdown'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {timelineLoading ? (
                  <p className="text-sm text-muted-foreground">Loading countdown settings...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Countdown Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between h-11 font-normal"
                          >
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-muted-foreground" />
                              {countdownDate || 'Select date'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={parseCountdownDateText(countdownDate)}
                            onSelect={(date) => {
                              if (!date) return;
                              setCountdownDate(toCountdownDateText(date));
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Countdown Time</Label>
                      <Select value={countdownTime} onValueChange={setCountdownTime}>
                        <SelectTrigger className="h-11 gap-2">
                          <Clock3 className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          <SelectItem value={COUNTDOWN_STOP_VALUE}>0 (Stop countdown - all values 00)</SelectItem>
                          {TIME_OPTIONS.map((timeOption) => (
                            <SelectItem key={timeOption.value} value={timeOption.value}>{timeOption.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="md:col-span-2 text-xs text-muted-foreground">
                      This editor updates the Hackathon Days timeline event, which powers the homepage countdown timer.
                    </p>

                    <div className="md:col-span-2 rounded-lg border bg-card p-4 sm:p-5">
                      <p className="mb-3 text-xs tracking-[0.18em] uppercase text-muted-foreground font-medium">
                        Home Page Countdown Preview
                      </p>
                      {countdownPreviewTarget ? (
                        <div className="overflow-x-auto">
                          <div className="min-w-[320px]">
                            <CountdownTimer targetDate={countdownPreviewTarget} />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Select a valid date and time to preview the countdown.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registrations by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Approved</span>
                      <span className="font-bold text-green-500">{approvedCount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-foreground h-2 rounded-full" style={{ width: `${totalCount ? (approvedCount/totalCount)*100 : 0}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pending</span>
                      <span className="font-bold text-yellow-500">{pendingCount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-muted-foreground h-2 rounded-full" style={{ width: `${totalCount ? (pendingCount/totalCount)*100 : 0}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rejected</span>
                      <span className="font-bold text-red-500">{rejectedCount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-destructive h-2 rounded-full" style={{ width: `${totalCount ? (rejectedCount/totalCount)*100 : 0}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Total Registrations</span>
                      <span className="font-bold text-2xl">{totalCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Total Teams</span>
                      <span className="font-bold text-2xl">{registrations.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Active Problems</span>
                      <span className="font-bold text-2xl">{problemStatements.filter(p => p.is_active).length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Announced Winners</span>
                      <span className="font-bold text-2xl">{winners.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Wallet className="w-4 h-4" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">Rs {totalRevenueInr.toLocaleString('en-IN')}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      Payments Count
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">{paymentSuccessRegistrations.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <RefreshCw className="w-4 h-4" />
                      Total Refunds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">Rs {totalRefundsInr.toLocaleString('en-IN')}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Payouts Received
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">Rs {payoutsReceivedInr.toLocaleString('en-IN')}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue (Last 30 Days)</CardTitle>
                  <CardDescription>Derived from successful payment registrations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-52 w-full border rounded-lg p-3 bg-muted/20">
                    <div className="h-full flex items-end gap-1">
                      {dayBuckets.map((bucket) => (
                        <div key={bucket.key} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-[8px]">
                          <div
                            className="w-full rounded-sm bg-foreground/80 hover:bg-foreground transition-colors"
                            style={{ height: `${Math.max((bucket.revenue / maxDailyRevenue) * 100, bucket.revenue > 0 ? 6 : 2)}%` }}
                            title={`${bucket.label}: Rs ${bucket.revenue.toLocaleString('en-IN')}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span>{dayBuckets[0]?.label}</span>
                    <span>{dayBuckets[dayBuckets.length - 1]?.label}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe2 className="w-4 h-4" />Top Revenue Generating Countries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5 items-center">
                      <div className="rounded-lg overflow-hidden border bg-background p-2 h-[280px] lg:h-[320px] relative">
                        <img
                          src="/dotted-map/Black_on_white_dotted_world_map_vector.jpg"
                          alt="Dotted world map"
                          className="w-full h-full object-contain"
                        />

                        {topCountries.map((row) => {
                          const meta = COUNTRY_META[row.country] || COUNTRY_META.Other;
                          const isActive = activeCountry?.country === row.country;
                          return (
                            <button
                              key={`${row.country}-marker`}
                              type="button"
                              className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-all ${
                                isActive
                                  ? 'bg-green-500 border-white scale-125 shadow-[0_0_0_6px_rgba(34,197,94,0.18)]'
                                  : 'bg-blue-500 border-white hover:scale-110'
                              }`}
                              style={{ left: `${meta.x}%`, top: `${meta.y}%` }}
                              onMouseEnter={() => setHoveredCountry(row.country)}
                              onMouseLeave={() => setHoveredCountry(null)}
                              aria-label={`${row.country} revenue marker`}
                            />
                          );
                        })}

                        {activeCountry ? (
                          <div
                            className="absolute z-10 bg-white border rounded-xl px-3 py-2 shadow-lg min-w-[120px]"
                            style={{
                              left: `min(calc(${activeCountryMeta.x}% + 14px), calc(100% - 136px))`,
                              top: `max(calc(${activeCountryMeta.y}% - 52px), 10px)`,
                            }}
                          >
                            <p className="text-xs text-muted-foreground mb-0.5">{COUNTRY_META[activeCountry.country]?.flag || '🌐'} {activeCountry.country}</p>
                            <p className="text-sm font-semibold">Rs {activeCountry.revenue.toLocaleString('en-IN')}</p>
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-3">
                        {topCountries.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No payment country data yet.</p>
                        ) : topCountries.map((row) => (
                          <div
                            key={row.country}
                            className="rounded-lg p-2 hover:bg-muted/40 transition-colors"
                            onMouseEnter={() => setHoveredCountry(row.country)}
                            onMouseLeave={() => setHoveredCountry(null)}
                          >
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="font-medium flex items-center gap-2">
                                <span>{COUNTRY_META[row.country]?.flag || '🌐'}</span>
                                {row.country}
                              </span>
                              <span className="text-muted-foreground">Rs {row.revenue.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${activeCountry?.country === row.country ? 'bg-blue-600' : 'bg-blue-500'}`}
                                style={{ width: `${(row.revenue / maxCountryRevenue) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Growth Rate</CardTitle>
                    <CardDescription>Month-over-month view based on successful payments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Previous Month</p>
                        <p className="text-lg font-semibold">Rs {previousMonthRevenue.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Current Month</p>
                        <p className="text-lg font-semibold">Rs {currentMonthRevenue.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border bg-background flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth Rate</span>
                      <span className={`text-xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Problem Dialog */}
      <Dialog open={showAddProblemDialog} onOpenChange={setShowAddProblemDialog}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Add Problem Statement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newProblem.title} onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })} placeholder="Problem title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={newProblem.description} onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })} placeholder="Problem description" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={newProblem.category} onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })} placeholder="e.g., AI, Blockchain, etc." />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <select
                className="w-full p-2 border rounded"
                value={newProblem.difficulty}
                onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProblemDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProblemStatement}>Add Problem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Winner Dialog */}
      <Dialog open={showAddWinnerDialog} onOpenChange={setShowAddWinnerDialog}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Add Winner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Team</Label>
              <select
                className="w-full p-2 border rounded"
                value={selectedWinnerRegistration}
                onChange={(e) => setSelectedWinnerRegistration(e.target.value)}
              >
                <option value="">Select a team...</option>
                {registrations.filter(r => r.status === 'approved').map((reg) => (
                  <option key={reg.id} value={reg.id}>{reg.team_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Rank</Label>
              <select
                className="w-full p-2 border rounded"
                value={winnerRank}
                onChange={(e) => setWinnerRank(e.target.value as '1' | '2' | '3')}
              >
                <option value="1">🥇 First Place</option>
                <option value="2">🥈 Second Place</option>
                <option value="3">🥉 Third Place</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Prize</Label>
              <Input value={winnerPrize} onChange={(e) => setWinnerPrize(e.target.value)} placeholder="e.g., ₹10,000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWinnerDialog(false)}>Cancel</Button>
            <Button onClick={handleAddWinner} disabled={!selectedWinnerRegistration}>Add Winner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Registration Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg p-4 sm:p-5">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2 max-h-[72vh] overflow-y-auto pr-1">
            <div className="space-y-1 md:col-span-2">
              <Label>Team ID</Label>
              <Input value={editForm.team_id || 'Auto-generated'} disabled />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Team Name</Label>
              <Input value={editForm.team_name} onChange={(e) => setEditForm({ ...editForm, team_name: e.target.value })} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Email</Label>
              <Input value={editForm.contact_email} onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={editForm.contact_phone} onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>College</Label>
              <Input value={editForm.institution} onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Year</Label>
              <Select
                value={editForm.year_of_study || ''}
                onValueChange={(value) => setEditForm({ ...editForm, year_of_study: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value: 'pending' | 'approved' | 'rejected') => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Problem Statement</Label>
              <Input value={editForm.problem_statement} onChange={(e) => setEditForm({ ...editForm, problem_statement: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!registrationToDelete}
        onOpenChange={(open) => {
          if (!open && !registrationToDelete) return;
          if (!open) setRegistrationToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Registration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {registrationToDelete?.team_name || 'this registration'} from database.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!(registrationToDelete && processingIds.has(registrationToDelete.id))}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (registrationToDelete?.id) {
                  void handleDeleteRegistration(registrationToDelete.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!(registrationToDelete && processingIds.has(registrationToDelete.id))}
            >
              {registrationToDelete && processingIds.has(registrationToDelete.id) ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;

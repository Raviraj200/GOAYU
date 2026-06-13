import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  Smartphone, 
  User, 
  Terminal, 
  Eye, 
  Copy,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (name: string, email: string, token?: string) => void;
  onNavigate: (view: string) => void;
}

const COUNTRY_CODES = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
];

export default function LoginView({ onLoginSuccess, onNavigate }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  
  // OTP Session states
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Timers
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiryCountdown, setExpiryCountdown] = useState(300); // 5 minutes
  
  // Simulated logs (Developer Console)
  const [simulatedLogs, setSimulatedLogs] = useState<any[]>([]);
  const [showSimPanel, setShowSimPanel] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Interval references
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const expiryRef = useRef<NodeJS.Timeout | null>(null);
  const logRef = useRef<NodeJS.Timeout | null>(null);

  // Resend countdown handler
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownRef.current = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [resendCooldown]);

  // Expiry countdown handler
  useEffect(() => {
    if (otpSent && expiryCountdown > 0) {
      expiryRef.current = setTimeout(() => {
        setExpiryCountdown(prev => prev - 1);
      }, 1000);
    } else if (expiryCountdown === 0) {
      setErrorMsg('The verification code has expired. Please select "Resend OTP".');
    }
    return () => {
      if (expiryRef.current) clearTimeout(expiryRef.current);
    };
  }, [otpSent, expiryCountdown]);

  // Fetch simulated SMS logs when in verification phase
  useEffect(() => {
    if (otpSent) {
      fetchSimLogs();
      logRef.current = setInterval(fetchSimLogs, 3000);
    } else {
      setSimulatedLogs([]);
    }
    return () => {
      if (logRef.current) clearInterval(logRef.current);
    };
  }, [otpSent]);

  const fetchSimLogs = async () => {
    try {
      const res = await fetch('/api/auth/simulated-sms');
      if (res.ok) {
        const data = await res.json();
        setSimulatedLogs(data);
      }
    } catch (e) {
      console.error('Error fetching simulated sms logs:', e);
    }
  };

  const cleanInputPhone = (v: string) => {
    return v.replace(/\D/g, '').slice(0, 10);
  };

  // Dispatch SMS flow
  const handleSendOtpInternal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    // Validate phone number length (custom for general cellular)
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setErrorMsg('Please enter a standard 10-digit mobile number.');
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMsg('Please fill in your genuine name to initiate your Ayurvedic account.');
      return;
    }

    setIsLoading(true);

    const fullPhone = `${countryCode}${phoneNumber.trim()}`;

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to dispatch security code. Try again later.');
        setIsLoading(false);
        return;
      }

      setOtpSent(true);
      setExpiryCountdown(300); // 5 mins
      setResendCooldown(60); // 60 seconds
      setSuccessMsg(
        data.simulationMode 
          ? `Swasthi! A test OTP has been processed. Use the Simulated Terminal below to complete authentication.`
          : `Swasthi! Your security OTP is on its way via premium SMS. Please verify within 5 minutes.`
      );
      
      // Auto trigger logs fetch
      setTimeout(fetchSimLogs, 500);

    } catch (err) {
      console.error(err);
      setErrorMsg('Server connection collapsed. Check whether backend Node.js is healthy.');
    } finally {
      setIsLoading(false);
    }
  };

  // Complete OTP verification login
  const handleVerifyOtpInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setErrorMsg('Please input the authentic 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    const fullPhone = `${countryCode}${phoneNumber.trim()}`;

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullPhone,
          otp: enteredOtp.trim(),
          name: isRegister ? name.trim() : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Verification protocol failed.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg(data.message || 'Verification established successfully!');
      
      // Pass details back up through App framework
      setTimeout(() => {
        onLoginSuccess(data.user.name, data.user.phone, data.token);
        
        // Navigate appropriately
        if (data.user.role === 'admin') {
          onNavigate('admin');
        } else {
          onNavigate('home');
        }
      }, 1200);

    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error during authentication handshake.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillSimulatedOtp = (otp: string) => {
    setEnteredOtp(otp);
    setSuccessMsg('Pristine OTP token transferred successfully! Ready to login.');
  };

  // Convert remaining seconds into MM:SS format
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div id="goayu-otp-system-container" className="bg-stone-50 min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      
      <div className="max-w-md w-full bg-white border border-stone-200/60 p-6 sm:p-9 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Soft background ambient gradient */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2">
          {/* Logo element resembling traditional medicine circle */}
          <div className="w-14 h-14 bg-emerald-800 rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-2xl mx-auto shadow-inner border border-emerald-900">
            🌿
          </div>
          <h2 className="text-2xl font-serif font-black text-emerald-950 tracking-tight leading-none pt-2">
            {isRegister ? 'Create Wellness Account' : 'Secure OTP Login'}
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {isRegister 
              ? 'Initiate your Ayurvedic health chart and save digital consulting histories.' 
              : 'Enter your phone coordinate to authorize safe biological botanical access.'}
          </p>
        </div>

        {/* Info alerts/Offers */}
        {isRegister && (
          <div className="bg-amber-50/70 border border-amber-200/50 p-3 rounded-2xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 leading-relaxed font-sans">
              <strong>Premium Circle Token Assigned:</strong> Get instant 20% off elixirs on registration using coupon code <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">AYU20</code>!
            </div>
          </div>
        )}

        {/* Message banners */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-[11px] p-3.5 rounded-2xl flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <span className="leading-normal">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-900 text-[11px] p-3.5 rounded-2xl flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200 font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-normal">{successMsg}</span>
          </div>
        )}

        {/* STEP 1: ENTER PHONE AND NAME */}
        {!otpSent ? (
          <form onSubmit={handleSendOtpInternal} className="space-y-4 text-xs font-sans text-stone-700">
            {isRegister && (
              <div className="space-y-1">
                <label className="block font-semibold text-stone-600">Full Name / Ayurvedic Title *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-stone-400">
                    <User className="w-4 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Acharya Vikrant"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-10 pr-3 py-3.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850 font-sans font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-semibold text-stone-600 animate-pulse-slow">Mobile Number *</label>
              <div className="flex gap-2">
                <div className="relative shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="appearance-none bg-stone-100 border border-stone-200 text-stone-800 pl-3 pr-8 py-3.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-800 cursor-pointer"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code + c.name} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2.5 top-4.5 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-stone-500 pointer-events-none" />
                </div>
                
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-3.5 text-stone-400">
                    <Smartphone className="w-4 h-5" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={phoneNumber}
                    disabled={isLoading}
                    onChange={(e) => setPhoneNumber(cleanInputPhone(e.target.value))}
                    className="w-full text-xs pl-10 pr-3 py-3.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800 bg-stone-50 focus:bg-white text-stone-850 font-sans font-bold tracking-wider"
                  />
                </div>
              </div>
            </div>

            <button
              id="send-otp-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-850 hover:bg-emerald-900 hover:scale-[1.01] active:translate-y-0.5 text-white font-bold py-3.5 rounded-xl text-center cursor-pointer transition-all uppercase tracking-wider text-xs shadow-md border border-emerald-950 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Phone className="w-4 h-4 text-amber-300" />
              )}
              <span>{isLoading ? 'Verifying Coordinates...' : 'Request Secure 6-Digit OTP'}</span>
            </button>
          </form>
        ) : (
          /* STEP 2: VERIFY 6-DIGIT OTP */
          <form onSubmit={handleVerifyOtpInternal} className="space-y-4 text-xs font-sans">
            
            <div className="space-y-2 text-center bg-stone-50 border border-stone-200/50 p-4 rounded-2xl">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-stone-400">verification channel</span>
              <span className="block text-sm font-black text-emerald-950 tracking-wider">
                {countryCode} {phoneNumber}
              </span>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                  setEnteredOtp('');
                }}
                className="text-[10.5px] text-amber-700 font-bold hover:underline cursor-pointer"
              >
                Change Number
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-0.5">
                <label className="font-semibold text-stone-600">Enter 6-Digit Security OTP</label>
                {expiryCountdown > 0 ? (
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Expires in {formatTime(expiryCountdown)}</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-red-600">Expired</span>
                )}
              </div>

              <input
                type="text"
                autoFocus
                placeholder="Ex: 574281"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center tracking-[0.5em] text-2xl font-mono p-3.5 border-2 border-stone-200 focus:border-emerald-800 rounded-xl focus:outline-none bg-stone-55 text-emerald-950 font-bold"
              />
            </div>

            <button
              id="verify-otp-btn"
              type="submit"
              disabled={isLoading || expiryCountdown === 0}
              className="w-full bg-emerald-850 hover:bg-emerald-900 active:translate-y-0.5 text-white font-bold py-3.5 rounded-xl text-center cursor-pointer transition-all uppercase tracking-wider text-xs shadow-md border border-emerald-950 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 text-amber-300" />
              )}
              <span>{isLoading ? 'Decrypting Security Sages...' : 'Verify Code & Autonomic Access'}</span>
            </button>

            <div className="text-center pt-1.5 flex justify-center items-center gap-2">
              <span className="text-stone-400 font-medium">Didn't receive the SMS?</span>
              {resendCooldown > 0 ? (
                <span className="text-stone-400 font-bold font-mono">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtpInternal}
                  className="font-black text-amber-700 hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend OTP Now</span>
                </button>
              )}
            </div>

          </form>
        )}

        <div className="border-t border-stone-100 pt-4 text-center">
          <p className="text-[11px] text-stone-500 font-sans font-medium">
            {isRegister ? 'Already possess a spiritual medical profile? ' : 'First time purchasing botanical elixirs? '}
            <button
              onClick={() => {
                setErrorMsg('');
                setSuccessMsg('');
                setOtpSent(false);
                setIsRegister(!isRegister);
                setEnteredOtp('');
              }}
              className="font-black text-amber-700 hover:underline cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Create Profile'}
            </button>
          </p>
        </div>

        <div className="text-[10px] text-stone-400 font-mono text-center flex items-center justify-center gap-1 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Biometric 256-Bit SSL Enclave Protection Active</span>
        </div>

      </div>

      {/* STEP 3: FLOATING DEVELOPER SIMULATOR TERMINAL */}
      {otpSent && (
        <div className="max-w-md w-full mt-6 bg-stone-900 text-stone-100 rounded-2xl shadow-2xl overflow-hidden border border-stone-800 font-mono text-xs select-none">
          
          <div className="bg-stone-950 px-4 py-2.5 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10.5px] font-bold text-stone-300 tracking-wide">SMS GATEWAY SIMULATION TERMINAL</span>
            </div>
            <button
              onClick={() => setShowSimPanel(!showSimPanel)}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline font-bold"
            >
              {showSimPanel ? 'Minimize' : 'Expand Logs'}
            </button>
          </div>

          {showSimPanel && (
            <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
              {simulatedLogs.length === 0 ? (
                <div className="py-4 text-center text-stone-500 italic flex flex-col items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-stone-700 animate-ping" />
                  <span>Awaiting outbound carrier dispatch...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {simulatedLogs.map((log, idx) => (
                    <div 
                      key={log.id} 
                      className="bg-stone-950 p-3 rounded-lg border border-stone-800/80 space-y-2 hover:border-emerald-500/20 transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px] text-stone-500 border-b border-stone-900 pb-1.5">
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-stone-400" />
                          <span>To: <strong className="text-stone-300">{log.phone}</strong></span>
                        </span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      
                      <p className="text-[11px] text-amber-100/90 leading-relaxed italic bg-amber-500/5 px-2 py-1.5 rounded border border-amber-500/10">
                        {log.message}
                      </p>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fillSimulatedOtp(log.otp)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white py-1 px-2.5 rounded font-sans font-bold text-[10.5px] cursor-pointer text-center"
                        >
                          ⚡ Quick-Fill OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(log.otp, idx)}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white p-1.5 rounded cursor-pointer flex items-center justify-center gap-1"
                          title="Copy pure code"
                        >
                          {copiedIndex === idx ? (
                            <span className="text-[10px] text-emerald-400 font-semibold px-1">Copied!</span>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px] px-0.5">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="bg-stone-950 px-4 py-2 text-[10px] text-stone-500 border-t border-stone-800 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Developer Note: This box simulates live GSM SMS delivery for sandboxed test loops.</span>
          </div>

        </div>
      )}

    </div>
  );
}

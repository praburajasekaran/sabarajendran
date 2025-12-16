import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Clock, RefreshCw, X } from 'lucide-react';
import { wpService } from '../services/wpService';

interface OTPVerificationProps {
    phoneNumber: string;
    onVerificationSuccess: (token: string) => void;
    onCancel: () => void;
    language: 'en' | 'ta';
}

interface Translations {
    title: string;
    subtitle: string;
    enterOTP: string;
    verify: string;
    resend: string;
    resendIn: string;
    timeRemaining: string;
    invalidOTP: string;
    expiredOTP: string;
    rateLimitError: string;
    maxResendError: string;
    networkError: string;
    verifying: string;
    sending: string;
    cancel: string;
}

const translations: Record<'en' | 'ta', Translations> = {
    en: {
        title: 'Verify Your Phone Number',
        subtitle: 'Enter the OTP sent to',
        enterOTP: 'Enter OTP',
        verify: 'Verify',
        resend: 'Resend OTP',
        resendIn: 'Resend in {seconds}s',
        timeRemaining: 'Time remaining: {minutes}:{seconds}',
        invalidOTP: 'Invalid OTP. Please try again.',
        expiredOTP: 'OTP expired. Please request a new one.',
        rateLimitError: 'You have reached the maximum submissions (3) for today.',
        maxResendError: 'Maximum resend attempts (5) reached. Please try again later.',
        networkError: 'Network error. Please try again.',
        verifying: 'Verifying...',
        sending: 'Sending OTP...',
        cancel: 'Cancel'
    },
    ta: {
        title: 'உங்கள் தொலைபேசி எண்ணை சரிபார்க்கவும்',
        subtitle: 'அனுப்பப்பட்ட OTP ஐ உள்ளிடவும்',
        enterOTP: 'OTP ஐ உள்ளிடவும்',
        verify: 'சரிபார்க்கவும்',
        resend: 'OTP ஐ மீண்டும் அனுப்பவும்',
        resendIn: '{seconds} வினாடிகளில் மீண்டும் அனுப்பவும்',
        timeRemaining: 'மீதமுள்ள நேரம்: {minutes}:{seconds}',
        invalidOTP: 'தவறான OTP. மீண்டும் முயற்சிக்கவும்.',
        expiredOTP: 'OTP காலாவதியானது. புதிய OTP ஐ கோரவும்.',
        rateLimitError: 'இன்றைய அதிகபட்ச சமர்ப்பிப்புகளை (3) அடைந்துவிட்டீர்கள்.',
        maxResendError: 'அதிகபட்ச மீண்டும் அனுப்பும் முயற்சிகள் (5) அடைந்தது. பின்னர் முயற்சிக்கவும்.',
        networkError: 'நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.',
        verifying: 'சரிபார்க்கிறது...',
        sending: 'OTP அனுப்புகிறது...',
        cancel: 'ரத்து செய்'
    }
};

export const OTPVerification: React.FC<OTPVerificationProps> = ({
    phoneNumber,
    onVerificationSuccess,
    onCancel,
    language
}) => {
    const t = translations[language];
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30); // 30 seconds cooldown
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendCount, setResendCount] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setError(t.expiredOTP);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, t.expiredOTP]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(null);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
        setOtp(newOtp);

        // Focus last filled input or first empty
        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError(t.invalidOTP);
            return;
        }

        setIsVerifying(true);
        setError(null);

        try {
            const data = await wpService.verifyOTP(phoneNumber, otpString);

            if (data.success && data.verification_token) {
                onVerificationSuccess(data.verification_token);
            } else {
                throw new Error(t.invalidOTP);
            }
        } catch (err: any) {
            setError(err.message || t.networkError);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend || resendCount >= 5) return;

        setIsSending(true);
        setError(null);

        try {
            const data = await wpService.resendOTP(phoneNumber);

            if (data.success) {
                setResendCount(data.resend_count || resendCount + 1);
                setTimeRemaining(900); // Reset to 15 minutes
                setCanResend(false);
                setResendCooldown(30); // Reset cooldown
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err: any) {
            if (err.code === 'max_resend_exceeded') {
                setError(t.maxResendError);
            } else {
                setError(err.message || t.networkError);
            }
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-zip-in">
            <div className="bg-white rounded-lg max-w-md w-full p-8 relative shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={t.cancel}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">{t.title}</h2>
                    <p className="text-gray-600">
                        {t.subtitle} <span className="font-bold text-secondary-900">+91 {phoneNumber}</span>
                    </p>
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                        {t.enterOTP}
                    </label>
                    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:ring-0 transition-colors"
                                disabled={isVerifying || isSending}
                            />
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-gentle-pulse">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Timer */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600">
                        {t.timeRemaining.replace('{minutes}', minutes.toString()).replace('{seconds}', seconds.toString().padStart(2, '0'))}
                    </p>
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.join('').length !== 6 || timeRemaining <= 0}
                    className="w-full btn-political py-3 rounded-lg mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isVerifying ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t.verifying}</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            <span>{t.verify}</span>
                        </>
                    )}
                </button>

                {/* Resend Button */}
                <div className="text-center">
                    {canResend && resendCount < 5 ? (
                        <button
                            onClick={handleResend}
                            disabled={isSending}
                            className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                        >
                            {isSending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                    <span>{t.sending}</span>
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    <span>{t.resend} ({resendCount}/5)</span>
                                </>
                            )}
                        </button>
                    ) : resendCount >= 5 ? (
                        <p className="text-sm text-red-600">{t.maxResendError}</p>
                    ) : (
                        <p className="text-sm text-gray-500">
                            {t.resendIn.replace('{seconds}', resendCooldown.toString())}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

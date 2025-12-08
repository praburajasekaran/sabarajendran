import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Upload, CheckCircle, AlertCircle, MapPin, Phone, User, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { wpService } from '../services/wpService';
import { Project } from '../types';
import { getVillageName } from '../utils/villageTranslations';

type FormType = 'request' | 'complaint';

interface FormData {
    type: FormType;
    description: string;
    name: string;
    phone: string;
    address: string;
    block: string;
    panchayat: string;
    village: string;
    image: File | null;
}

export const GrievancePage: React.FC = () => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState<FormData>({
        type: 'request',
        description: '',
        name: '',
        phone: '',
        address: '',
        block: '',
        panchayat: '',
        village: '',
        image: null
    });
    const [ipAddress, setIpAddress] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [projects, setProjects] = useState<Project[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Projects for Dropdowns
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await wpService.getAllProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects data:', error);
            }
        };
        fetchProjects();

        // Fetch IP
        const fetchIp = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setIpAddress(data.ip || 'Unknown');
            } catch (error) {
                setIpAddress('Unknown');
            }
        };
        fetchIp();
    }, []);

    // Compute Unique Blocks
    const blocks = useMemo(() => {
        const uniqueBlocks = new Set<string>();
        projects.forEach(p => { if (p.block) uniqueBlocks.add(p.block); });
        return Array.from(uniqueBlocks).sort();
    }, [projects]);

    // Compute Panchayats based on selected Block
    const panchayats = useMemo(() => {
        const uniquePanchayats = new Set<string>();
        projects.forEach(p => {
            if (formData.block && p.block !== formData.block) return;
            if (p.panchayat) uniquePanchayats.add(p.panchayat);
        });
        return Array.from(uniquePanchayats).sort();
    }, [projects, formData.block]);

    // Compute Villages based on selected Panchayat AND Block
    const villages = useMemo(() => {
        const uniqueVillages = new Set<string>();
        projects.forEach(p => {
            if (formData.block && p.block !== formData.block) return;
            if (formData.panchayat && p.panchayat !== formData.panchayat) return;
            if (p.village) uniqueVillages.add(p.village);
        });
        return Array.from(uniqueVillages).sort();
    }, [projects, formData.block, formData.panchayat]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Reset dependent fields if parent changes
        if (name === 'block') {
            setFormData(prev => ({ ...prev, block: value, panchayat: '', village: '' }));
        } else if (name === 'panchayat') {
            setFormData(prev => ({ ...prev, panchayat: value, village: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Form Submitted:', {
                ...formData,
                ipAddress,
                timestamp: new Date().toISOString(),
                language
            });
            setIsSubmitting(false);
            setSubmitStatus('success');
            // Reset form
            setFormData({
                type: 'request',
                description: '',
                name: '',
                phone: '',
                address: '',
                block: '',
                panchayat: '',
                village: '',
                image: null
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
        }, 1500);
    };

    return (
        <>
            <Helmet>
                <title>{t.grievance.title} | {t.nav.title}</title>
                <meta name="description" content={t.grievance.desc} />
            </Helmet>

            <div className="min-h-screen bg-secondary-50 pb-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 sun-rays-texture opacity-30 pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

                    {/* Header */}
                    <div className="text-center mb-10 animate-zip-in">
                        <h1 className="font-display text-4xl md:text-5xl font-black text-secondary-900 uppercase tracking-tight mb-3">
                            <span className="gradient-text">{t.grievance.title}</span>
                        </h1>
                        <p className="text-xl text-secondary-600 max-w-2xl mx-auto font-medium">
                            {t.grievance.subtitle}
                        </p>
                    </div>

                    <div className="bg-white rounded-none card-sharp p-6 md:p-10 shadow-xl border-t-4 border-primary-600 relative">

                        {submitStatus === 'success' ? (
                            <div className="text-center py-16 animate-gentle-pulse">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-green-600 w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-bold text-secondary-900 mb-4">{t.grievance.successTitle}</h2>
                                <p className="text-lg text-secondary-600 mb-8">{t.grievance.successMessage}</p>
                                <button
                                    onClick={() => setSubmitStatus('idle')}
                                    className="btn-political px-8 py-3 text-lg"
                                >
                                    {t.grievance.submitButton} Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Type Selection */}
                                <div>
                                    <label className="block text-lg font-bold text-secondary-900 mb-4 uppercase tracking-wide">
                                        {t.grievance.formType}
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className={`cursor-pointer border-2 p-4 flex items-center gap-3 transition-all ${formData.type === 'request' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="request"
                                                checked={formData.type === 'request'}
                                                onChange={() => setFormData(prev => ({ ...prev, type: 'request' }))}
                                                className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="font-bold text-lg text-secondary-800">{t.grievance.typeRequest}</span>
                                        </label>
                                        <label className={`cursor-pointer border-2 p-4 flex items-center gap-3 transition-all ${formData.type === 'complaint' ? 'border-accent-500 bg-accent-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="complaint"
                                                checked={formData.type === 'complaint'}
                                                onChange={() => setFormData(prev => ({ ...prev, type: 'complaint' }))}
                                                className="w-5 h-5 text-accent-600 focus:ring-accent-500"
                                            />
                                            <span className="font-bold text-lg text-secondary-800">{t.grievance.typeComplaint}</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Location Selectors */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Block Select */}
                                    <div>
                                        <label className="block font-bold text-secondary-700 mb-1">{t.grievance.selectBlock}</label>
                                        <div className="relative">
                                            <select
                                                name="block"
                                                value={formData.block}
                                                onChange={handleInputChange}
                                                className="w-full border-2 border-gray-300 p-3 pr-8 appearance-none focus:border-black focus:ring-0 font-bold uppercase text-sm"
                                            >
                                                <option value="">{t.grievance.selectBlock}</option>
                                                {blocks.map(b => (
                                                    <option key={b} value={b}>{getVillageName(b, language)}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Panchayat Select */}
                                    <div>
                                        <label className={`block font-bold text-secondary-700 mb-1 ${!formData.block ? 'opacity-50' : ''}`}>{t.grievance.selectPanchayat}</label>
                                        <div className="relative">
                                            <select
                                                name="panchayat"
                                                value={formData.panchayat}
                                                onChange={handleInputChange}
                                                disabled={!formData.block}
                                                className="w-full border-2 border-gray-300 p-3 pr-8 appearance-none focus:border-black focus:ring-0 font-bold uppercase text-sm disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">{t.grievance.selectPanchayat}</option>
                                                {panchayats.map(p => (
                                                    <option key={p} value={p}>{getVillageName(p, language)}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Village Select */}
                                    <div>
                                        <label className={`block font-bold text-secondary-700 mb-1 ${!formData.panchayat ? 'opacity-50' : ''}`}>{t.grievance.selectVillage}</label>
                                        <div className="relative">
                                            <select
                                                name="village"
                                                value={formData.village}
                                                onChange={handleInputChange}
                                                disabled={!formData.panchayat}
                                                className="w-full border-2 border-gray-300 p-3 pr-8 appearance-none focus:border-black focus:ring-0 font-bold uppercase text-sm disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">{t.grievance.selectVillage}</option>
                                                {villages.map(v => (
                                                    <option key={v} value={v}>{getVillageName(v, language)}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-lg font-bold text-secondary-900 mb-2 uppercase tracking-wide">
                                        {t.grievance.descriptionLabel} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder={t.grievance.descriptionPlaceholder}
                                        rows={5}
                                        className="w-full border-2 border-gray-300 p-4 text-lg focus:border-black focus:ring-0 transition-colors bg-gray-50 placeholder-gray-400 font-medium"
                                    />
                                </div>

                                {/* Image Upload - CONDITIONAL: Only for Complaints */}
                                {formData.type === 'complaint' && (
                                    <div className="animate-zip-in">
                                        <label className="block text-lg font-bold text-secondary-900 mb-2 uppercase tracking-wide">
                                            {t.grievance.uploadLabel} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed cursor-pointer transition-colors group ${!formData.image && isSubmitting ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {formData.image ? (
                                                        <div className="flex items-center gap-2 text-green-600 font-bold">
                                                            <CheckCircle className="w-8 h-8" />
                                                            <p>{formData.image.name}</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">{t.grievance.uploadButton}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    required={formData.type === 'complaint'}
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Personal Details Section */}
                                <div className="pt-6 border-t-2 border-gray-100">
                                    <h3 className="text-xl font-black text-secondary-900 mb-6 uppercase flex items-center gap-2">
                                        <User className="w-6 h-6" /> {t.grievance.personalDetails}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-bold text-secondary-700 mb-1">{t.grievance.nameLabel} <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder={t.grievance.namePlaceholder}
                                                className="w-full border-2 border-gray-300 p-3 focus:border-black focus:ring-0 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-secondary-700 mb-1">{t.grievance.phoneLabel} <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder={t.grievance.phonePlaceholder}
                                                    className="w-full border-2 border-gray-300 p-3 pl-10 focus:border-black focus:ring-0 font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block font-bold text-secondary-700 mb-1">{t.grievance.addressLabel} <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="address"
                                                    required
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder={t.grievance.addressPlaceholder}
                                                    className="w-full border-2 border-gray-300 p-3 pl-10 focus:border-black focus:ring-0 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submission */}
                                <div className="pt-4 flex flex-col items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto btn-political px-12 py-4 text-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-pulse">{t.grievance.submitting}</span>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" /> {t.grievance.submitButton}
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {t.grievance.ipDisclaimer}
                                    </p>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

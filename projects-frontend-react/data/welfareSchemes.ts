
export interface WelfareScheme {
    id: string;
    titleEn: string;
    titleTa: string;
    beneficiaryCount: string;
    beneficiaryLabelEn: string;
    beneficiaryLabelTa: string;
    budget?: string;
    descriptionEn?: string;
    descriptionTa?: string;
    color?: string; // Optional accent color class
}

export const WELFARE_SCHEMES: WelfareScheme[] = [
    {
        id: 'kmut',
        titleEn: "Kalaignar Magalir Urimai Thogai",
        titleTa: "கலைஞர் மகளிர் உரிமைத் தொகை",
        beneficiaryCount: "28,050",
        beneficiaryLabelEn: "Women Heads of Families",
        beneficiaryLabelTa: "குடும்பத் தலைவிகள்",
        descriptionEn: "Monthly entitlement of ₹1,000 provided to women heads of eligible families.",
        descriptionTa: "தகுதியுள்ள குடும்பத் தலைவிகளுக்கு மாதம் ரூ.1,000 உரிமைத் தொகை.",
        color: "bg-primary-500"
    },
    {
        id: 'shg-loans',
        titleEn: "Women SHG Loans",
        titleTa: "மகளிர் சுயஉதவிக் குழுக்கள் கடன்",
        beneficiaryCount: "1,052",
        beneficiaryLabelEn: "Self-Help Groups",
        beneficiaryLabelTa: "சுயஉதவிக் குழுக்கள்",
        budget: "₹276 Crores",
        descriptionEn: "Massive financial empowerment through loans for Women Self-Help Groups.",
        descriptionTa: "மகளிர் சுயஉதவிக் குழுக்களுக்கு ரூ.276 கோடி மதிப்பிலான கடனுதவிகள்.",
        color: "bg-accent-500"
    },
    {
        id: 'housing-patta',
        titleEn: "Free Housing Site Patta",
        titleTa: "இலவச வீட்டுமனைப் பட்டா",
        beneficiaryCount: "7,780",
        beneficiaryLabelEn: "Families",
        beneficiaryLabelTa: "குடும்பங்கள்",
        budget: "₹133.31 Crores",
        descriptionEn: "Land deeds provided to residents, including those waiting for over 40 years.",
        descriptionTa: "40 ஆண்டுகளாக காத்திருந்தவர்கள் உட்பட 7,780 குடும்பங்களுக்கு இலவச பட்டா.",
        color: "bg-green-500"
    },
    {
        id: 'jewel-loan',
        titleEn: "Cooperative Jewel Loan Waiver",
        titleTa: "கூட்டுறவு நகைக்கடன் தள்ளுபடி",
        beneficiaryCount: "1,006",
        beneficiaryLabelEn: "Beneficiaries",
        beneficiaryLabelTa: "பயனாளிகள்",
        budget: "₹51.75 Crores",
        descriptionEn: "Waiver of jewel loans up to 5 sovereigns for eligible borrowers.",
        descriptionTa: "5 சவரனுக்கு உட்பட்ட நகைக்கடன் தள்ளுபடி செய்யப்பட்ட பயனாளிகள்.",
        color: "bg-yellow-500"
    },
    {
        id: 'crop-insurance',
        titleEn: "Crop Insurance Scheme",
        titleTa: "பயிர் காப்பீட்டுத் திட்டம்",
        beneficiaryCount: "3,192",
        beneficiaryLabelEn: "Farmers",
        beneficiaryLabelTa: "விவசாயிகள்",
        budget: "₹3.00 Crores",
        descriptionEn: "Financial protection for farmers against crop loss due to natural calamities.",
        descriptionTa: "இயற்கை இடர்பாடுகளால் ஏற்படும் இழப்பிலிருந்து விவசாயிகளை காக்கும் திட்டம்.",
        color: "bg-emerald-600"
    },
    {
        id: 'students-welfare',
        titleEn: "Student Welfare Items",
        titleTa: "மாணவர் நலத்திட்டங்கள்",
        beneficiaryCount: "2.73 Lakh+",
        beneficiaryLabelEn: "Students Benefited",
        beneficiaryLabelTa: "மாணவர்கள் பயன்பெற்றுள்ளனர்",
        descriptionEn: "Free bicycles, uniforms, books, and other essentials for school students.",
        descriptionTa: "விலையில்லா மிதிவண்டிகள், சீருடைகள் மற்றும் கல்வி உபகரணங்கள்.",
        color: "bg-indigo-500"
    },
    {
        id: 'disability-welfare',
        titleEn: "Differently Abled Welfare",
        titleTa: "மாற்றுத்திறனாளிகள் நலன்",
        beneficiaryCount: "1,589",
        beneficiaryLabelEn: "Differently Abled Persons",
        beneficiaryLabelTa: "மாற்றுத்திறனாளிகள்",
        budget: "₹9.53 Crores",
        descriptionEn: "Scooters, wheelchairs, and financial assistance schemes.",
        descriptionTa: "ஸ்கூட்டர், சக்கர நாற்காலி மற்றும் உதவித்தொகைகள் வழங்கப்பட்டுள்ளது.",
        color: "bg-rose-500"
    },
    {
        id: 'marriage-assistance',
        titleEn: "Marriage Assistance Schemes",
        titleTa: "திருமண நிதியுதவித் திட்டம்",
        beneficiaryCount: "391",
        beneficiaryLabelEn: "Women Benefited",
        beneficiaryLabelTa: "பெண்கள் பலனடைந்துள்ளனர்",
        descriptionEn: "Financial aid and gold coins for marriage of women from poor families.",
        descriptionTa: "ஏழைப் பெண்களின் திருமணத்திற்கு நிதியுதவி மற்றும் தாலிக்கு தங்கம்.",
        color: "bg-pink-500"
    },
    {
        id: 'mtm-health',
        titleEn: "Makkalai Thedi Maruthuvam",
        titleTa: "மக்களைத் தேடி மருத்துவம்",
        beneficiaryCount: "42,632",
        beneficiaryLabelEn: "Patients Treated",
        beneficiaryLabelTa: "பயனாளிகள்",
        descriptionEn: "Healthcare services delivered directly to the doorstep of patients.",
        descriptionTa: "இல்லம் தேடி வரும் மருத்துவ சேவை.",
        color: "bg-teal-500"
    },
    {
        id: 'crop-loans',
        titleEn: "Cooperative Crop Loans",
        titleTa: "கூட்டுறவு பயிர்க்கடன்",
        beneficiaryCount: "12,964",
        beneficiaryLabelEn: "Farmers",
        beneficiaryLabelTa: "விவசாயிகள்",
        budget: "₹93.36 Crores",
        descriptionEn: "Interest-free crop loans provided to farmers through cooperative societies.",
        descriptionTa: "கூட்டுறவு சங்கங்கள் மூலம் விவசாயிகளுக்கு பயிர்க்கடன்.",
        color: "bg-green-600"
    },
    {
        id: 'pensions',
        titleEn: "Social Security Pensions",
        titleTa: "சமூக பாதுகாப்பு ஓய்வூதியம்",
        beneficiaryCount: "11,517",
        beneficiaryLabelEn: "Pensioners",
        beneficiaryLabelTa: "ஓய்வூதியதாரர்கள்",
        descriptionEn: "Monthly pension of ₹1,200 for senior citizens, widows, and others.",
        descriptionTa: "முதியோர், விதவைகள் மற்றும் மாற்றுத்திறனாளிகளுக்கு மாதம் ரூ.1,200.",
        color: "bg-blue-500"
    },
    {
        id: 'ungaludan-stalin',
        titleEn: "Ungaludan Stalin Camps",
        titleTa: "உங்களுடன் ஸ்டாலின் முகாம்",
        beneficiaryCount: "10,095",
        beneficiaryLabelEn: "Public Grievances Redressed",
        beneficiaryLabelTa: "மனுக்கள் தீர்வு",
        descriptionEn: "Special camps held to resolve public grievances efficiently.",
        descriptionTa: "பொதுமக்களின் கோரிக்கைகளை நிறைவேற்ற சிறப்பு முகாம்கள்.",
        color: "bg-orange-500"
    }
];

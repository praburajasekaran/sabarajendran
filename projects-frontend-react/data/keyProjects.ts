// Key constituency-wide development projects that benefit all citizens
export interface KeyProject {
    id: number;
    titleEn: string;
    titleTa: string;
    descriptionEn: string;
    descriptionTa: string;
    image: string;
    year?: string;
    impact?: string;
}

export const KEY_PROJECTS: KeyProject[] = [
    {
        id: 10,
        titleEn: "Mudalvarin Grama Saalaigal Membattu Thittam",
        titleTa: "முதல்வரின் கிராம சாலைகள் மேம்பாட்டுத் திட்டம்",
        descriptionEn: "Under the Mudalvarin Grama Saalaigal Membattu Thittam (MGSMT) and through the State Highways Department, road infrastructure works have been completed at a total project cost of ₹125 crore.",
        descriptionTa: "முதல்வரின் கிராம சாலைகள் மேம்பாட்டுத் திட்டம் (MGSMT) மற்றும் மாநில நெடுஞ்சாலைத்துறை மூலம், மொத்தம் ரூ.125 கோடி மதிப்பீட்டில் சாலை வசதிகள் உருவாக்கப்பட்டுள்ளன.",
        image: "/assets/images/key-projects/placeholder-10.jpg",
        impact: "₹125 crore"
    },
    {
        id: 1,
        titleEn: "A 40-Year-Long Dream Fulfilled",
        titleTa: "40 ஆண்டுகால கனவு நிறைவேற்றம்",
        descriptionEn: "Fulfilling a 40-year-long aspiration of the people, Patta has been issued to 4,169 families, formally securing their residential rights.",
        descriptionTa: "40 ஆண்டுகளாக பட்டா மற்றும் குடியிருப்பு உரிமைக்காக காத்திருந்த 4,169 குடும்பங்களுக்கு பட்டா வழங்கப்பட்டு, அவர்களின் குடியிருப்பு உரிமை சட்டபூர்வமாக உறுதி செய்யப்பட்டது.",
        image: "/assets/images/key-projects/patta-project.jpg",
        impact: "4,169 families"
    },
    {
        id: 2,
        titleEn: "Secure Housing for the Houseless",
        titleTa: "வீடு இல்லாதவர்களுக்கு உறுதியான குடியிருப்பு",
        descriptionEn: "Addressing the fundamental need of the houseless and economically weaker sections, 840 apartment housing units have been constructed and provided, ensuring safe and stable living conditions.",
        descriptionTa: "வீடு இல்லாத ஏழை எளிய மக்களின் அடிப்படை தேவையை நிறைவேற்றும் வகையில், 840 அடுக்குமாடி குடியிருப்பு வீடுகள் கட்டி வழங்கப்பட்டு, பாதுகாப்பான மற்றும் நிலையான வாழ்விடம் உறுதி செய்யப்பட்டது.",
        image: "/assets/images/key-projects/housing-project.jpg",
        impact: "840 housing units"
    },
    {
        id: 3,
        titleEn: "Court Complex in Neyveli Constituency",
        titleTa: "நெய்வேலி சட்டமன்ற தொகுதியில் நீதிமன்ற வளாகம்",
        descriptionEn: "In the Neyveli Assembly Constituency, an integrated court complex comprising 18 courts is being constructed.",
        descriptionTa: "நெய்வேலி சட்டமன்ற தொகுதியில், 18 நீதிமன்றங்களை கொண்ட ஒருங்கிணைந்த நீதிமன்ற வளாகம் கட்டப்பட்டு வருகிறது.",
        image: "/assets/images/key-projects/court-complex-project.jpg",
        impact: "18 courts"
    },
    {
        id: 4,
        titleEn: "Primary Health Centres in Neyveli Constituency",
        titleTa: "நெய்வேலி சட்டமன்ற தொகுதியில் ஆரம்ப சுகாதார நிலையங்கள்",
        descriptionEn: "In the Neyveli Assembly Constituency, Primary Health Centres have been constructed and made operational at Marungur and Vengadampettai, at an estimated cost of ₹3 crore.",
        descriptionTa: "நெய்வேலி சட்டமன்ற தொகுதிக்குட்பட்ட மருங்கூர் மற்றும் வேங்கடம்பேட்டை பகுதிகளில், ரூ.3 கோடி மதிப்பீட்டில் ஆரம்ப சுகாதார நிலையங்கள் கட்டப்பட்டு பயன்பாட்டிற்கு கொண்டு வரப்பட்டுள்ளன.",
        image: "/assets/images/key-projects/phc-project.jpg",
        impact: "₹3 crore"
    },
    {
        id: 5,
        titleEn: "SIDCO Industrial Estate at Kadampuliyur",
        titleTa: "காடாம்புலியூரில் சிட்கோ தொழிற்பேட்டை",
        descriptionEn: "In the Neyveli Assembly Constituency, a SIDCO Industrial Estate has been established and made operational at Kadampuliyur, spread across 33 acres at a project cost of ₹7.5 crore.",
        descriptionTa: "நெய்வேலி சட்டமன்ற தொகுதிக்குட்பட்ட காடாம்புலியூரில், 33 ஏக்கர் பரப்பளவில் ரூ.7.5 கோடி மதிப்பீட்டில் சிட்கோ தொழிற்பேட்டை அமைக்கப்பட்டு பயன்பாட்டிற்கு கொண்டு வரப்பட்டுள்ளது.",
        image: "/assets/images/key-projects/sidco-project.jpg",
        impact: "33 acres, ₹7.5 crore"
    },
    {
        id: 6,
        titleEn: "Overhead Water Tanks at Multiple Locations",
        titleTa: "பல பகுதிகளில் மேல்நிலை நீர்த்தேக்கங்கள்",
        descriptionEn: "Overhead water tanks have been constructed and made operational at Sorathur, Vadakuthu PTR Nagar, Ashok Nagar and Annagramam.",
        descriptionTa: "சொரத்தூர், வடக்குத்து பி.டி.ஆர் நகர், அசோக் நகர் மற்றும் அன்னகிராமம் பகுதிகளில் மேல்நிலை நீர்த்தேக்கங்கள் அமைக்கப்பட்டு பயன்பாட்டிற்கு கொண்டு வரப்பட்டுள்ளன.",
        image: "/assets/images/key-projects/water-tanks-project.jpg",
        impact: "4 locations"
    },
    {
        id: 7,
        titleEn: "Canal Improvement Works at a Cost of ₹40 Crore",
        titleTa: "ரூ.40 கோடி மதிப்பில் கால்வாய் சீரமைப்பு பணிகள்",
        descriptionEn: "At a project cost of ₹40 crore, canal improvement works have been carried out and check dams have been constructed in Visoor, Keezhiruppu, Meliruppu, Elanthampattu, Eripalayam, Siruvathur, Semmedu, Maligampattu, and Thiruvamoor.",
        descriptionTa: "ரூ.40 கோடி மதிப்பீட்டில், விசூர், கீழிருப்பு, மேலிருப்பு, எலந்தம்பட்டு, ஏரிபாளையம், சிறுவாத்தூர், செம்மேடு, மாளிகம்பட்டு மற்றும் திருவாமூர் பகுதிகளில் கால்வாய் சீரமைப்பு பணிகள் மேற்கொள்ளப்பட்டு, தடுப்பணைகள் அமைக்கப்பட்டுள்ளன.",
        image: "/assets/images/key-projects/canal-improvement-project.jpg",
        impact: "₹40 crore, 9 locations"
    },
    {
        id: 8,
        titleEn: "Check Dams at a Cost of ₹73 Crore",
        titleTa: "ரூ.73 கோடி மதிப்பில் தடுப்பணைகள்",
        descriptionEn: "At a project cost of ₹73 crore, check dams have been constructed in Visoor, Elanthampattu, and Kamatchipettai.",
        descriptionTa: "ரூ.73 கோடி மதிப்பீட்டில், விசூர், எலந்தம்பட்டு மற்றும் காமாட்சிபேட்டை பகுதிகளில் தடுப்பணைகள் அமைக்கப்பட்டுள்ளன.",
        image: "/assets/images/key-projects/check-dams-project.jpg",
        impact: "₹73 crore, 3 locations"
    },
    {
        id: 9,
        titleEn: "Flyovers and Underpasses at a Cost of ₹71 Crore",
        titleTa: "ரூ.71 கோடி மதிப்பில் மேம்பாலம் மற்றும் கீழ்நிலை பாலங்கள்",
        descriptionEn: "At a project cost of ₹71 crore, flyovers and underpasses have been constructed in Semmedu, Kamatchipettai, Thiruvamoor, Meliruppu, Keezhiruppu, Panikkankuppam, and Maligampattu.",
        descriptionTa: "ரூ.71 கோடி மதிப்பீட்டில், செம்மேடு, காமாட்சிபேட்டை, திருவாமூர், மேலிருப்பு, கீழிருப்பு, பணிக்கன்குப்பம் மற்றும் மாளிகம்பட்டு பகுதிகளில் மேம்பாலம் மற்றும் கீழ்நிலை பாலங்கள் அமைக்கப்பட்டுள்ளன.",
        image: "/assets/images/key-projects/placeholder-9.jpg",
        impact: "₹71 crore, 7 locations"
    }
];

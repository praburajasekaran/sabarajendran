// Neyveli Block specific projects - Ward 21 & 30 achievements
// These are additional projects displayed on the Neyveli block page

export interface NeyveliBlockProject {
    id: string;
    titleEn: string;
    titleTa: string;
    descriptionEn: string;
    descriptionTa: string;
    type: 'Infrastructure' | 'Water Supply' | 'Electricity' | 'Community' | 'Education';
    location: string;
    locationTa: string;
    status: 'Completed' | 'Ongoing';
    year: string;
}

export const NEYVELI_BLOCK_PROJECTS: NeyveliBlockProject[] = [
    {
        id: 'neyveli-block-1',
        titleEn: 'Road Repair and Renovation',
        titleTa: 'சாலைகள் சீர்செய்து புனரமைப்பு',
        descriptionEn: 'Repaired and renovated roads that could not be fixed until now.',
        descriptionTa: 'இந்நாள் வரையில் சரிசெய்ய இயலாத சாலைகளை சீர்செய்து புனரமைத்தது.',
        type: 'Infrastructure',
        location: 'Ward 21/30',
        locationTa: 'வட்டம் 21/30',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-2',
        titleEn: 'Drinking Water Pipeline Installation & Repair',
        titleTa: 'குடிநீர் குழாய் மற்றும் இணைப்பு சீர்செய்தல்',
        descriptionEn: 'Installed new pipelines in areas lacking drinking water facilities and repaired existing water connections where there was no water flow, ensuring a full water supply.',
        descriptionTa: 'குடிநீர் வசதிகள் இல்லாத இடங்களில் புதிய குழாய்கள் அமைத்து மற்றும் குடிநீர் இணைப்புகளில் தண்ணீர் வராமல் இருந்தவைகளை சீர் செய்து முழுமையாக தண்ணீர் வரச் செய்தது.',
        type: 'Water Supply',
        location: 'Ward 21/30',
        locationTa: 'வட்டம் 21/30',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-3',
        titleEn: 'Drainage Channel Creation using JCB Machines',
        titleTa: 'மழைக்கால நீர் வடிகால் ஏற்படுத்துதல்',
        descriptionEn: 'During rainy seasons, in areas without proper drainage, drainage channels were immediately created using JCB machines.',
        descriptionTa: 'மழைக்காலங்களில் நீர் வடிகால் இல்லாத இடங்களில் உடனடியாக JCB இயந்திரங்கள் கொண்டு வடிகால் ஏற்படுத்திக் கொடுத்தது.',
        type: 'Infrastructure',
        location: 'Ward 21/30',
        locationTa: 'வட்டம் 21/30',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-4',
        titleEn: 'New Electricity Connection Provision',
        titleTa: 'மின்சார இணைப்பு வழங்கல்',
        descriptionEn: 'Provided new electricity connections in areas where they were unavailable; negotiated with the TA (Technical Assistant/Authority) to restore connections that had been suspended.',
        descriptionTa: 'மின்சார இணைப்பு இல்லாத இடங்களில் புதிய இணைப்பு ஏற்படுத்தி தந்து; இணைப்பு நிறுத்திவைத்தவைகளை TA விடம் பேசி வழங்க செய்தது.',
        type: 'Electricity',
        location: 'Ward 21/30',
        locationTa: 'வட்டம் 21/30',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-5',
        titleEn: 'New Connecting Bridge at Ward-21',
        titleTa: 'வட்டம்-21 இணைப்பு பாலம்',
        descriptionEn: 'Constructed a new connecting bridge for exiting from the Ward-21 area.',
        descriptionTa: 'வட்டம் - 21 பகுதியிலிருந்து வெளியே செல்வதற்கு புதியதாக இணைப்பு பாலம் கட்டியது.',
        type: 'Infrastructure',
        location: 'Ward 21',
        locationTa: 'வட்டம் 21',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-6',
        titleEn: 'New Bridge at Arundthathiyar Colony, Ward-30',
        titleTa: 'வட்டம்-30 அருந்ததியர் காலனி பாலம்',
        descriptionEn: 'In the Arundthathiyar Colony area of Ward-30, a new bridge has been constructed across the canal to facilitate public transport in areas that were previously impassable due to flooding.',
        descriptionTa: 'வட்டம் - 30-ல் அருந்ததியர் காலனி பகுதியில் மக்கள் போக்குவரத்துக்காக கால்வாய்களை கடக்க இயலாமல் வாய்க்கால் பகுதியில் நீர் நிறைந்த பகுதியில் புதிய பாலம் அமைத்துக் கொடுக்கப்பட்டுள்ளது.',
        type: 'Infrastructure',
        location: 'Ward 30 - Arundthathiyar Colony',
        locationTa: 'வட்டம் 30 - அருந்ததியர் காலனி',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-7',
        titleEn: 'Infrastructure Development Petition (Electricity, Streetlights, Water)',
        titleTa: 'புதிய உட்கட்டமைப்பு கோரிக்கை',
        descriptionEn: 'Submitted petitions to the Civil Director and the TA requesting new electricity connections, streetlights, and a sufficient number of drinking water taps in those areas. During the negotiations, they have given assurance that these works will be completed.',
        descriptionTa: 'அந்த பகுதிகளில் புதிய மின்சார இணைப்புகள், தெரு விளக்குகள், போதுமான அளவில் குடிநீர் குழாய்கள் அமைத்திட சிவில் இயக்குனர் மற்றும் TA விடம் கோரிக்கை மனு அளித்து பேச்சுவார்த்தையில் அவர்கள் செய்துதர உறுதியளித்துள்ளனர்.',
        type: 'Community',
        location: 'Ward 21/30',
        locationTa: 'வட்டம் 21/30',
        status: 'Ongoing',
        year: '2024'
    },
    {
        id: 'neyveli-block-8',
        titleEn: 'Accident Compensation Increase (₹15L → ₹30L)',
        titleTa: 'விபத்து இழப்பீட்டு தொகை உயர்த்துதல்',
        descriptionEn: 'Negotiated with the management to increase the compensation amount provided during deaths or injuries resulting from accidents in the company\'s industrial areas. Specifically, during a major accident at Thermal Power Station-II, the compensation was increased to ₹30 lakhs from the ₹15 lakhs initially proposed by the management. This has now become the standard practice.',
        descriptionTa: 'நிறுவனத்தின் தொழில் பகுதிகளில் அவ்வப்போது ஏற்படும் விபத்துகளில் இறப்பு மற்றும் பாதிப்பு ஏற்படும் போது நிர்வாகத்திடம் பேசி இழப்பீடு தொகையினை உயர்த்தி வழங்கிட செய்துள்ளது. குறிப்பாக அனல்மின் நிலையம் இரண்டில் ஏற்பட்ட பெரிய அளவிலான விபத்தில் இழப்பீடு 15 லட்சம் என நிர்வாகம் கூறியதை 30 லட்சமாக உயர்த்தி வழங்கிட செய்தது. அது தற்போது நடைமுறையாகத் தொடர்கிறது.',
        type: 'Community',
        location: 'NLCIL',
        locationTa: 'NLCIL',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-9',
        titleEn: 'NLCIL Trade Union Election Victory (40% Votes)',
        titleTa: 'NLCIL தொழிற்சங்க வாக்கெடுப்பு வெற்றி',
        descriptionEn: 'Took responsibility for conducting the secret ballot election for trade union recognition at NLCIL; secured approximately 40% of the total workers\' votes, leading the union to victory as the primary union.',
        descriptionTa: 'NLCIL நிறுவனத்தில் தொழிற் சங்கங்களுக்கிடையே நடைபெற்ற அங்கீகாரத்திற்கான இரகசிய வாக்கெடுப்பு தேர்தலில் அதனை பொறுப்பேற்று நடத்தி மொத்த தொழிலாளர்களில் ஏறக்குறைய 40% வாக்குகள் பெற்று முதன்மையான சங்கமாக வெற்றியடையச் செய்தது.',
        type: 'Community',
        location: 'NLCIL',
        locationTa: 'NLCIL',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-10',
        titleEn: 'Society Workers Permanent Appointment',
        titleTa: 'சொசைட்டி தொழிலாளர்கள் நிரந்தர பணியாணை',
        descriptionEn: 'Regarding the demand for permanent appointment orders for "Society Workers," negotiations were held with the District Collector through the Minister. The list was released immediately, and the work of making employees permanent has been completed. Furthermore, action has been taken by speaking with the President and the Director (Human Resources) to release the next list immediately. The list will be released soon.',
        descriptionTa: 'தற்போது சொசைட்டி தொழிலாளர்களுக்கு நிரந்தர பணியாணை வழங்கிட வேண்டுமென அமைச்சரின் மூலமாக மாவட்ட கலெக்டரிடம் பேசி உடனடியாக list வெளியிட்டு தற்போது நிரந்தரப்படுத்தும் பணி முடிவடைந்துள்ளது. மேலும் உடனடியாக அடுத்த list வெளியிட வேண்டுமென அதிபர் மற்றும் இயக்குனர் மணிவளத்திடம் பேசி நடவடிக்கை எடுக்கப்பட்டுள்ளது. விரைவில் list வெளியிடப்படும்.',
        type: 'Community',
        location: 'NLCIL',
        locationTa: 'NLCIL',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-11',
        titleEn: 'Government I.T.I. Establishment at Ward-21',
        titleTa: 'வட்டம்-21 அரசு I.T.I. நிறுவுதல்',
        descriptionEn: 'A government I.T.I. (Industrial Training Institute) has been established in the Ward-21 area in collaboration with NLCIL in the Neyveli region.',
        descriptionTa: 'நெய்வேலி பகுதியின் NLCIL நிறுவனத்துடன் இணைந்து அரசு சார்பில் ஒரு I.T.I வட்டம் - 21 பகுதியில் உருவாக்கப்பட்டுள்ளது.',
        type: 'Education',
        location: 'Ward 21',
        locationTa: 'வட்டம் 21',
        status: 'Completed',
        year: '2021-2024'
    },
    {
        id: 'neyveli-block-12',
        titleEn: 'Flood Relief Welfare Schemes',
        titleTa: 'வெள்ள நிவாரண நலத்திட்டங்கள்',
        descriptionEn: 'Visited the areas of Ward-21 and 30 directly during times of flooding and heavy rains to provide sufficient welfare schemes and assistance to the affected people.',
        descriptionTa: 'அவ்வப்போது வட்டம் - 21, 30 பகுதிகளில் வெள்ள மழை காலங்களில் பாதிப்பு ஏற்படும் போது நேரடியாக சென்று அவர்களுக்கு போதுமான அளவிலான நலத்திட்டங்கள் வழங்கியது.',
        type: 'Community',
        location: 'Ward 21/30',
        locationTa: 'வட்டம் 21/30',
        status: 'Completed',
        year: '2021-2024'
    }
];

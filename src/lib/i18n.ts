import { LanguageCode } from "@/types";

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  fairnessMeterTitle: string;
  fairnessMeterSubtitle: string;
  workerKeeps: string;
  welfareCut: string;
  platformCut: string;
  corporateComparison: string;
  corporateComparisonSub: string;
  roles: {
    customer: string;
    worker: string;
    admin: string;
  };
  nav: {
    services: string;
    bookings: string;
    artisans: string;
    admin: string;
    join: string;
    signIn: string;
    signOut: string;
    switchRole: string;
    bookNow: string;
    workerPortal: string;
    adminPortal: string;
    myBookings: string;
    demoRole: string;
  };
  home: {
    sihBadge: string;
    heroTitle1: string;
    heroTitleAccent: string;
    heroTitle2: string;
    heroSubtitle: string;
    bookWorker: string;
    exploreAdmin: string;
    ecosystemBadge: string;
    ecosystemTitle: string;
    ecosystemSubtitle: string;
    workerCardTitle: string;
    workerCardDesc: string;
    workerCardFeature1: string;
    workerCardFeature2: string;
    workerCardFeature3: string;
    workerCardLink: string;
    customerCardTitle: string;
    customerCardDesc: string;
    customerCardFeature1: string;
    customerCardFeature2: string;
    customerCardFeature3: string;
    customerCardLink: string;
    adminCardTitle: string;
    adminCardDesc: string;
    adminCardFeature1: string;
    adminCardFeature2: string;
    adminCardFeature3: string;
    adminCardLink: string;
    ctaBadge: string;
    ctaTitle: string;
    ctaSubtitle: string;
    joinArtisan: string;
  };
  customer: {
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    chooseTrade: string;
    nearestWorker: string;
    verifiedCoopWorker: string;
    emergencyBadge: string;
    emergencySubtitle: string;
    bookWorker: string;
    instantPay: string;
    invoiceTitle: string;
    qrVerifyPrompt: string;
    rateWorkerTitle: string;
  };
  worker: {
    portalTitle: string;
    activeJobs: string;
    earningsToday: string;
    welfareFundBalance: string;
    insuranceStatus: string;
    digitalIdCard: string;
    scanQrToVerify: string;
    nsdcCertified: string;
    acceptJob: string;
    completeJob: string;
    availableToggle: string;
  };
  admin: {
    adminTitle: string;
    adminSubtitle: string;
    aiForecastTitle: string;
    aiForecastSubtitle: string;
    oneClickRebalance: string;
    activeSocieties: string;
    verifiedWorkersTotal: string;
    welfareFundTotal: string;
    reviewWorkerApplications: string;
    approve: string;
    reject: string;
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: "KaryaSetu",
    tagline: "India's First Worker-Owned Cooperative Gig Platform",
    fairnessMeterTitle: "The Cooperative Fairness Meter",
    fairnessMeterSubtitle: "Every rupee transparently accounted for. No hidden corporate profit extraction.",
    workerKeeps: "Worker Payout (90%)",
    welfareCut: "Member Welfare & Insurance (7%)",
    platformCut: "Federation & Tech Ops (3%)",
    corporateComparison: "vs. Private Apps (Worker gets only 70-75%, 0% to welfare)",
    corporateComparisonSub: "Private gig companies extract up to 30% commission without healthcare or social security.",
    roles: {
      customer: "Customer",
      worker: "Co-op Worker",
      admin: "Co-op Admin",
    },
    nav: {
      services: "Services",
      bookings: "Bookings",
      artisans: "Workers",
      admin: "Admin",
      join: "Join",
      signIn: "Sign In",
      signOut: "Sign Out",
      switchRole: "Switch Role:",
      bookNow: "Book Service",
      workerPortal: "Worker Hub",
      adminPortal: "Co-op Admin",
      myBookings: "My Bookings",
      demoRole: "Demo Persona",
    },
    home: {
      sihBadge: "Ministry of Cooperation · SIH26089",
      heroTitle1: "The Gig Platform Owned By ",
      heroTitleAccent: "The Workers",
      heroTitle2: ", Not A Corporation.",
      heroSubtitle: "Directly connecting verified workers from India's Labour Cooperative Societies with households. Guaranteed 90% take-home pay, free medical cover, and AI workforce rebalancing.",
      bookWorker: "Book a Verified Worker",
      exploreAdmin: "Explore AI Radar & Admin",
      ecosystemBadge: "Cooperative Ecosystem",
      ecosystemTitle: "Built For 3 Essential Stakeholders",
      ecosystemSubtitle: "A transparent 3-sided model designed for grassroots trust and collective economic mobility.",
      workerCardTitle: "1. The Skilled Worker",
      workerCardDesc: "Free Aadhaar e-KYC signup, keeps 90% payout, accumulates an automatic health fund, and presents a 3D digital QR card.",
      workerCardFeature1: "Transparent 90% direct payout",
      workerCardFeature2: "3D Digital QR ID card",
      workerCardFeature3: "Free PMSBY medical insurance",
      workerCardLink: "Explore Worker Portal",
      customerCardTitle: "2. The Resident / Customer",
      customerCardDesc: "Discovers nearest verified workers in kilometers, pays predictable base fee with zero surge pricing, and confirms Start-Work OTP.",
      customerCardFeature1: "Geo-matched in km proximity",
      customerCardFeature2: "Start-Work Security Handshake OTP",
      customerCardFeature3: "Zero surge pricing exploitation",
      customerCardLink: "Book a Service",
      adminCardTitle: "3. The Cooperative Admin",
      adminCardDesc: "Single unified control room: 1-click worker verification, active roster table, wage floor locks, and the AI Workforce Allocation Copilot.",
      adminCardFeature1: "AI Demand Forecasting Radar",
      adminCardFeature2: "1-Click Worker Rebalance",
      adminCardFeature3: "Statutory minimum wage floor",
      adminCardLink: "Cooperative Admin Hub",
      ctaBadge: "Grassroots Empowerment · SIH26089",
      ctaTitle: "Ready to Experience India's First Fair Labour Co-op Marketplace?",
      ctaSubtitle: "Whether you are a resident needing a certified electrician or a worker seeking 90% direct payouts with free medical cover, KaryaSetu is built for you.",
      joinArtisan: "Join as Worker (Free e-KYC)",
    },
    customer: {
      heroTitle: "Book Verified Cooperative Skilled Workers",
      heroSubtitle: "Directly support master electricians, plumbers, and caregivers who own the platform. Guaranteed fair wages, certified skills, zero corporate exploitation.",
      searchPlaceholder: "Search by locality or service (e.g. Electrician in GK-1)...",
      chooseTrade: "Choose Skilled Service",
      nearestWorker: "Nearest Available Cooperative Workers",
      verifiedCoopWorker: "Verified Co-op Member",
      emergencyBadge: "Emergency / Immediate Dispatch",
      emergencySubtitle: "Expedite nearest worker on top priority",
      bookWorker: "Book & Lock Slot",
      instantPay: "Simulated UPI Sandbox Payment",
      invoiceTitle: "Cooperative Service Invoice",
      qrVerifyPrompt: "Scan worker's Digital QR Card upon arrival to verify credential",
      rateWorkerTitle: "Rate & Support Your Cooperative Worker",
    },
    worker: {
      portalTitle: "Cooperative Worker Member Dashboard",
      activeJobs: "Active Jobs",
      earningsToday: "Earnings YTD",
      welfareFundBalance: "Co-op Welfare & Health Fund",
      insuranceStatus: "Active Insurance Cover",
      digitalIdCard: "Official Digital Co-op ID",
      scanQrToVerify: "Customers scan this QR code on arrival to confirm identity and skill credentials.",
      nsdcCertified: "NSDC / RPL Certified",
      acceptJob: "Accept Booking",
      completeJob: "Mark Completed",
      availableToggle: "On-Duty Availability",
    },
    admin: {
      adminTitle: "Cooperative Operations & Governance Control",
      adminSubtitle: "Unified management of worker verification, worker roster, AI demand forecasting, and wage policies.",
      aiForecastTitle: "AI Demand Forecasting & Workforce Allocation Copilot",
      aiForecastSubtitle: "Predicts demand spikes using weather, seasonal triggers, and urban booking patterns.",
      oneClickRebalance: "Execute 1-Click Worker Rebalance",
      activeSocieties: "Affiliated Societies",
      verifiedWorkersTotal: "Verified Worker Members",
      welfareFundTotal: "Aggregate Welfare Capital",
      reviewWorkerApplications: "Worker Verification Queue",
      approve: "Verify & Issue ID",
      reject: "Reject Application",
    },
  },
  hi: {
    appName: "कार्यसेतु (KaryaSetu)",
    tagline: "भारत का पहला श्रमिक-स्वामित्व वाला सहकारी गिग मंच",
    fairnessMeterTitle: "सहकारी निष्पक्षता मीटर (Fairness Meter)",
    fairnessMeterSubtitle: "हर रुपये का पारदर्शी हिसाब। कोई छुपा हुआ कॉर्पोरेट मुनाफा नहीं।",
    workerKeeps: "श्रमिक भुगतान (90%)",
    welfareCut: "कल्याण एवं बीमा कोष (7%)",
    platformCut: "सहकारी तकनीकी संचालन (3%)",
    corporateComparison: "निजी ऐप्स की तुलना में (श्रमिक को केवल 70-75%, कल्याण शून्य)",
    corporateComparisonSub: "निजी कंपनियां बिना किसी स्वास्थ्य या सामाजिक सुरक्षा के 30% तक कमीशन काटती हैं।",
    roles: {
      customer: "नागरिक ग्राहक",
      worker: "सहकारी श्रमिक",
      admin: "सहकारी एडमिन",
    },
    nav: {
      services: "सेवाएं",
      bookings: "बुकिंग",
      artisans: "श्रमिक",
      admin: "एडमिन",
      join: "जुड़ें",
      signIn: "लॉग इन",
      signOut: "लॉग आउट",
      switchRole: "भूमिका बदलें:",
      bookNow: "सेवा बुक करें",
      workerPortal: "श्रमिक पोर्टल",
      adminPortal: "सहकारी एडमिन",
      myBookings: "मेरी बुकिंग",
      demoRole: "डेमो प्रोफाइल",
    },
    home: {
      sihBadge: "सहकारिता मंत्रालय · SIH26089",
      heroTitle1: "गिग मंच जिसका स्वामित्व ",
      heroTitleAccent: "श्रमिकों के पास है",
      heroTitle2: ", कॉर्पोरेट के पास नहीं।",
      heroSubtitle: "भारत की श्रम सहकारी समितियों के प्रमाणित श्रमिकों को सीधे घरों से जोड़ना। 90% सीधी मजदूरी, मुफ्त स्वास्थ्य कवर, और एआई कार्यबल पुनर्संतुलन की गारंटी।",
      bookWorker: "सत्यापित कार्यकर्ता बुक करें",
      exploreAdmin: "एआई रडार एवं एडमिन देखें",
      ecosystemBadge: "सहकारी पारिस्थितिकी तंत्र",
      ecosystemTitle: "3 प्रमुख हितधारकों के लिए निर्मित",
      ecosystemSubtitle: "जमीनी स्तर पर विश्वास और सामूहिक आर्थिक उन्नति के लिए डिज़ाइन किया गया पारदर्शी मॉडल।",
      workerCardTitle: "1. कुशल सहकारी श्रमिक",
      workerCardDesc: "मुफ्त आधार ई-केवाईसी, 90% सीधी मजदूरी, स्वचालित स्वास्थ्य निधि संचय, और 3D डिजिटल क्यूआर पहचान पत्र।",
      workerCardFeature1: "पारदर्शी 90% प्रत्यक्ष भुगतान",
      workerCardFeature2: "3D डिजिटल क्यूआर आईडी कार्ड",
      workerCardFeature3: "मुफ्त PMSBY चिकित्सा बीमा",
      workerCardLink: "श्रमिक पोर्टल देखें",
      customerCardTitle: "2. निवासी / ग्राहक",
      customerCardDesc: "दूरी के आधार पर निकटतम कुशल श्रमिकों की खोज, बिना किसी सर्ज मूल्य निर्धारण के निश्चित दरें, और कार्य प्रारंभ ओटीपी।",
      customerCardFeature1: "किमी निकटता के आधार पर मिलान",
      customerCardFeature2: "कार्य प्रारंभ सुरक्षा ओटीपी",
      customerCardFeature3: "शून्य सर्ज मूल्य निर्धारण शोषण",
      customerCardLink: "सेवा बुक करें",
      adminCardTitle: "3. सहकारी एडमिन / प्रबंधक",
      adminCardDesc: "एकीकृत नियंत्रण कक्ष: 1-क्लिक कार्यकर्ता सत्यापन, सक्रिय रोस्टर, वैधानिक न्यूनतम मजदूरी लॉक, और एआई कार्यबल आवंटन।",
      adminCardFeature1: "एआई मांग पूर्वानुमान रडार",
      adminCardFeature2: "1-क्लिक कार्यकर्ता पुनर्संतुलन",
      adminCardFeature3: "वैधानिक न्यूनतम मजदूरी सुरक्षा",
      adminCardLink: "सहकारी एडमिन हब",
      ctaBadge: "जमीनी सशक्तिकरण · SIH26089",
      ctaTitle: "भारत के पहले निष्पक्ष श्रम सहकारी बाज़ार का अनुभव करने के लिए तैयार हैं?",
      ctaSubtitle: "चाहे आप एक निवासी हों जिसे प्रमाणित इलेक्ट्रीशियन की आवश्यकता हो, या एक श्रमिक जो 90% सीधी मजदूरी चाहता हो, सहकार कर्मकार आपके लिए है।",
      joinArtisan: "श्रमिक के रूप में जुड़ें (निःशुल्क ई-केवाईसी)",
    },
    customer: {
      heroTitle: "सत्यापित सहकारी कुशल श्रमिकों को बुक करें",
      heroSubtitle: "सीधे उन इलेक्ट्रीशियन, प्लंबर और देखभालकर्ताओं का समर्थन करें जो इस मंच के मालिक हैं। उचित मजदूरी, प्रमाणित कौशल, शून्य शोषण।",
      searchPlaceholder: "इलाके या सेवा से खोजें (जैसे GK-1 में इलेक्ट्रीशियन)...",
      chooseTrade: "कुशल सेवा चुनें",
      nearestWorker: "निकटतम उपलब्ध सहकारी श्रमिक",
      verifiedCoopWorker: "सत्यापित सहकारी सदस्य",
      emergencyBadge: "आपातकालीन / त्वरित सेवा",
      emergencySubtitle: "प्राथमिकता पर निकटतम श्रमिक को तुरंत भेजें",
      bookWorker: "बुक करें एवं स्लॉट सुरक्षित करें",
      instantPay: "UPI सैंडबॉक्स भुगतान",
      invoiceTitle: "सहकारी सेवा रसीद / चालान",
      qrVerifyPrompt: "सत्यापन के लिए आगमन पर कार्यकर्ता के डिजिटल क्यूआर कोड को स्कैन करें",
      rateWorkerTitle: "अपने सहकारी कार्यकर्ता को रेटिंग दें",
    },
    worker: {
      portalTitle: "सहकारी श्रमिक सदस्य डैशबोर्ड",
      activeJobs: "सक्रिय कार्य",
      earningsToday: "वार्षिक कुल आय",
      welfareFundBalance: "सहकारी कल्याण एवं स्वास्थ्य कोष",
      insuranceStatus: "सक्रिय बीमा कवर",
      digitalIdCard: "आधिकारिक डिजिटल सहकारी पहचान पत्र",
      scanQrToVerify: "ग्राहक पहचान और कौशल स्तर की पुष्टि के लिए इस क्यूआर कोड को स्कैन करते हैं।",
      nsdcCertified: "NSDC / RPL प्रमाणित",
      acceptJob: "कार्य स्वीकार करें",
      completeJob: "कार्य पूर्ण चिह्नित करें",
      availableToggle: "कार्य उपलब्धता स्थिति",
    },
    admin: {
      adminTitle: "सहकारी संचालन एवं शासन नियंत्रण",
      adminSubtitle: "श्रमिक सत्यापन, सक्रिय रोस्टर, एआई मांग पूर्वानुमान एवं मजदूरी नीतियों का एकीकृत प्रबंधन।",
      aiForecastTitle: "एआई मांग पूर्वानुमान एवं कार्यबल आवंटन कोपायलट",
      aiForecastSubtitle: "मौसम और मौसमी मांग पैटर्न पर प्रशिक्षित मशीन लर्निंग मॉडल।",
      oneClickRebalance: "1-क्लिक कार्यबल पुनर्संतुलन लागू करें",
      activeSocieties: "संबद्ध समितियां",
      verifiedWorkersTotal: "सत्यापित श्रमिक सदस्य",
      welfareFundTotal: "कुल संचित कल्याण निधि",
      reviewWorkerApplications: "श्रमिक सत्यापन कतार",
      approve: "सत्यापित करें व आईडी जारी करें",
      reject: "अस्वीकार करें",
    },
  },
  ta: {
    appName: "காரியசேது (KaryaSetu)",
    tagline: "இந்தியாவின் முதல் தொழிலாளர் கூட்டுறவு கிக் தளம்",
    fairnessMeterTitle: "கூட்டுறவு நியாய அளவீடு (Fairness Meter)",
    fairnessMeterSubtitle: "ஒவ்வொரு ரூபாய்க்கும் வெளிப்படையான கணக்கு. கார்ப்பரேட் சுரண்டல் இல்லை.",
    workerKeeps: "தொழிலாளர் ஊதியம் (90%)",
    welfareCut: "தொழிலாளர் நலன் மற்றும் காப்பீடு (7%)",
    platformCut: "கூட்டுறவு தளம் மற்றும் தொழில்நுட்பம் (3%)",
    corporateComparison: "தனியார் பயன்பாடுகளுடன் ஒப்பிடுக (தொழிலாளிக்கு 70-75% மட்டுமே)",
    corporateComparisonSub: "தனியார் நிறுவனங்கள் காப்பீடு அல்லது பாதுகாப்பு இல்லாமல் 30% வரை கமிஷன் கழிக்கின்றன.",
    roles: {
      customer: "வாடிக்கையாளர்",
      worker: "கூட்டுறவு தொழிலாளி",
      admin: "கூட்டுறவு நிர்வாகி",
    },
    nav: {
      services: "சேவைகள்",
      bookings: "பதிவுகள்",
      artisans: "தொழிலாளர்கள்",
      admin: "நிர்வாகம்",
      join: "இணைய",
      signIn: "உள்நுழைக",
      signOut: "வெளியேறு",
      switchRole: "பயனர் மாற்றம்:",
      bookNow: "சேவை பதிவு",
      workerPortal: "தொழிலாளர் பக்கம்",
      adminPortal: "கூட்டுறவு நிர்வாகம்",
      myBookings: "எனது பதிவுகள்",
      demoRole: "டெமோ பயனர்",
    },
    home: {
      sihBadge: "கூட்டுறவு அமைச்சகம் · SIH26089",
      heroTitle1: "தொழிலாளர்களுக்கு சொந்தமான ",
      heroTitleAccent: "கிக் சேவை தளம்",
      heroTitle2: ", கார்ப்பரேட் அல்ல.",
      heroSubtitle: "இந்தியாவின் தொழிலாளர் கூட்டுறவு சங்கங்களிலிருந்து சான்றளிக்கப்பட்ட தொழிலாளர்களை வீடுகளுடன் நேரடியாக இணைக்கிறது. 90% நேரடி ஊதியம், இலவச மருத்துவ காப்பீடு மற்றும் AI தொழிலாளர் மறுபகிர்வு.",
      bookWorker: "தொழிலாளரை பதிவு செய்",
      exploreAdmin: "AI ரேடார் மற்றும் நிர்வாகம்",
      ecosystemBadge: "கூட்டுறவு கட்டமைப்பு",
      ecosystemTitle: "3 முக்கிய பங்குதாரர்களுக்காக உருவாக்கப்பட்டது",
      ecosystemSubtitle: "அடித்தள நம்பிக்கை மற்றும் கூட்டுப் பொருளாதார வளர்ச்சிக்காக வடிவமைக்கப்பட்ட வெளிப்படையான மாதிரி.",
      workerCardTitle: "1. திறமையான கூட்டுறவு தொழிலாளி",
      workerCardDesc: "இலவச ஆதார் இ-கேஒய்சி, 90% நேரடி ஊதியம், தானியங்கி மருத்துவ நல நிதி மற்றும் 3D டிஜிட்டல் QR அட்டை.",
      workerCardFeature1: "வெளிப்படையான 90% நேரடி ஊதியம்",
      workerCardFeature2: "3D டிஜிட்டல் QR அடையாள அட்டை",
      workerCardFeature3: "இலவச PMSBY மருத்துவ காப்பீடு",
      workerCardLink: "தொழிலாளர் கட்டுப்பாட்டு அறை",
      customerCardTitle: "2. குடியிருப்புவாசி / வாடிக்கையாளர்",
      customerCardDesc: "அருகிலுள்ள தொழிலாளர்களைக் கண்டறிந்து, கூடுதல் கட்டணமில்லா நியாயமான கட்டணத்தைச் செலுத்தி, பாதுகாப்பு OTP மூலம் தொடங்குங்கள்.",
      customerCardFeature1: "கிமீ தொலைவில் அருகாமை பொருத்தம்",
      customerCardFeature2: "வேலை தொடக்க பாதுகாப்பு OTP",
      customerCardFeature3: "சுரண்டல் கட்டணங்கள் முற்றிலும் இல்லை",
      customerCardLink: "சேவை பதிவு செய்",
      adminCardTitle: "3. கூட்டுறவு நிர்வாகி",
      adminCardDesc: "ஒருங்கிணைந்த கட்டுப்பாட்டு அறை: 1-கிளிக் சரிபார்ப்பு, செயலில் உள்ள தொழிலாளர் பட்டியல் மற்றும் AI தேவை முன்கணிப்பு.",
      adminCardFeature1: "AI தேவை முன்கணிப்பு ரேடார்",
      adminCardFeature2: "1-கிளிக் தொழிலாளர் மறுபகிர்வு",
      adminCardFeature3: "சட்டப்பூர்வ குறைந்தபட்ச ஊதிய பாதுகாப்பு",
      adminCardLink: "நிர்வாக கட்டுப்பாட்டு மையம்",
      ctaBadge: "அடித்தள அதிகாரமளித்தல் · SIH26089",
      ctaTitle: "இந்தியாவின் முதல் நியாயமான தொழிலாளர் கூட்டுறவு தளத்தை அனுபவிக்கத் தயாரா?",
      ctaSubtitle: "உங்களுக்கு சான்றளிக்கப்பட்ட எலக்ட்ரீஷியன் தேவைப்படும் வாடிக்கையாளராக இருந்தாலும் சரி, 90% நேரடி ஊதியம் விரும்பும் தொழிலாளியாக இருந்தாலும் சரி, சககார் கர்மகார் உங்களுக்கானது.",
      joinArtisan: "தொழிலாளராக இணையுங்கள் (இலவச e-KYC)",
    },
    customer: {
      heroTitle: "சான்றளிக்கப்பட்ட கூட்டுறவு தொழிலாளர்களை பதிவு செய்யுங்கள்",
      heroSubtitle: "மின் பணியாளர்கள், பிளம்பர்கள் மற்றும் பராமரிப்பாளர்களை நேரடியாக ஆதரிக்கவும். நியாயமான ஊதியம், உத்தரவாத சேவை.",
      searchPlaceholder: "சேவை அல்லது இடத்தை தேடுங்கள்...",
      chooseTrade: "சேவையை தேர்ந்தெடுக்கவும்",
      nearestWorker: "அருகில் உள்ள கூட்டுறவு தொழிலாளர்கள்",
      verifiedCoopWorker: "சான்றளிக்கப்பட்ட கூட்டுறவு உறுப்பினர்",
      emergencyBadge: "அவசர சேவை / உடனடி அனுப்புகை",
      emergencySubtitle: "முன்னுரிமையில் தொழிலாளரை அழைக்கவும்",
      bookWorker: "இப்போதே பதிவு செய்",
      instantPay: "UPI சோதனை கட்டணம்",
      invoiceTitle: "கூட்டுறவு சேவை ரசீது",
      qrVerifyPrompt: "தொழிலாளியின் QR குறியீட்டை ஸ்கேன் செய்து உறுதிப்படுத்தவும்",
      rateWorkerTitle: "தொழிலாளிக்கு மதிப்பீடு வழங்கவும்",
    },
    worker: {
      portalTitle: "கூட்டுறவு தொழிலாளர் கட்டுப்பாட்டு அறை",
      activeJobs: "தற்போதைய பணிகள்",
      earningsToday: "மொத்த வருமானம்",
      welfareFundBalance: "கூட்டுறவு நல நிதி இருப்பு",
      insuranceStatus: "செயலில் உள்ள காப்பீடு",
      digitalIdCard: "டிஜிட்டல் அடையாள அட்டை",
      scanQrToVerify: "அடையாளத்தை உறுதிப்படுத்த வாடிக்கையாளர்கள் இந்த QR குறியீட்டை ஸ்கேன் செய்வார்கள்.",
      nsdcCertified: "NSDC / RPL திறன் சான்றிதழ்",
      acceptJob: "பணியை ஏற்றுக்கொள்",
      completeJob: "பணி முடிந்தது",
      availableToggle: "பணி கிடைக்கும் நிலை",
    },
    admin: {
      adminTitle: "கூட்டுறவு செயல்பாடுகள் மற்றும் நிர்வாகம்",
      adminSubtitle: "தொழிலாளர் சரிபார்ப்பு, AI தேவை முன்கணிப்பு மற்றும் ஊதியக் கொள்கைகளின் ஒருங்கிணைந்த கட்டுப்பாடு.",
      aiForecastTitle: "AI தேவை முன்கணிப்பு & தொழிலாளர் ஒதுக்கீடு",
      aiForecastSubtitle: "பருவகால தேவை வடிவங்களின் அடிப்படையில் இயந்திர கற்றல் கணிப்புகள்.",
      oneClickRebalance: "1-கிளிக் தொழிலாளர் மறுபகிர்வு",
      activeSocieties: "இணைந்த சங்கங்கள்",
      verifiedWorkersTotal: "சான்றளிக்கப்பட்ட தொழிலாளர்கள்",
      welfareFundTotal: "திரட்டப்பட்ட நல நிதி",
      reviewWorkerApplications: "தொழிலாளர் சரிபார்ப்பு பட்டியல்",
      approve: "சான்றிதழ் வழங்கி அனுமதி",
      reject: "நிராகரி",
    },
  },
  te: {
    appName: "కార్యసేతు (KaryaSetu)",
    tagline: "భారతదేశ మొట్టమొదటి కార్మిక సహకార గిగ్ మార్కెట్‌ప్లేస్",
    fairnessMeterTitle: "సహకార పారదర్శకత కొలమానం (Fairness Meter)",
    fairnessMeterSubtitle: "ప్రతి రూపాయికి పూర్తి పారదర్శకత. కార్పొరేట్ దోపిడీకి తావులేదు.",
    workerKeeps: "కార్మికుడి వేతనం (90% ప్రత్యక్షం)",
    welfareCut: "కార్మిక సంక్షేమం & ఆరోగ్య బీమా (7%)",
    platformCut: "సహకార సాంకేతిక నిర్వహణ (3%)",
    corporateComparison: "కార్పొరేట్ యాప్‌లలో కార్మికులకు కేవలం 60-70% మాత్రమే అందుతుంది",
    corporateComparisonSub: "సహకార చట్టం 2002 ప్రకారం కార్మికులకు 90% చెల్లింపును హామీ ఇస్తుంది.",
    roles: {
      customer: "విశాఖ నివాసి (కస్టమర్)",
      worker: "నైపుణ్యం గల శ్రామికుడు (వర్కర్)",
      admin: "సెక్టార్ అడ్మిన్ (పాలన)",
    },
    nav: {
      services: "సేవలు",
      bookings: "నా బుకింగ్స్",
      artisans: "కార్మికుల డైరెక్టరీ",
      admin: "పాలనా కేంద్రం",
      join: "కార్మికుడిగా చేరండి",
      signIn: "లాగిన్",
      signOut: "లాగౌట్",
      switchRole: "పాత్ర మార్పు:",
      bookNow: "సేవ బుక్ చేయండి",
      workerPortal: "శ్రామిక పోర్టల్",
      adminPortal: "పాలక కేంద్రం",
      myBookings: "నా బుకింగ్స్",
      demoRole: "డెమో పాత్ర",
    },
    home: {
      sihBadge: "భారత ప్రభుత్వ సహకార మంత్రిత్వ శాఖ · SIH26089",
      heroTitle1: "విశాఖపట్నం కార్మికుల స్వంత ",
      heroTitleAccent: "సేవా వేదిక",
      heroTitle2: ", కార్పొరేట్ కాదు.",
      heroSubtitle: "విశాఖపట్నం లేబర్ కో-ఆపరేటివ్ సొసైటీల ద్వారా ధృవీకరించబడిన నిపుణులతో నేరుగా అనుసంధానం. 90% గ్యారెంటీ వేతనం, ఉచిత PMSBY ఆరోగ్య రక్షణ మరియు AI ఆధారిత వర్క్‌ఫోర్స్ కేటాయింపు.",
      bookWorker: "ధృవీకరించిన కార్మికుడిని బుక్ చేయండి",
      exploreAdmin: "AI రాడార్ & కంట్రోల్ సెంటర్ చూడండి",
      ecosystemBadge: "సహకార నమూనా",
      ecosystemTitle: "3 ప్రధాన భాగస్వాముల కోసం నిర్మించబడింది",
      ecosystemSubtitle: "సహకార ఆర్థిక వృద్ధి మరియు పూర్తి పారదర్శకత కోసం రూపొందించబడిన మోడల్.",
      workerCardTitle: "1. నైపుణ్యం గల శ్రామికుడు (వర్కర్)",
      workerCardDesc: "ఉచిత ఆధార్ e-KYC, 90% నేరుగా బ్యాంక్ బదిలీ, ఆటోమేటిక్ హెల్త్ ఫండ్ మరియు 3D డిజిటల్ QR గుర్తింపు కార్డు.",
      workerCardFeature1: "పారదర్శక 90% గ్యారెంటీ వేతనం",
      workerCardFeature2: "3D డిజిటల్ QR గుర్తింపు కార్డు",
      workerCardFeature3: "ఉచిత PMSBY ఆరోగ్య బీమా రక్షణ",
      workerCardLink: "శ్రామిక డ్యాష్‌బోర్డ్",
      customerCardTitle: "2. నివాసి / కస్టమర్",
      customerCardDesc: "సమీపంలోని నైపుణ్యం గల నిపుణులను కనుగొనండి, పారదర్శక సహకార రేట్లు చెల్లించండి మరియు సురక్షితమైన OTP తో పని ప్రారంభించండి.",
      customerCardFeature1: "సమీప దూరం ఆధారిత సరిపోలిక",
      customerCardFeature2: "పని ప్రారంభ సురక్షిత OTP",
      customerCardFeature3: "ఎటువంటి దళారీ ఛార్జీలు లేవు",
      customerCardLink: "సేవను బుక్ చేయండి",
      adminCardTitle: "3. సెక్టార్ అడ్మిన్",
      adminCardDesc: "కేంద్రీకృత నియంత్రణ కేంద్రం: 1-క్లిక్ ధృవీకరణ, రోస్టర్ నిర్వహణ, సంఘాల పర్యవేక్షణ మరియు AI డిమాండ్ రాడార్.",
      adminCardFeature1: "AI ప్రిడిక్టివ్ డిమాండ్ రాడార్",
      adminCardFeature2: "1-క్లిక్ వర్క్‌ఫోర్స్ రీబ్యాలెన్సింగ్",
      adminCardFeature3: "కనీస వేతన హామీ విధానం",
      adminCardLink: "కంట్రోల్ సెంటర్",
      ctaBadge: "గ్రాస్‌రూట్స్ సాధికారత · SIH26089",
      ctaTitle: "విశాఖపట్నం మొట్టమొదటి న్యాయమైన సహకార మార్కెట్‌ప్లేస్‌ను అనుభవించడానికి సిద్ధమా?",
      ctaSubtitle: "మీకు నైపుణ్యం గల ఎలక్ట్రీషియన్ లేదా ప్లంబర్ కావాలన్నా, లేదా మీ కష్టానికి 90% వేతనం పొందాలన్నా — సహకార కర్మకార్ మీ కోసమే.",
      joinArtisan: "వర్కర్‌గా చేరండి (ఉచిత e-KYC)",
    },
    customer: {
      heroTitle: "విశాఖపట్నం ధృవీకరించిన సహకార నిపుణులను బుక్ చేయండి",
      heroSubtitle: "ఎలక్ట్రీషియన్లు, ప్లంబర్లు మరియు కేర్‌గివర్లను నేరుగా సమర్థించండి. న్యాయమైన వేతనాలు, హామీ గల సేవ.",
      searchPlaceholder: "సేవ లేదా ప్రాంతాన్ని వెతకండి (ఉదా: MVP Colony)...",
      chooseTrade: "సేవను ఎంచుకోండి",
      nearestWorker: "సమీప సహకార కార్మికులు",
      verifiedCoopWorker: "ధృవీకరించిన సహకార సభ్యుడు",
      emergencyBadge: "అత్యవసర సేవ / తక్షణ స్పందన",
      emergencySubtitle: "30 నిమిషాల్లో ప్రాధాన్యతా స్పందన",
      bookWorker: "ఇప్పుడే బుక్ చేయండి",
      instantPay: "UPI ద్వారా చెల్లింపు",
      invoiceTitle: "సహకార సేవా రసీదు",
      qrVerifyPrompt: "కార్మికుడి రాక వద్ద డిజిటల్ QR కోడ్ స్కాన్ చేసి ధృవీకరించండి",
      rateWorkerTitle: "కార్మికుడి పనితీరుకు రేటింగ్ ఇవ్వండి",
    },
    worker: {
      portalTitle: "విశాఖ శ్రామిక సభ్యుల డ్యాష్‌బోర్డ్",
      activeJobs: "ప్రస్తుత పనులు",
      earningsToday: "వార్షిక సంపాదన",
      welfareFundBalance: "సహకార సంక్షేమ మరియు ఆరోగ్య నిధి",
      insuranceStatus: "సక్రియ PMSBY బీమా",
      digitalIdCard: "అధికారిక డిజిటల్ గుర్తింపు పత్రం",
      scanQrToVerify: "కస్టమర్లు మీ నైపుణ్యం మరియు వివరాలను తనిఖీ చేయడానికి ఈ క్యూఆర్ స్కాన్ చేస్తారు.",
      nsdcCertified: "NSDC / నైపుణ్య భారత్ సర్టిఫైడ్",
      acceptJob: "పనిని స్వీకరించండి",
      completeJob: "పని పూర్తయింది",
      availableToggle: "విధుల్లో అందుబాటులో ఉన్నాను",
    },
    admin: {
      adminTitle: "విశాఖపట్నం సహకార పాలన కేంద్రం",
      adminSubtitle: "కార్మికుల ధృవీకరణ, AI డిమాండ్ అంచనాలు మరియు వేతన విధానాల సమగ్ర నియంత్రణ.",
      aiForecastTitle: "AI డిమాండ్ ఫోర్‌కాస్ట్ & వర్క్‌ఫోర్స్ కేటాయింపు",
      aiForecastSubtitle: "తీరప్రాంత వాతావరణం ఆధారంగా శిక్షణ పొందిన మిషన్ లెర్నింగ్ మోడల్.",
      oneClickRebalance: "1-క్లిక్ వర్క్‌ఫోర్స్ పునఃపంపిణీ",
      activeSocieties: "అనుబంధ సహకార సంఘాలు",
      verifiedWorkersTotal: "ధృవీకరించిన కార్మికులు",
      welfareFundTotal: "మొత్తం సంక్షేమ నిధి",
      reviewWorkerApplications: "కార్మికుల ధృవీకరణ జాబితా",
      approve: "ధృవీకరించి ఐడీ జారీ చేయండి",
      reject: "తిరస్కరించు",
    },
  },
};

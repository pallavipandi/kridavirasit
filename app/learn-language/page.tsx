"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../LanguageProvider";

type LanguageCard = {
  name: string;
  native: string;
  region: string;
  icon: string;
  description: string;
  colorClass: string;
};

const languages: LanguageCard[] = [
  {
    name: "Tamil",
    native: "தமிழ்",
    region: "Tamil Nadu",
    icon: "தமிழ்",
    description:
      "Explore one of India's oldest classical languages through everyday words, phrases and cultural expressions.",
    colorClass: "language-tamil",
  },
  {
    name: "Hindi",
    native: "हिन्दी",
    region: "North India",
    icon: "हि",
    description:
      "Learn useful Hindi words, greetings and everyday sentences while discovering Indian culture.",
    colorClass: "language-hindi",
  },
  {
    name: "Sanskrit",
    native: "संस्कृतम्",
    region: "Pan-Indian",
    icon: "सं",
    description:
      "Discover the classical language that has shaped Indian literature, philosophy and traditional knowledge.",
    colorClass: "language-sanskrit",
  },
  {
    name: "Telugu",
    native: "తెలుగు",
    region: "Andhra Pradesh & Telangana",
    icon: "తె",
    description:
      "Learn Telugu through simple vocabulary, expressions and cultural connections.",
    colorClass: "language-telugu",
  },
  {
    name: "Kannada",
    native: "ಕನ್ನಡ",
    region: "Karnataka",
    icon: "ಕ",
    description:
      "Discover Kannada words and expressions while exploring the rich heritage of Karnataka.",
    colorClass: "language-kannada",
  },
  {
    name: "Malayalam",
    native: "മലയാളം",
    region: "Kerala",
    icon: "മ",
    description:
      "Build your Malayalam vocabulary with simple phrases connected to everyday life and culture.",
    colorClass: "language-malayalam",
  },
  {
    name: "Bengali",
    native: "বাংলা",
    region: "West Bengal & East India",
    icon: "বা",
    description:
      "Learn Bengali greetings, words and expressions through culture and everyday communication.",
    colorClass: "language-bengali",
  },
];

const translations: Record<
  string,
  {
    navHome: string;
    navGames: string;
    navLanguage: string;
    navAbout: string;
    navAchievements: string;

    eyebrow: string;
    title: string;
    description: string;

    chooseLanguage: string;
    chooseDescription: string;

    beginner: string;
    intermediate: string;
    comingSoon: string;

    words: string;
    phrases: string;
    practice: string;
    start: string;

    howTitle: string;
    howDescription: string;

    stepOne: string;
    stepOneText: string;
    stepTwo: string;
    stepTwoText: string;
    stepThree: string;
    stepThreeText: string;

    heritageTitle: string;
    heritageDescription: string;

    footerDescription: string;
    contact: string;
    feedback: string;
    copyright: string;
  }
> = {
  en: {
    navHome: "Home",
    navGames: "Games",
    navLanguage: "Learn Language",
    navAbout: "About",
    navAchievements: "Achievements",

    eyebrow: "LANGUAGE • CULTURE • CONNECTION",
    title: "Learn a Language Through Heritage",
    description:
      "Discover India's languages through words, phrases, pronunciation and the culture that gives every language its story.",

    chooseLanguage: "Choose Your Language",
    chooseDescription:
      "Start with a language you would like to explore. More languages and lessons can be added as the learning experience grows.",

    beginner: "Beginner",
    intermediate: "Intermediate",
    comingSoon: "Coming Soon",

    words: "Words",
    phrases: "Phrases",
    practice: "Practice",
    start: "Start Learning →",

    howTitle: "Learn. Listen. Practise.",
    howDescription:
      "Our language learning experience is designed to make learning simple, interactive and connected to Indian heritage.",

    stepOne: "Learn the Basics",
    stepOneText:
      "Build your vocabulary with common words, greetings, numbers and everyday expressions.",

    stepTwo: "Listen & Speak",
    stepTwoText:
      "Listen to pronunciation and practise saying words and sentences at your own pace.",

    stepThree: "Connect with Culture",
    stepThreeText:
      "Understand how language connects with traditions, places, stories and everyday Indian life.",

    heritageTitle: "Language is more than words.",
    heritageDescription:
      "Every Indian language carries generations of stories, traditions, literature and knowledge. Learn the language and discover the heritage behind it.",

    footerDescription: "Rediscover the Heritage of Indian Play",
    contact: "Contact",
    feedback: "Feedback",
    copyright: "© 2026 KRIDAVIRASAT · Indian Knowledge System",
  },

  hi: {
    navHome: "होम",
    navGames: "खेल",
    navLanguage: "भाषा सीखें",
    navAbout: "हमारे बारे में",
    navAchievements: "उपलब्धियाँ",

    eyebrow: "भाषा • संस्कृति • जुड़ाव",
    title: "विरासत के माध्यम से भाषा सीखें",
    description:
      "भारत की भाषाओं को शब्दों, वाक्यों, उच्चारण और उस संस्कृति के माध्यम से जानें जो हर भाषा की कहानी बताती है।",

    chooseLanguage: "अपनी भाषा चुनें",
    chooseDescription:
      "उस भाषा से शुरुआत करें जिसे आप सीखना चाहते हैं। सीखने के अनुभव के साथ और भाषाएँ और पाठ जोड़े जा सकते हैं।",

    beginner: "शुरुआती",
    intermediate: "मध्यम",
    comingSoon: "जल्द आ रहा है",

    words: "शब्द",
    phrases: "वाक्य",
    practice: "अभ्यास",
    start: "सीखना शुरू करें →",

    howTitle: "सीखें। सुनें। अभ्यास करें।",
    howDescription:
      "हमारा भाषा सीखने का अनुभव सीखने को सरल, इंटरैक्टिव और भारतीय विरासत से जुड़ा बनाता है।",

    stepOne: "मूल बातें सीखें",
    stepOneText:
      "सामान्य शब्दों, अभिवादन, संख्याओं और रोज़मर्रा के वाक्यों से अपनी शब्दावली बनाएं।",

    stepTwo: "सुनें और बोलें",
    stepTwoText:
      "उच्चारण सुनें और अपनी गति से शब्दों और वाक्यों को बोलने का अभ्यास करें।",

    stepThree: "संस्कृति से जुड़ें",
    stepThreeText:
      "जानें कि भाषा परंपराओं, स्थानों, कहानियों और भारतीय जीवन से कैसे जुड़ी है।",

    heritageTitle: "भाषा केवल शब्दों से अधिक है।",
    heritageDescription:
      "हर भारतीय भाषा में पीढ़ियों की कहानियाँ, परंपराएँ, साहित्य और ज्ञान समाहित हैं। भाषा सीखें और उसके पीछे की विरासत को जानें।",

    footerDescription: "भारतीय खेलों की विरासत को फिर से खोजें",
    contact: "संपर्क",
    feedback: "प्रतिक्रिया",
    copyright: "© 2026 KRIDAVIRASAT · भारतीय ज्ञान प्रणाली",
  },

  ta: {
    navHome: "முகப்பு",
    navGames: "விளையாட்டுகள்",
    navLanguage: "மொழி கற்க",
    navAbout: "எங்களைப் பற்றி",
    navAchievements: "சாதனைகள்",

    eyebrow: "மொழி • கலாச்சாரம் • இணைப்பு",
    title: "பாரம்பரியத்தின் மூலம் ஒரு மொழியைக் கற்றுக்கொள்ளுங்கள்",
    description:
      "சொற்கள், வாக்கியங்கள், உச்சரிப்பு மற்றும் ஒவ்வொரு மொழியையும் உருவாக்கிய கலாச்சாரத்தின் மூலம் இந்திய மொழிகளைக் கற்றுக்கொள்ளுங்கள்.",

    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    chooseDescription:
      "நீங்கள் கற்க விரும்பும் மொழியுடன் தொடங்குங்கள். மேலும் மொழிகளும் பாடங்களும் பின்னர் சேர்க்கப்படலாம்.",

    beginner: "தொடக்கநிலை",
    intermediate: "இடைநிலை",
    comingSoon: "விரைவில்",

    words: "சொற்கள்",
    phrases: "வாக்கியங்கள்",
    practice: "பயிற்சி",
    start: "கற்கத் தொடங்குங்கள் →",

    howTitle: "கற்கவும். கேட்கவும். பயிற்சி செய்யவும்.",
    howDescription:
      "இந்திய பாரம்பரியத்துடன் இணைந்த எளிய மற்றும் ஊடாடும் மொழி கற்றல் அனுபவத்தை உருவாக்குகிறோம்.",

    stepOne: "அடிப்படைகளைக் கற்றுக்கொள்ளுங்கள்",
    stepOneText:
      "பொதுவான சொற்கள், வாழ்த்துகள், எண்கள் மற்றும் அன்றாட வாக்கியங்களைக் கற்றுக்கொள்ளுங்கள்.",

    stepTwo: "கேட்டு பேசுங்கள்",
    stepTwoText:
      "உச்சரிப்பைக் கேட்டு, உங்கள் வேகத்தில் சொற்களையும் வாக்கியங்களையும் பேசிப் பயிற்சி செய்யுங்கள்.",

    stepThree: "கலாச்சாரத்துடன் இணைக",
    stepThreeText:
      "மொழி பாரம்பரியம், இடங்கள், கதைகள் மற்றும் இந்திய வாழ்க்கையுடன் எவ்வாறு இணைகிறது என்பதை அறியுங்கள்.",

    heritageTitle: "மொழி என்பது சொற்களை விட அதிகம்.",
    heritageDescription:
      "ஒவ்வொரு இந்திய மொழியிலும் தலைமுறைகளின் கதைகள், பாரம்பரியங்கள், இலக்கியம் மற்றும் அறிவு உள்ளது. மொழியைக் கற்று அதன் பின்னால் உள்ள பாரம்பரியத்தைக் கண்டறியுங்கள்.",

    footerDescription:
      "இந்திய விளையாட்டுகளின் பாரம்பரியத்தை மீண்டும் கண்டறியுங்கள்",
    contact: "தொடர்பு",
    feedback: "கருத்து",
    copyright: "© 2026 KRIDAVIRASAT · இந்திய அறிவு அமைப்பு",
  },

  te: {
    navHome: "హోమ్",
    navGames: "ఆటలు",
    navLanguage: "భాష నేర్చుకోండి",
    navAbout: "మా గురించి",
    navAchievements: "విజయాలు",

    eyebrow: "భాష • సంస్కృతి • అనుసంధానం",
    title: "వారసత్వం ద్వారా భాషను నేర్చుకోండి",
    description:
      "పదాలు, వాక్యాలు, ఉచ్చారణ మరియు ప్రతి భాషను రూపొందించిన సంస్కృతి ద్వారా భారతీయ భాషలను నేర్చుకోండి.",

    chooseLanguage: "మీ భాషను ఎంచుకోండి",
    chooseDescription:
      "మీరు నేర్చుకోవాలనుకునే భాషతో ప్రారంభించండి. తరువాత మరిన్ని భాషలు మరియు పాఠాలు జోడించవచ్చు.",

    beginner: "ప్రారంభ స్థాయి",
    intermediate: "మధ్యస్థం",
    comingSoon: "త్వరలో",

    words: "పదాలు",
    phrases: "వాక్యాలు",
    practice: "అభ్యాసం",
    start: "నేర్చుకోవడం ప్రారంభించండి →",

    howTitle: "నేర్చుకోండి. వినండి. అభ్యసించండి.",
    howDescription:
      "భారతీయ వారసత్వంతో అనుసంధానమైన సరళమైన మరియు ఇంటరాక్టివ్ భాషా అభ్యాస అనుభవాన్ని అందించడమే మా లక్ష్యం.",

    stepOne: "ప్రాథమికాలను నేర్చుకోండి",
    stepOneText:
      "సాధారణ పదాలు, అభివాదాలు, సంఖ్యలు మరియు రోజువారీ వాక్యాలతో మీ పదజాలాన్ని పెంచుకోండి.",

    stepTwo: "విని మాట్లాడండి",
    stepTwoText:
      "ఉచ్చారణను విని మీ వేగంతో పదాలు మరియు వాక్యాలను మాట్లాడటం అభ్యసించండి.",

    stepThree: "సంస్కృతితో అనుసంధానించండి",
    stepThreeText:
      "భాష సంప్రదాయాలు, ప్రదేశాలు, కథలు మరియు భారతీయ జీవితంతో ఎలా అనుసంధానమై ఉందో తెలుసుకోండి.",

    heritageTitle: "భాష పదాలకంటే ఎక్కువ.",
    heritageDescription:
      "ప్రతి భారతీయ భాషలో తరతరాల కథలు, సంప్రదాయాలు, సాహిత్యం మరియు జ్ఞానం ఉన్నాయి. భాషను నేర్చుకుని దాని వెనుక ఉన్న వారసత్వాన్ని కనుగొనండి.",

    footerDescription:
      "భారతీయ ఆటల వారసత్వాన్ని తిరిగి కనుగొనండి",
    contact: "సంప్రదించండి",
    feedback: "అభిప్రాయం",
    copyright: "© 2026 KRIDAVIRASAT · భారతీయ జ్ఞాన వ్యవస్థ",
  },

  kn: {
    navHome: "ಮುಖಪುಟ",
    navGames: "ಆಟಗಳು",
    navLanguage: "ಭಾಷೆ ಕಲಿಯಿರಿ",
    navAbout: "ನಮ್ಮ ಬಗ್ಗೆ",
    navAchievements: "ಸಾಧನೆಗಳು",

    eyebrow: "ಭಾಷೆ • ಸಂಸ್ಕೃತಿ • ಸಂಪರ್ಕ",
    title: "ಪರಂಪರೆಯ ಮೂಲಕ ಭಾಷೆಯನ್ನು ಕಲಿಯಿರಿ",
    description:
      "ಪದಗಳು, ವಾಕ್ಯಗಳು, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಪ್ರತಿಯೊಂದು ಭಾಷೆಯನ್ನು ರೂಪಿಸಿದ ಸಂಸ್ಕೃತಿಯ ಮೂಲಕ ಭಾರತೀಯ ಭಾಷೆಗಳನ್ನು ಕಲಿಯಿರಿ.",

    chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    chooseDescription:
      "ನೀವು ಕಲಿಯಲು ಬಯಸುವ ಭಾಷೆಯೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಿ. ಮುಂದೆ ಇನ್ನಷ್ಟು ಭಾಷೆಗಳು ಮತ್ತು ಪಾಠಗಳನ್ನು ಸೇರಿಸಬಹುದು.",

    beginner: "ಆರಂಭಿಕ",
    intermediate: "ಮಧ್ಯಮ",
    comingSoon: "ಶೀಘ್ರದಲ್ಲೇ",

    words: "ಪದಗಳು",
    phrases: "ವಾಕ್ಯಗಳು",
    practice: "ಅಭ್ಯಾಸ",
    start: "ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ →",

    howTitle: "ಕಲಿಯಿರಿ. ಕೇಳಿರಿ. ಅಭ್ಯಾಸ ಮಾಡಿ.",
    howDescription:
      "ಭಾರತೀಯ ಪರಂಪರೆಯೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿರುವ ಸರಳ ಮತ್ತು ಸಂವಾದಾತ್ಮಕ ಭಾಷಾ ಕಲಿಕೆಯ ಅನುಭವವನ್ನು ರಚಿಸಲಾಗಿದೆ.",

    stepOne: "ಮೂಲಭೂತಗಳನ್ನು ಕಲಿಯಿರಿ",
    stepOneText:
      "ಸಾಮಾನ್ಯ ಪದಗಳು, ಶುಭಾಶಯಗಳು, ಸಂಖ್ಯೆಗಳು ಮತ್ತು ದೈನಂದಿನ ವಾಕ್ಯಗಳಿಂದ ನಿಮ್ಮ ಪದಸಂಪತ್ತನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಿ.",

    stepTwo: "ಕೇಳಿ ಮತ್ತು ಮಾತನಾಡಿ",
    stepTwoText:
      "ಉಚ್ಚಾರಣೆಯನ್ನು ಕೇಳಿ ಮತ್ತು ನಿಮ್ಮ ವೇಗದಲ್ಲಿ ಪದಗಳು ಮತ್ತು ವಾಕ್ಯಗಳನ್ನು ಮಾತನಾಡಲು ಅಭ್ಯಾಸ ಮಾಡಿ.",

    stepThree: "ಸಂಸ್ಕೃತಿಯೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ",
    stepThreeText:
      "ಭಾಷೆಯು ಸಂಪ್ರದಾಯಗಳು, ಸ್ಥಳಗಳು, ಕಥೆಗಳು ಮತ್ತು ಭಾರತೀಯ ಜೀವನದೊಂದಿಗೆ ಹೇಗೆ ಸಂಪರ್ಕ ಹೊಂದಿದೆ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ.",

    heritageTitle: "ಭಾಷೆ ಪದಗಳಿಗಿಂತ ಹೆಚ್ಚು.",
    heritageDescription:
      "ಪ್ರತಿಯೊಂದು ಭಾರತೀಯ ಭಾಷೆಯಲ್ಲೂ ತಲೆಮಾರುಗಳ ಕಥೆಗಳು, ಸಂಪ್ರದಾಯಗಳು, ಸಾಹಿತ್ಯ ಮತ್ತು ಜ್ಞಾನವಿದೆ. ಭಾಷೆಯನ್ನು ಕಲಿತು ಅದರ ಹಿಂದಿನ ಪರಂಪರೆಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",

    footerDescription:
      "ಭಾರತೀಯ ಆಟಗಳ ಪರಂಪರೆಯನ್ನು ಮರುಶೋಧಿಸಿ",
    contact: "ಸಂಪರ್ಕ",
    feedback: "ಪ್ರತಿಕ್ರಿಯೆ",
    copyright: "© 2026 KRIDAVIRASAT · ಭಾರತೀಯ ಜ್ಞಾನ ವ್ಯವಸ್ಥೆ",
  },

  ml: {
    navHome: "ഹോം",
    navGames: "കളികൾ",
    navLanguage: "ഭാഷ പഠിക്കുക",
    navAbout: "ഞങ്ങളെക്കുറിച്ച്",
    navAchievements: "നേട്ടങ്ങൾ",

    eyebrow: "ഭാഷ • സംസ്കാരം • ബന്ധം",
    title: "പൈതൃകത്തിലൂടെ ഒരു ഭാഷ പഠിക്കൂ",
    description:
      "വാക്കുകൾ, വാക്യങ്ങൾ, ഉച്ചാരണം, ഓരോ ഭാഷയെയും രൂപപ്പെടുത്തിയ സംസ്കാരം എന്നിവയിലൂടെ ഇന്ത്യൻ ഭാഷകൾ പഠിക്കൂ.",

    chooseLanguage: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കൂ",
    chooseDescription:
      "നിങ്ങൾ പഠിക്കാൻ ആഗ്രഹിക്കുന്ന ഭാഷയോടെ ആരംഭിക്കൂ. പിന്നീട് കൂടുതൽ ഭാഷകളും പാഠങ്ങളും ചേർക്കാം.",

    beginner: "തുടക്കനില",
    intermediate: "ഇടത്തരം",
    comingSoon: "ഉടൻ വരുന്നു",

    words: "വാക്കുകൾ",
    phrases: "വാക്യങ്ങൾ",
    practice: "പരിശീലനം",
    start: "പഠനം ആരംഭിക്കൂ →",

    howTitle: "പഠിക്കൂ. കേൾക്കൂ. പരിശീലിക്കൂ.",
    howDescription:
      "ഇന്ത്യൻ പൈതൃകവുമായി ബന്ധിപ്പിച്ച ലളിതവും സംവേദനാത്മകവുമായ ഭാഷാ പഠന അനുഭവം ഒരുക്കുകയാണ് ഞങ്ങളുടെ ലക്ഷ്യം.",

    stepOne: "അടിസ്ഥാനങ്ങൾ പഠിക്കൂ",
    stepOneText:
      "സാധാരണ വാക്കുകൾ, ആശംസകൾ, അക്കങ്ങൾ, ദൈനംദിന വാക്യങ്ങൾ എന്നിവ പഠിക്കൂ.",

    stepTwo: "കേൾക്കൂ, സംസാരിക്കൂ",
    stepTwoText:
      "ഉച്ചാരണം കേട്ട് നിങ്ങളുടെ വേഗത്തിൽ വാക്കുകളും വാക്യങ്ങളും സംസാരിക്കാൻ പരിശീലിക്കൂ.",

    stepThree: "സംസ്കാരവുമായി ബന്ധപ്പെടൂ",
    stepThreeText:
      "ഭാഷ പാരമ്പര്യങ്ങൾ, സ്ഥലങ്ങൾ, കഥകൾ, ഇന്ത്യൻ ജീവിതം എന്നിവയുമായി എങ്ങനെ ബന്ധപ്പെട്ടിരിക്കുന്നു എന്ന് മനസ്സിലാക്കൂ.",

    heritageTitle: "ഭാഷ വാക്കുകളേക്കാൾ കൂടുതലാണ്.",
    heritageDescription:
      "ഓരോ ഇന്ത്യൻ ഭാഷയിലും തലമുറകളുടെ കഥകളും പാരമ്പര്യങ്ങളും സാഹിത്യവും അറിവും അടങ്ങിയിരിക്കുന്നു. ഭാഷ പഠിച്ച് അതിന്റെ പിന്നിലെ പൈതൃകം കണ്ടെത്തൂ.",

    footerDescription:
      "ഇന്ത്യൻ കളികളുടെ പൈതൃകം വീണ്ടും കണ്ടെത്തൂ",
    contact: "ബന്ധപ്പെടുക",
    feedback: "അഭിപ്രായം",
    copyright: "© 2026 KRIDAVIRASAT · ഇന്ത്യൻ വിജ്ഞാന സംവിധാനം",
  },

  bn: {
    navHome: "হোম",
    navGames: "খেলা",
    navLanguage: "ভাষা শিখুন",
    navAbout: "আমাদের সম্পর্কে",
    navAchievements: "অর্জন",

    eyebrow: "ভাষা • সংস্কৃতি • সংযোগ",
    title: "ঐতিহ্যের মাধ্যমে একটি ভাষা শিখুন",
    description:
      "শব্দ, বাক্য, উচ্চারণ এবং প্রতিটি ভাষাকে গড়ে তোলা সংস্কৃতির মাধ্যমে ভারতের ভাষাগুলি শিখুন।",

    chooseLanguage: "আপনার ভাষা বেছে নিন",
    chooseDescription:
      "আপনি যে ভাষা শিখতে চান সেটি দিয়ে শুরু করুন। পরে আরও ভাষা ও পাঠ যোগ করা যাবে।",

    beginner: "শিক্ষানবিস",
    intermediate: "মধ্যম",
    comingSoon: "শীঘ্রই আসছে",

    words: "শব্দ",
    phrases: "বাক্য",
    practice: "অনুশীলন",
    start: "শেখা শুরু করুন →",

    howTitle: "শিখুন। শুনুন। অনুশীলন করুন।",
    howDescription:
      "আমাদের ভাষা শেখার অভিজ্ঞতা শেখাকে সহজ, ইন্টার‌্যাক্টিভ এবং ভারতীয় ঐতিহ্যের সঙ্গে যুক্ত করে।",

    stepOne: "মূল বিষয়গুলি শিখুন",
    stepOneText:
      "সাধারণ শব্দ, অভিবাদন, সংখ্যা এবং দৈনন্দিন বাক্যের মাধ্যমে আপনার শব্দভাণ্ডার তৈরি করুন।",

    stepTwo: "শুনুন ও বলুন",
    stepTwoText:
      "উচ্চারণ শুনুন এবং নিজের গতিতে শব্দ ও বাক্য বলার অনুশীলন করুন।",

    stepThree: "সংস্কৃতির সঙ্গে যুক্ত হন",
    stepThreeText:
      "ভাষা কীভাবে ঐতিহ্য, স্থান, গল্প এবং ভারতীয় জীবনের সঙ্গে যুক্ত তা জানুন।",

    heritageTitle: "ভাষা শুধু শব্দের চেয়ে বেশি।",
    heritageDescription:
      "প্রতিটি ভারতীয় ভাষার মধ্যে প্রজন্মের গল্প, ঐতিহ্য, সাহিত্য এবং জ্ঞান রয়েছে। ভাষা শিখুন এবং তার পিছনের ঐতিহ্য আবিষ্কার করুন।",

    footerDescription:
      "ভারতীয় খেলার ঐতিহ্য পুনরায় আবিষ্কার করুন",
    contact: "যোগাযোগ",
    feedback: "মতামত",
    copyright: "© 2026 KRIDAVIRASAT · ভারতীয় জ্ঞান ব্যবস্থা",
  },
};

export default function LearnLanguagePage() {
  const router = useRouter();
  const { language } = useLanguage();

  const text = translations[language] || translations.en;

  const [selectedLanguage, setSelectedLanguage] =
    useState<string | null>(null);

  /*
   * =====================================================
   * START LEARNING
   * =====================================================
   *
   * Hindi is currently available.
   *
   * Tamil and all other languages show
   * the Coming Soon popup.
   */

  const handleStartLearning = (lang: LanguageCard) => {
    if (lang.name === "Hindi") {
      router.push("/learn-language/hindi");
      return;
    }

    setSelectedLanguage(lang.name);
  };

  /*
   * =====================================================
   * AVAILABLE LANGUAGES
   * =====================================================
   *
   * Only Hindi is currently available.
   */

  const isAvailableLanguage = (name: string) => {
    return name === "Hindi";
  };

  return (
    <main className="learn-language-page">

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="krida-nav">

        <div
          className="krida-logo"
          onClick={() => router.push("/home")}
        >
          <span className="logo-flower">
            🪷
          </span>

          <div>
            <strong>
              KRIDAVIRASAT
            </strong>

            <small>
              Indian Knowledge System
            </small>
          </div>
        </div>

        <div className="krida-desktop-menu">

          <button
            onClick={() => router.push("/home")}
          >
            {text.navHome}
          </button>

          <button
            onClick={() => router.push("/games")}
          >
            {text.navGames}
          </button>

          <button className="nav-active">
            {text.navLanguage}
          </button>

          <button
            onClick={() => router.push("/about")}
          >
            {text.navAbout}
          </button>

          <button
            onClick={() =>
              router.push("/achievements")
            }
          >
            {text.navAchievements}
          </button>

        </div>

        <button
          className="profile-button"
          onClick={() => router.push("/profile")}
        >
          👤
        </button>

      </nav>

      {/* =========================
          HERO
      ========================= */}

      <section className="language-page-hero">

        <div className="language-hero-decoration decoration-one">
          ॐ
        </div>

        <div className="language-hero-decoration decoration-two">
          अ
        </div>

        <div className="language-hero-content">

          <div className="language-eyebrow">
            ✦ {text.eyebrow} ✦
          </div>

          <h1>
            {text.title}
          </h1>

          <div className="language-title-line" />

          <p>
            {text.description}
          </p>

        </div>

        <div className="language-hero-art">

          <div className="script-circle script-circle-one">
            अ
          </div>

          <div className="script-circle script-circle-two">
            தமிழ்
          </div>

          <div className="script-circle script-circle-three">
            ಕ
          </div>

          <div className="language-lotus">
            🪷
          </div>

        </div>

      </section>

      {/* =========================
          LANGUAGE SELECTION
      ========================= */}

      <section className="language-selection">

        <div className="language-section-heading">

          <small>
            DISCOVER INDIA'S LANGUAGES
          </small>

          <h2>
            {text.chooseLanguage}
          </h2>

          <p>
            {text.chooseDescription}
          </p>

        </div>

        <div className="language-card-grid">

          {languages.map((lang) => {

            const available =
              isAvailableLanguage(lang.name);

            return (

              <article
                className={`language-learning-card ${lang.colorClass}`}
                key={lang.name}
              >

                <div className="language-card-top">

                  <div className="language-script">
                    {lang.icon}
                  </div>

                  <span className="language-region">
                    {lang.region}
                  </span>

                </div>

                <div className="language-card-body">

                  <h3>
                    {lang.name}
                  </h3>

                  <div className="native-language">
                    {lang.native}
                  </div>

                  <p>
                    {lang.description}
                  </p>

                  <div className="language-level">

                    <span>
                      {available
                        ? text.beginner
                        : text.comingSoon}
                    </span>

                    <span>
                      {available
                        ? `${text.words} • ${text.phrases} • ${text.practice}`
                        : ""}
                    </span>

                  </div>

                  <button
                    className="language-start-button"
                    onClick={() =>
                      handleStartLearning(lang)
                    }
                  >
                    {available
                      ? text.start
                      : text.comingSoon}
                  </button>

                </div>

              </article>

            );
          })}

        </div>

      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="language-how">

        <div className="language-section-heading">

          <small>
            YOUR LEARNING JOURNEY
          </small>

          <h2>
            {text.howTitle}
          </h2>

          <p>
            {text.howDescription}
          </p>

        </div>

        <div className="language-steps">

          <article className="language-step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              📖
            </div>

            <h3>
              {text.stepOne}
            </h3>

            <p>
              {text.stepOneText}
            </p>

          </article>

          <article className="language-step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🔊
            </div>

            <h3>
              {text.stepTwo}
            </h3>

            <p>
              {text.stepTwoText}
            </p>

          </article>

          <article className="language-step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🪷
            </div>

            <h3>
              {text.stepThree}
            </h3>

            <p>
              {text.stepThreeText}
            </p>

          </article>

        </div>

      </section>

      {/* =========================
          HERITAGE MESSAGE
      ========================= */}

      <section className="language-heritage">

        <div className="heritage-symbol">
          ॐ
        </div>

        <div className="heritage-message">

          <small>
            LANGUAGE & HERITAGE
          </small>

          <h2>
            {text.heritageTitle}
          </h2>

          <p>
            {text.heritageDescription}
          </p>

        </div>

        <div className="heritage-decoration">
          ✦
        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="krida-footer">

        <div className="footer-logo">
          🪷 KRIDAVIRASAT
        </div>

        <p>
          {text.footerDescription}
        </p>

        <div className="footer-links">

          <button
            onClick={() =>
              router.push("/about")
            }
          >
            {text.navAbout}
          </button>

          <button
            onClick={() =>
              router.push("/contact")
            }
          >
            {text.contact}
          </button>

          <button
            onClick={() =>
              router.push("/feedback")
            }
          >
            {text.feedback}
          </button>

        </div>

        <small>
          {text.copyright}
        </small>

      </footer>

      {/* =========================
          COMING SOON POPUP
      ========================= */}

      {selectedLanguage && (

        <div
          className="language-modal-overlay"
          onClick={() =>
            setSelectedLanguage(null)
          }
        >

          <div
            className="language-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-flower">
              🪷
            </div>

            <h3>
              {selectedLanguage} {text.comingSoon}
            </h3>

            <p>
              We are preparing interactive
              lessons, pronunciation practice
              and cultural activities for this
              language.
            </p>

            <button
              onClick={() =>
                setSelectedLanguage(null)
              }
            >
              Continue Exploring
            </button>

          </div>

        </div>

      )}

    </main>
  );
}
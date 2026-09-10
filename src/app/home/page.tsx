"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../LanguageProvider";

const games = [
  {
    name: "Paramapada Sopanam",
    place: "Pan-Indian",
    players: "2–4 Players",
    image: "/games/paramapada.png",
    description:
      "The ancient Indian game that inspired Snakes and Ladders.",
    path: "/games/paramapada-sopanam",
  },
  {
    name: "Pallankuzhi",
    place: "Tamil Nadu",
    players: "2 Players",
    image: "/games/pallankuzhi.png",
    description:
      "A traditional South Indian counting and strategy game.",
    path: "/games/pallankuzhi",
  },
  {
    name: "Dayakattai",
    place: "Tamil Nadu",
    players: "2–4 Players",
    image: "/games/dayakattai.png",
    description:
      "An ancient Tamil dice game filled with strategy and luck.",
    path: "/games/dayakattai",
  },
  {
    name: "Aadu Puli Aattam",
    place: "Tamil Nadu",
    players: "2 Players",
    image: "/games/aadu-puli-aattam.png",
    description:
      "The traditional Goat and Tiger strategy game.",
    path: "/games/aadu-puli-aattam",
  },
  {
    name: "Chowka Bara",
    place: "Karnataka",
    players: "2–4 Players",
    image: "/games/chowka-bara.png",
    description:
      "A traditional Karnataka board game of strategy.",
    path: "/games/chowka-bara",
  },
  {
    name: "Ludo",
    place: "India",
    players: "2–4 Players",
    image: "/games/ludo.png",
    description:
      "A classic board game of dice, movement and strategy.",
    path: "/games/ludo",
  },
];

/* =========================================================
   HOME PAGE TRANSLATIONS
========================================================= */

const homeTranslations: Record<
  string,
  {
    navHome: string;
    navGames: string;
    navLanguage: string;
    navAbout: string;
    navAchievements: string;

    brandSubtitle: string;

    heroSmall: string;
    welcome: string;
    heroDescription: string;
    exploreGames: string;
    learnLanguage: string;

    traditionalGames: string;
    languages: string;
    heritageStories: string;
    waysToLearn: string;

    factTitle: string;
    factHeading: string;
    factDescription: string;
    discoverHeritage: string;

    playHeritage: string;
    discoverGames: string;
    discoverGamesDescription: string;
    viewAllGames: string;
    searchGames: string;
    traditionalGame: string;
    exploreGame: string;

    languageSmall: string;
    languageHeading: string;
    languageDescription: string;
    startLearning: string;

    beyondGames: string;
    exploreHeritage: string;

    ancientGames: string;
    ancientGamesDescription: string;

    regionalHeritage: string;
    regionalHeritageDescription: string;

    knowledgeSystem: string;
    knowledgeSystemDescription: string;

    culturalEncyclopedia: string;
    culturalEncyclopediaDescription: string;

    explore: string;

    footerDescription: string;
    contact: string;
    feedback: string;
    footerCopyright: string;
  }
> = {
  /* =====================================================
     ENGLISH
  ===================================================== */

  en: {
    navHome: "Home",
    navGames: "Games",
    navLanguage: "Learn Language",
    navAbout: "About",
    navAchievements: "Achievements",

    brandSubtitle: "Indian Knowledge System",

    heroSmall: "✦ INDIAN KNOWLEDGE SYSTEM PRESENTS ✦",
    welcome: "Welcome back,",
    heroDescription:
      "Rediscover the games, stories and traditions that shaped generations of India.",
    exploreGames: "🎮 Explore Games",
    learnLanguage: "🗣️ Learn a Language",

    traditionalGames: "Traditional Games",
    languages: "Languages",
    heritageStories: "Heritage Stories",
    waysToLearn: "Ways to Learn",

    factTitle: "TODAY'S HERITAGE FACT",
    factHeading: "Games were more than entertainment.",
    factDescription:
      "Traditional Indian games helped develop strategy, mathematics, memory, teamwork, physical skills and social interaction.",
    discoverHeritage: "Discover Heritage →",

    playHeritage: "PLAY THE HERITAGE",
    discoverGames: "Discover Traditional Games",
    discoverGamesDescription:
      "Explore games preserved through generations across India.",
    viewAllGames: "View All Games →",
    searchGames: "Search games or regions...",
    traditionalGame: "TRADITIONAL GAME",
    exploreGame: "Explore Game →",

    languageSmall: "LANGUAGE • CULTURE • CONNECTION",
    languageHeading: "Learn a Language Through Heritage",
    languageDescription:
      "Learn words and sentences, listen to pronunciation and practise speaking with your own interactive language coach.",
    startLearning: "Start Learning →",

    beyondGames: "BEYOND THE GAMES",
    exploreHeritage: "Explore Indian Heritage",

    ancientGames: "Ancient Games",
    ancientGamesDescription:
      "Discover the origins and stories behind India's traditional games.",

    regionalHeritage: "Regional Heritage",
    regionalHeritageDescription:
      "Travel across India and discover games from different regions.",

    knowledgeSystem: "Indian Knowledge System",
    knowledgeSystemDescription:
      "Learn how traditional play connects with learning and culture.",

    culturalEncyclopedia: "Cultural Encyclopedia",
    culturalEncyclopediaDescription:
      "Explore languages, festivals, traditions and knowledge.",

    explore: "Explore →",

    footerDescription: "Rediscover the Heritage of Indian Play",
    contact: "Contact",
    feedback: "Feedback",
    footerCopyright:
      "© 2026 KRIDAVIRASAT · Indian Knowledge System",
  },

  /* =====================================================
     HINDI
  ===================================================== */

  hi: {
    navHome: "होम",
    navGames: "खेल",
    navLanguage: "भाषा सीखें",
    navAbout: "हमारे बारे में",
    navAchievements: "उपलब्धियाँ",

    brandSubtitle: "भारतीय ज्ञान प्रणाली",

    heroSmall: "✦ भारतीय ज्ञान प्रणाली प्रस्तुत करता है ✦",
    welcome: "वापसी पर स्वागत है,",
    heroDescription:
      "भारत की पीढ़ियों को आकार देने वाले खेलों, कहानियों और परंपराओं को फिर से खोजें।",
    exploreGames: "🎮 खेलों का अन्वेषण करें",
    learnLanguage: "🗣️ भाषा सीखें",

    traditionalGames: "पारंपरिक खेल",
    languages: "भाषाएँ",
    heritageStories: "विरासत की कहानियाँ",
    waysToLearn: "सीखने के तरीके",

    factTitle: "आज की विरासत जानकारी",
    factHeading: "खेल केवल मनोरंजन नहीं थे।",
    factDescription:
      "पारंपरिक भारतीय खेलों ने रणनीति, गणित, स्मृति, टीमवर्क, शारीरिक कौशल और सामाजिक संपर्क को विकसित करने में मदद की।",
    discoverHeritage: "विरासत जानें →",

    playHeritage: "विरासत का खेल खेलें",
    discoverGames: "पारंपरिक खेल खोजें",
    discoverGamesDescription:
      "पूरे भारत में पीढ़ियों से संरक्षित खेलों का अन्वेषण करें।",
    viewAllGames: "सभी खेल देखें →",
    searchGames: "खेल या क्षेत्र खोजें...",
    traditionalGame: "पारंपरिक खेल",
    exploreGame: "खेल देखें →",

    languageSmall: "भाषा • संस्कृति • जुड़ाव",
    languageHeading: "विरासत के माध्यम से भाषा सीखें",
    languageDescription:
      "शब्द और वाक्य सीखें, उच्चारण सुनें और अपने इंटरैक्टिव भाषा कोच के साथ बोलने का अभ्यास करें।",
    startLearning: "सीखना शुरू करें →",

    beyondGames: "खेलों से आगे",
    exploreHeritage: "भारतीय विरासत का अन्वेषण करें",

    ancientGames: "प्राचीन खेल",
    ancientGamesDescription:
      "भारत के पारंपरिक खेलों की उत्पत्ति और उनके पीछे की कहानियों को जानें।",

    regionalHeritage: "क्षेत्रीय विरासत",
    regionalHeritageDescription:
      "भारत की यात्रा करें और विभिन्न क्षेत्रों के खेलों को खोजें।",

    knowledgeSystem: "भारतीय ज्ञान प्रणाली",
    knowledgeSystemDescription:
      "जानें कि पारंपरिक खेल सीखने और संस्कृति से कैसे जुड़े हैं।",

    culturalEncyclopedia: "सांस्कृतिक विश्वकोश",
    culturalEncyclopediaDescription:
      "भाषाओं, त्योहारों, परंपराओं और ज्ञान का अन्वेषण करें।",

    explore: "अन्वेषण करें →",

    footerDescription: "भारतीय खेलों की विरासत को फिर से खोजें",
    contact: "संपर्क",
    feedback: "प्रतिक्रिया",
    footerCopyright:
      "© 2026 KRIDAVIRASAT · भारतीय ज्ञान प्रणाली",
  },

  /* =====================================================
     TAMIL
  ===================================================== */

  ta: {
    navHome: "முகப்பு",
    navGames: "விளையாட்டுகள்",
    navLanguage: "மொழி கற்க",
    navAbout: "எங்களைப் பற்றி",
    navAchievements: "சாதனைகள்",

    brandSubtitle: "இந்திய அறிவு அமைப்பு",

    heroSmall: "✦ இந்திய அறிவு அமைப்பு வழங்குகிறது ✦",
    welcome: "மீண்டும் வரவேற்கிறோம்,",
    heroDescription:
      "இந்திய தலைமுறைகளை வடிவமைத்த விளையாட்டுகள், கதைகள் மற்றும் பாரம்பரியங்களை மீண்டும் கண்டறியுங்கள்.",
    exploreGames: "🎮 விளையாட்டுகளை ஆராயுங்கள்",
    learnLanguage: "🗣️ ஒரு மொழியைக் கற்றுக்கொள்ளுங்கள்",

    traditionalGames: "பாரம்பரிய விளையாட்டுகள்",
    languages: "மொழிகள்",
    heritageStories: "பாரம்பரியக் கதைகள்",
    waysToLearn: "கற்கும் வழிகள்",

    factTitle: "இன்றைய பாரம்பரிய தகவல்",
    factHeading: "விளையாட்டுகள் பொழுதுபோக்கு மட்டுமல்ல.",
    factDescription:
      "பாரம்பரிய இந்திய விளையாட்டுகள் உத்தி, கணிதம், நினைவாற்றல், குழுப்பணி, உடல் திறன் மற்றும் சமூக தொடர்பை வளர்க்க உதவின.",
    discoverHeritage: "பாரம்பரியத்தை அறியுங்கள் →",

    playHeritage: "பாரம்பரியத்தை விளையாடுங்கள்",
    discoverGames: "பாரம்பரிய விளையாட்டுகளைக் கண்டறியுங்கள்",
    discoverGamesDescription:
      "இந்தியா முழுவதும் தலைமுறைகளாக பாதுகாக்கப்பட்ட விளையாட்டுகளை ஆராயுங்கள்.",
    viewAllGames: "அனைத்து விளையாட்டுகளையும் காண்க →",
    searchGames: "விளையாட்டு அல்லது பகுதியைத் தேடுங்கள்...",
    traditionalGame: "பாரம்பரிய விளையாட்டு",
    exploreGame: "விளையாட்டைக் காண்க →",

    languageSmall: "மொழி • கலாச்சாரம் • இணைப்பு",
    languageHeading: "பாரம்பரியத்தின் மூலம் ஒரு மொழியைக் கற்றுக்கொள்ளுங்கள்",
    languageDescription:
      "சொற்கள் மற்றும் வாக்கியங்களைக் கற்றுக்கொள்ளுங்கள், உச்சரிப்பைக் கேளுங்கள் மற்றும் உங்கள் ஊடாடும் மொழி பயிற்சியாளருடன் பேசிப் பயிற்சி செய்யுங்கள்.",
    startLearning: "கற்றலைத் தொடங்குங்கள் →",

    beyondGames: "விளையாட்டுகளுக்கு அப்பால்",
    exploreHeritage: "இந்திய பாரம்பரியத்தை ஆராயுங்கள்",

    ancientGames: "பண்டைய விளையாட்டுகள்",
    ancientGamesDescription:
      "இந்தியாவின் பாரம்பரிய விளையாட்டுகளின் தோற்றத்தையும் கதைகளையும் கண்டறியுங்கள்.",

    regionalHeritage: "பிராந்திய பாரம்பரியம்",
    regionalHeritageDescription:
      "இந்தியா முழுவதும் பயணம் செய்து பல்வேறு பகுதிகளின் விளையாட்டுகளைக் கண்டறியுங்கள்.",

    knowledgeSystem: "இந்திய அறிவு அமைப்பு",
    knowledgeSystemDescription:
      "பாரம்பரிய விளையாட்டுகள் கற்றல் மற்றும் கலாச்சாரத்துடன் எவ்வாறு இணைகின்றன என்பதை அறியுங்கள்.",

    culturalEncyclopedia: "கலாச்சார கலைக்களஞ்சியம்",
    culturalEncyclopediaDescription:
      "மொழிகள், திருவிழாக்கள், பாரம்பரியங்கள் மற்றும் அறிவை ஆராயுங்கள்.",

    explore: "ஆராயுங்கள் →",

    footerDescription:
      "இந்திய விளையாட்டுகளின் பாரம்பரியத்தை மீண்டும் கண்டறியுங்கள்",
    contact: "தொடர்பு",
    feedback: "கருத்து",
    footerCopyright:
      "© 2026 KRIDAVIRASAT · இந்திய அறிவு அமைப்பு",
  },

  /* =====================================================
     TELUGU
  ===================================================== */

  te: {
    navHome: "హోమ్",
    navGames: "ఆటలు",
    navLanguage: "భాష నేర్చుకోండి",
    navAbout: "మా గురించి",
    navAchievements: "విజయాలు",

    brandSubtitle: "భారతీయ జ్ఞాన వ్యవస్థ",

    heroSmall: "✦ భారతీయ జ్ఞాన వ్యవస్థ అందిస్తోంది ✦",
    welcome: "తిరిగి స్వాగతం,",
    heroDescription:
      "భారతదేశ తరాలను ప్రభావితం చేసిన ఆటలు, కథలు మరియు సంప్రదాయాలను తిరిగి కనుగొనండి.",
    exploreGames: "🎮 ఆటలను అన్వేషించండి",
    learnLanguage: "🗣️ ఒక భాషను నేర్చుకోండి",

    traditionalGames: "సాంప్రదాయ ఆటలు",
    languages: "భాషలు",
    heritageStories: "వారసత్వ కథలు",
    waysToLearn: "నేర్చుకునే మార్గాలు",

    factTitle: "ఈరోజు వారసత్వ సమాచారం",
    factHeading: "ఆటలు కేవలం వినోదం మాత్రమే కాదు.",
    factDescription:
      "సాంప్రదాయ భారతీయ ఆటలు వ్యూహం, గణితం, జ్ఞాపకశక్తి, బృందపని, శారీరక నైపుణ్యాలు మరియు సామాజిక పరస్పర చర్యలను అభివృద్ధి చేయడంలో సహాయపడ్డాయి.",
    discoverHeritage: "వారసత్వాన్ని తెలుసుకోండి →",

    playHeritage: "వారసత్వాన్ని ఆడండి",
    discoverGames: "సాంప్రదాయ ఆటలను కనుగొనండి",
    discoverGamesDescription:
      "భారతదేశం అంతటా తరతరాలుగా సంరక్షించబడిన ఆటలను అన్వేషించండి.",
    viewAllGames: "అన్ని ఆటలను చూడండి →",
    searchGames: "ఆటలు లేదా ప్రాంతాలను వెతకండి...",
    traditionalGame: "సాంప్రదాయ ఆట",
    exploreGame: "ఆటను అన్వేషించండి →",

    languageSmall: "భాష • సంస్కృతి • అనుసంధానం",
    languageHeading: "వారసత్వం ద్వారా భాషను నేర్చుకోండి",
    languageDescription:
      "పదాలు మరియు వాక్యాలను నేర్చుకోండి, ఉచ్చారణను వినండి మరియు మీ ఇంటరాక్టివ్ భాషా కోచ్‌తో మాట్లాడటం అభ్యసించండి.",
    startLearning: "నేర్చుకోవడం ప్రారంభించండి →",

    beyondGames: "ఆటలకు మించి",
    exploreHeritage: "భారతీయ వారసత్వాన్ని అన్వేషించండి",

    ancientGames: "ప్రాచీన ఆటలు",
    ancientGamesDescription:
      "భారతదేశ సాంప్రదాయ ఆటల మూలాలు మరియు కథలను తెలుసుకోండి.",

    regionalHeritage: "ప్రాంతీయ వారసత్వం",
    regionalHeritageDescription:
      "భారతదేశం అంతటా ప్రయాణించి వివిధ ప్రాంతాల ఆటలను కనుగొనండి.",

    knowledgeSystem: "భారతీయ జ్ఞాన వ్యవస్థ",
    knowledgeSystemDescription:
      "సాంప్రదాయ ఆటలు అభ్యాసం మరియు సంస్కృతితో ఎలా అనుసంధానమై ఉన్నాయో తెలుసుకోండి.",

    culturalEncyclopedia: "సాంస్కృతిక విజ్ఞాన సర్వస్వం",
    culturalEncyclopediaDescription:
      "భాషలు, పండుగలు, సంప్రదాయాలు మరియు జ్ఞానాన్ని అన్వేషించండి.",

    explore: "అన్వేషించండి →",

    footerDescription:
      "భారతీయ ఆటల వారసత్వాన్ని తిరిగి కనుగొనండి",
    contact: "సంప్రదించండి",
    feedback: "అభిప్రాయం",
    footerCopyright:
      "© 2026 KRIDAVIRASAT · భారతీయ జ్ఞాన వ్యవస్థ",
  },

  /* =====================================================
     KANNADA
  ===================================================== */

  kn: {
    navHome: "ಮುಖಪುಟ",
    navGames: "ಆಟಗಳು",
    navLanguage: "ಭಾಷೆ ಕಲಿಯಿರಿ",
    navAbout: "ನಮ್ಮ ಬಗ್ಗೆ",
    navAchievements: "ಸಾಧನೆಗಳು",

    brandSubtitle: "ಭಾರತೀಯ ಜ್ಞಾನ ವ್ಯವಸ್ಥೆ",

    heroSmall: "✦ ಭಾರತೀಯ ಜ್ಞಾನ ವ್ಯವಸ್ಥೆ ಪ್ರಸ್ತುತಪಡಿಸುತ್ತದೆ ✦",
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ,",
    heroDescription:
      "ಭಾರತದ ಪೀಳಿಗೆಗಳನ್ನು ರೂಪಿಸಿದ ಆಟಗಳು, ಕಥೆಗಳು ಮತ್ತು ಸಂಪ್ರದಾಯಗಳನ್ನು ಮರುಶೋಧಿಸಿ.",
    exploreGames: "🎮 ಆಟಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    learnLanguage: "🗣️ ಒಂದು ಭಾಷೆಯನ್ನು ಕಲಿಯಿರಿ",

    traditionalGames: "ಸಾಂಪ್ರದಾಯಿಕ ಆಟಗಳು",
    languages: "ಭಾಷೆಗಳು",
    heritageStories: "ಪರಂಪರೆಯ ಕಥೆಗಳು",
    waysToLearn: "ಕಲಿಯುವ ಮಾರ್ಗಗಳು",

    factTitle: "ಇಂದಿನ ಪರಂಪರೆಯ ಮಾಹಿತಿ",
    factHeading: "ಆಟಗಳು ಕೇವಲ ಮನರಂಜನೆಯಾಗಿರಲಿಲ್ಲ.",
    factDescription:
      "ಸಾಂಪ್ರದಾಯಿಕ ಭಾರತೀಯ ಆಟಗಳು ತಂತ್ರ, ಗಣಿತ, ಸ್ಮರಣೆ, ತಂಡದ ಕೆಲಸ, ದೈಹಿಕ ಕೌಶಲ್ಯ ಮತ್ತು ಸಾಮಾಜಿಕ ಸಂವಹನವನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸಲು ಸಹಾಯ ಮಾಡಿವೆ.",
    discoverHeritage: "ಪರಂಪರೆಯನ್ನು ಅನ್ವೇಷಿಸಿ →",

    playHeritage: "ಪರಂಪರೆಯನ್ನು ಆಡಿ",
    discoverGames: "ಸಾಂಪ್ರದಾಯಿಕ ಆಟಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ",
    discoverGamesDescription:
      "ಭಾರತದಾದ್ಯಂತ ಪೀಳಿಗೆಗಳಿಂದ ಸಂರಕ್ಷಿಸಲ್ಪಟ್ಟ ಆಟಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    viewAllGames: "ಎಲ್ಲಾ ಆಟಗಳನ್ನು ನೋಡಿ →",
    searchGames: "ಆಟಗಳು ಅಥವಾ ಪ್ರದೇಶಗಳನ್ನು ಹುಡುಕಿ...",
    traditionalGame: "ಸಾಂಪ್ರದಾಯಿಕ ಆಟ",
    exploreGame: "ಆಟವನ್ನು ಅನ್ವೇಷಿಸಿ →",

    languageSmall: "ಭಾಷೆ • ಸಂಸ್ಕೃತಿ • ಸಂಪರ್ಕ",
    languageHeading: "ಪರಂಪರೆಯ ಮೂಲಕ ಭಾಷೆಯನ್ನು ಕಲಿಯಿರಿ",
    languageDescription:
      "ಪದಗಳು ಮತ್ತು ವಾಕ್ಯಗಳನ್ನು ಕಲಿಯಿರಿ, ಉಚ್ಚಾರಣೆಯನ್ನು ಕೇಳಿ ಮತ್ತು ನಿಮ್ಮ ಸಂವಾದಾತ್ಮಕ ಭಾಷಾ ತರಬೇತುದಾರರೊಂದಿಗೆ ಮಾತನಾಡುವುದನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.",
    startLearning: "ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ →",

    beyondGames: "ಆಟಗಳಾಚೆಗೆ",
    exploreHeritage: "ಭಾರತೀಯ ಪರಂಪರೆಯನ್ನು ಅನ್ವೇಷಿಸಿ",

    ancientGames: "ಪ್ರಾಚೀನ ಆಟಗಳು",
    ancientGamesDescription:
      "ಭಾರತದ ಸಾಂಪ್ರದಾಯಿಕ ಆಟಗಳ ಮೂಲಗಳು ಮತ್ತು ಕಥೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.",

    regionalHeritage: "ಪ್ರಾದೇಶಿಕ ಪರಂಪರೆ",
    regionalHeritageDescription:
      "ಭಾರತದಾದ್ಯಂತ ಪ್ರಯಾಣಿಸಿ ವಿವಿಧ ಪ್ರದೇಶಗಳ ಆಟಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.",

    knowledgeSystem: "ಭಾರತೀಯ ಜ್ಞಾನ ವ್ಯವಸ್ಥೆ",
    knowledgeSystemDescription:
      "ಸಾಂಪ್ರದಾಯಿಕ ಆಟಗಳು ಕಲಿಕೆ ಮತ್ತು ಸಂಸ್ಕೃತಿಯೊಂದಿಗೆ ಹೇಗೆ ಸಂಪರ್ಕ ಹೊಂದಿವೆ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ.",

    culturalEncyclopedia: "ಸಾಂಸ್ಕೃತಿಕ ವಿಶ್ವಕೋಶ",
    culturalEncyclopediaDescription:
      "ಭಾಷೆಗಳು, ಹಬ್ಬಗಳು, ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಜ್ಞಾನವನ್ನು ಅನ್ವೇಷಿಸಿ.",

    explore: "ಅನ್ವೇಷಿಸಿ →",

    footerDescription:
      "ಭಾರತೀಯ ಆಟಗಳ ಪರಂಪರೆಯನ್ನು ಮರುಶೋಧಿಸಿ",
    contact: "ಸಂಪರ್ಕ",
    feedback: "ಪ್ರತಿಕ್ರಿಯೆ",
    footerCopyright:
      "© 2026 KRIDAVIRASAT · ಭಾರತೀಯ ಜ್ಞಾನ ವ್ಯವಸ್ಥೆ",
  },

  /* =====================================================
     MALAYALAM
  ===================================================== */

  ml: {
    navHome: "ഹോം",
    navGames: "കളികൾ",
    navLanguage: "ഭാഷ പഠിക്കുക",
    navAbout: "ഞങ്ങളെക്കുറിച്ച്",
    navAchievements: "നേട്ടങ്ങൾ",

    brandSubtitle: "ഇന്ത്യൻ വിജ്ഞാന സംവിധാനം",

    heroSmall: "✦ ഇന്ത്യൻ വിജ്ഞാന സംവിധാനം അവതരിപ്പിക്കുന്നു ✦",
    welcome: "വീണ്ടും സ്വാഗതം,",
    heroDescription:
      "ഇന്ത്യയിലെ തലമുറകളെ രൂപപ്പെടുത്തിയ കളികളും കഥകളും പാരമ്പര്യങ്ങളും വീണ്ടും കണ്ടെത്തൂ.",
    exploreGames: "🎮 കളികൾ കണ്ടെത്തൂ",
    learnLanguage: "🗣️ ഒരു ഭാഷ പഠിക്കൂ",

    traditionalGames: "പരമ്പരാഗത കളികൾ",
    languages: "ഭാഷകൾ",
    heritageStories: "പൈതൃക കഥകൾ",
    waysToLearn: "പഠിക്കാനുള്ള വഴികൾ",

    factTitle: "ഇന്നത്തെ പൈതൃക വിവരം",
    factHeading: "കളികൾ വിനോദം മാത്രമായിരുന്നില്ല.",
    factDescription:
      "പരമ്പരാഗത ഇന്ത്യൻ കളികൾ തന്ത്രം, ഗണിതം, ഓർമ്മശക്തി, കൂട്ടായ പ്രവർത്തനം, ശാരീരിക കഴിവുകൾ, സാമൂഹിക ഇടപെടൽ എന്നിവ വികസിപ്പിക്കാൻ സഹായിച്ചു.",
    discoverHeritage: "പൈതൃകം കണ്ടെത്തൂ →",

    playHeritage: "പൈതൃകം കളിക്കൂ",
    discoverGames: "പരമ്പരാഗത കളികൾ കണ്ടെത്തൂ",
    discoverGamesDescription:
      "ഇന്ത്യയിലുടനീളം തലമുറകളായി സംരക്ഷിക്കപ്പെട്ട കളികൾ കണ്ടെത്തൂ.",
    viewAllGames: "എല്ലാ കളികളും കാണുക →",
    searchGames: "കളികളോ പ്രദേശങ്ങളോ തിരയുക...",
    traditionalGame: "പരമ്പരാഗത കളി",
    exploreGame: "കളി കണ്ടെത്തൂ →",

    languageSmall: "ഭാഷ • സംസ്കാരം • ബന്ധം",
    languageHeading: "പൈതൃകത്തിലൂടെ ഒരു ഭാഷ പഠിക്കൂ",
    languageDescription:
      "വാക്കുകളും വാക്യങ്ങളും പഠിക്കൂ, ഉച്ചാരണം കേൾക്കൂ, നിങ്ങളുടെ ഇന്ററാക്ടീവ് ഭാഷാ പരിശീലകനോടൊപ്പം സംസാരിക്കാൻ പരിശീലിക്കൂ.",
    startLearning: "പഠനം ആരംഭിക്കൂ →",

    beyondGames: "കളികൾക്കപ്പുറം",
    exploreHeritage: "ഇന്ത്യൻ പൈതൃകം കണ്ടെത്തൂ",

    ancientGames: "പുരാതന കളികൾ",
    ancientGamesDescription:
      "ഇന്ത്യയിലെ പരമ്പരാഗത കളികളുടെ ഉത്ഭവവും കഥകളും കണ്ടെത്തൂ.",

    regionalHeritage: "പ്രാദേശിക പൈതൃകം",
    regionalHeritageDescription:
      "ഇന്ത്യയിലുടനീളം സഞ്ചരിച്ച് വിവിധ പ്രദേശങ്ങളിലെ കളികൾ കണ്ടെത്തൂ.",

    knowledgeSystem: "ഇന്ത്യൻ വിജ്ഞാന സംവിധാനം",
    knowledgeSystemDescription:
      "പരമ്പരാഗത കളികൾ പഠനത്തോടും സംസ്കാരത്തോടും എങ്ങനെ ബന്ധപ്പെട്ടിരിക്കുന്നു എന്ന് മനസ്സിലാക്കൂ.",

    culturalEncyclopedia: "സാംസ്കാരിക വിജ്ഞാനകോശം",
    culturalEncyclopediaDescription:
      "ഭാഷകൾ, ഉത്സവങ്ങൾ, പാരമ്പര്യങ്ങൾ, അറിവ് എന്നിവ കണ്ടെത്തൂ.",

    explore: "കണ്ടെത്തൂ →",

    footerDescription:
      "ഇന്ത്യൻ കളികളുടെ പൈതൃകം വീണ്ടും കണ്ടെത്തൂ",
    contact: "ബന്ധപ്പെടുക",
    feedback: "അഭിപ്രായം",
    footerCopyright:
      "© 2026 KRIDAVIRASAT · ഇന്ത്യൻ വിജ്ഞാന സംവിധാനം",
  },

  /* =====================================================
     BENGALI
  ===================================================== */

  bn: {
    navHome: "হোম",
    navGames: "খেলা",
    navLanguage: "ভাষা শিখুন",
    navAbout: "আমাদের সম্পর্কে",
    navAchievements: "অর্জন",

    brandSubtitle: "ভারতীয় জ্ঞান ব্যবস্থা",

    heroSmall: "✦ ভারতীয় জ্ঞান ব্যবস্থা উপস্থাপন করছে ✦",
    welcome: "আবার স্বাগতম,",
    heroDescription:
      "ভারতের প্রজন্মগুলিকে গড়ে তোলা খেলা, গল্প এবং ঐতিহ্যগুলি পুনরায় আবিষ্কার করুন।",
    exploreGames: "🎮 খেলা অন্বেষণ করুন",
    learnLanguage: "🗣️ একটি ভাষা শিখুন",

    traditionalGames: "ঐতিহ্যবাহী খেলা",
    languages: "ভাষা",
    heritageStories: "ঐতিহ্যের গল্প",
    waysToLearn: "শেখার উপায়",

    factTitle: "আজকের ঐতিহ্য তথ্য",
    factHeading: "খেলা শুধু বিনোদন ছিল না।",
    factDescription:
      "ঐতিহ্যবাহী ভারতীয় খেলা কৌশল, গণিত, স্মৃতি, দলগত কাজ, শারীরিক দক্ষতা এবং সামাজিক যোগাযোগ বিকাশে সাহায্য করত।",
    discoverHeritage: "ঐতিহ্য আবিষ্কার করুন →",

    playHeritage: "ঐতিহ্যের খেলা খেলুন",
    discoverGames: "ঐতিহ্যবাহী খেলা আবিষ্কার করুন",
    discoverGamesDescription:
      "ভারতজুড়ে প্রজন্মের পর প্রজন্ম ধরে সংরক্ষিত খেলাগুলি অন্বেষণ করুন।",
    viewAllGames: "সব খেলা দেখুন →",
    searchGames: "খেলা বা অঞ্চল অনুসন্ধান করুন...",
    traditionalGame: "ঐতিহ্যবাহী খেলা",
    exploreGame: "খেলা অন্বেষণ করুন →",

    languageSmall: "ভাষা • সংস্কৃতি • সংযোগ",
    languageHeading: "ঐতিহ্যের মাধ্যমে একটি ভাষা শিখুন",
    languageDescription:
      "শব্দ ও বাক্য শিখুন, উচ্চারণ শুনুন এবং আপনার ইন্টার‌্যাক্টিভ ভাষা প্রশিক্ষকের সঙ্গে কথা বলার অনুশীলন করুন।",
    startLearning: "শেখা শুরু করুন →",

    beyondGames: "খেলার বাইরে",
    exploreHeritage: "ভারতীয় ঐতিহ্য অন্বেষণ করুন",

    ancientGames: "প্রাচীন খেলা",
    ancientGamesDescription:
      "ভারতের ঐতিহ্যবাহী খেলাগুলির উৎপত্তি এবং গল্পগুলি আবিষ্কার করুন।",

    regionalHeritage: "আঞ্চলিক ঐতিহ্য",
    regionalHeritageDescription:
      "ভারত ভ্রমণ করুন এবং বিভিন্ন অঞ্চলের খেলা আবিষ্কার করুন।",

    knowledgeSystem: "ভারতীয় জ্ঞান ব্যবস্থা",
    knowledgeSystemDescription:
      "ঐতিহ্যবাহী খেলা কীভাবে শিক্ষা ও সংস্কৃতির সঙ্গে যুক্ত তা জানুন।",

    culturalEncyclopedia: "সাংস্কৃতিক বিশ্বকোষ",
    culturalEncyclopediaDescription:
      "ভাষা, উৎসব, ঐতিহ্য এবং জ্ঞান অন্বেষণ করুন।",

    explore: "অন্বেষণ করুন →",

    footerDescription:
      "ভারতীয় খেলার ঐতিহ্য পুনরায় আবিষ্কার করুন",
    contact: "যোগাযোগ",
    feedback: "মতামত",
    footerCopyright:
      "© 2026 KRIDAVIRASAT · ভারতীয় জ্ঞান ব্যবস্থা",
  },
};

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  const router = useRouter();

  const { language } = useLanguage();

  const text =
    homeTranslations[language] || homeTranslations.en;

  const [userName, setUserName] = useState("Explorer");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem(
      "kridavirasat-user-name"
    );

    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      `${game.name} ${game.place} ${game.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="krida-home">

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
              {text.brandSubtitle}
            </small>
          </div>
        </div>

        <div className="krida-desktop-menu">

          <button
            className="nav-active"
            onClick={() => router.push("/home")}
          >
            {text.navHome}
          </button>

          <button
            onClick={() => router.push("/games")}
          >
            {text.navGames}
          </button>

          <button
            onClick={() => router.push("/language")}
          >
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

        <div className="krida-nav-right">

          <button
            className="profile-button"
            onClick={() => router.push("/profile")}
          >
            👤
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

      </nav>

      {/* =========================
          MOBILE MENU
      ========================= */}

      {menuOpen && (
        <div className="krida-mobile-menu">

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

          <button
            onClick={() => router.push("/language")}
          >
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
      )}

      {/* =========================
          HERO
      ========================= */}

      <section className="krida-hero">

        <div className="hero-decoration left">
          ❈
        </div>

        <div className="hero-text">

          <div className="hero-small-title">
            {text.heroSmall}
          </div>

          <h1>
            {text.welcome}
            <span>
              {userName}
            </span>
          </h1>

          <div className="hero-line" />

          <p>
            {text.heroDescription}
          </p>

          <div className="hero-buttons">

            <button
              className="gold-button"
              onClick={() =>
                document
                  .getElementById("games")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              {text.exploreGames}
            </button>

            <button
              className="outline-button"
              onClick={() =>
                router.push("/learn-language")
              }
            >
              {text.learnLanguage}
            </button>

          </div>

        </div>

        <div className="hero-art">

          <div className="mandala">
            <div className="mandala-inner">
              🪷
            </div>
          </div>

          <div className="floating-symbol symbol-one">
            🎲
          </div>

          <div className="floating-symbol symbol-two">
            🪔
          </div>

          <div className="floating-symbol symbol-three">
            🏛️
          </div>

        </div>

      </section>

      {/* =========================
          STATS
      ========================= */}

      <section className="krida-stats">

        <div>
          <strong>06</strong>
          <span>
            {text.traditionalGames}
          </span>
        </div>

        <div>
          <strong>30+</strong>
          <span>
            {text.languages}
          </span>
        </div>

        <div>
          <strong>100+</strong>
          <span>
            {text.heritageStories}
          </span>
        </div>

        <div>
          <strong>∞</strong>
          <span>
            {text.waysToLearn}
          </span>
        </div>

      </section>

      {/* =========================
          HERITAGE FACT
      ========================= */}

      <section className="heritage-fact">

        <div className="fact-icon">
          ❈
        </div>

        <div>

          <small>
            {text.factTitle}
          </small>

          <h3>
            {text.factHeading}
          </h3>

          <p>
            {text.factDescription}
          </p>

        </div>

        <button
          onClick={() => router.push("/about")}
        >
          {text.discoverHeritage}
        </button>

      </section>

      {/* =========================
          GAMES
      ========================= */}

      <section
        className="games-area"
        id="games"
      >

        <div className="section-title">

          <div>

            <small>
              {text.playHeritage}
            </small>

            <h2>
              {text.discoverGames}
            </h2>

            <p>
              {text.discoverGamesDescription}
            </p>

          </div>

          <button
            onClick={() => router.push("/games")}
          >
            {text.viewAllGames}
          </button>

        </div>

        {/* SEARCH */}

        <div className="game-search">

          <span>
            ⌕
          </span>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder={text.searchGames}
          />

        </div>

        {/* =========================
            GAME CARDS
        ========================= */}

        <div className="game-grid">

          {filteredGames.map((game) => (

            <article
              className="game-card"
              key={game.name}
            >

              {/* GAME IMAGE */}

              <div className="game-image">

                <img
                  src={game.image}
                  alt={game.name}
                  className="game-photo"
                />

                {/* Dark overlay */}

                <div className="game-image-overlay" />

                {/* Decorative motif */}

                <div className="game-motif">
                  ❈
                </div>

                {/* Decorative icon */}

                <span className="game-icon" aria-hidden="true">
                  🎲
                </span>

                {/* Location */}

                <label>
                  {game.place}
                </label>

              </div>

              {/* GAME INFORMATION */}

              <div className="game-content">

                <small>
                  {text.traditionalGame}
                </small>

                <h3>
                  {game.name}
                </h3>

                <p>
                  {game.description}
                </p>

                <div className="game-info">
                  👥 {game.players}
                </div>

                <button
                  onClick={() => {

                    localStorage.setItem(
                      "kridavirasat-selected-game",
                      JSON.stringify(game)
                    );

                    router.push(game.path);

                  }}
                >
                  {text.exploreGame}
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* =========================
          LANGUAGE SECTION
      ========================= */}

      <section className="language-banner">

        <div className="language-symbol">
          ॐ
        </div>

        <div className="language-text">

          <small>
            {text.languageSmall}
          </small>

          <h2>
            {text.languageHeading}
          </h2>

          <p>
            {text.languageDescription}
          </p>

          <button
            onClick={() =>
              router.push("/learn-language")
            }
          >
            {text.startLearning}
          </button>

        </div>

        <div className="language-circle">
          文
        </div>

      </section>

      {/* =========================
          CULTURE
      ========================= */}

      <section className="culture-area">

        <div className="section-title">

          <div>

            <small>
              {text.beyondGames}
            </small>

            <h2>
              {text.exploreHeritage}
            </h2>

          </div>

        </div>

        <div className="culture-grid">

          <button
            onClick={() => router.push("/about")}
          >
            <span>
              📜
            </span>

            <h3>
              {text.ancientGames}
            </h3>

            <p>
              {text.ancientGamesDescription}
            </p>

            <b>
              {text.explore}
            </b>
          </button>

          <button
            onClick={() => router.push("/about")}
          >
            <span>
              🗺️
            </span>

            <h3>
              {text.regionalHeritage}
            </h3>

            <p>
              {text.regionalHeritageDescription}
            </p>

            <b>
              {text.explore}
            </b>
          </button>

          <button
            onClick={() => router.push("/about")}
          >
            <span>
              🏛️
            </span>

            <h3>
              {text.knowledgeSystem}
            </h3>

            <p>
              {text.knowledgeSystemDescription}
            </p>

            <b>
              {text.explore}
            </b>
          </button>

          <button
            onClick={() => router.push("/about")}
          >
            <span>
              📚
            </span>

            <h3>
              {text.culturalEncyclopedia}
            </h3>

            <p>
              {text.culturalEncyclopediaDescription}
            </p>

            <b>
              {text.explore}
            </b>
          </button>

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
            onClick={() => router.push("/about")}
          >
            {text.navAbout}
          </button>

          <button
            onClick={() => router.push("/contact")}
          >
            {text.contact}
          </button>

          <button
            onClick={() => router.push("/feedback")}
          >
            {text.feedback}
          </button>

        </div>

        <small>
          {text.footerCopyright}
        </small>

      </footer>

    </main>
  );
}

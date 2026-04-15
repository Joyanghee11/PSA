export const companyInfo = {
  // 신문 등록 정보
  registration: {
    authority: "경기도",
    registrationNo: "아53721",
    type: "인터넷신문",
    category: "인터넷신문",
    name: "다이브저널",
    corporation: "조양희(다이브저널)",
    registrationDate: "2023-07-18",
  },

  // 사업자 정보
  business: {
    registrationNo: "406-90-09215",
    address: "경기도 시흥시 거북섬공원로 27, 1동 2층 223호(정왕동, 시흥MTV웨이브파크리움)",
    addressEn: "223, 2F, 1-dong, 27 Geobukseomgongwon-ro, Siheung-si, Gyeonggi-do, Korea",
  },

  // 인물
  people: {
    publisher: "조양희",     // 발행인
    editor: "조양희",        // 편집인
    ceo: "조양희",           // 대표
  },

  // 연락처
  contact: {
    email: "divejournal@divejournal.co.kr",
    phone: "",
  },

  // 소개
  about: {
    ko: "다이브저널은 전 세계 프리다이빙 및 다이빙 소식을 AI 기술을 활용하여 한국어와 영어로 매일 전달하는 인터넷 신문입니다. 대한민국 경기도에 등록된 정식 인터넷 신문으로, 프리다이빙 대회, 기록, 훈련, 안전, 장비, 해양 환경 등 다이빙과 관련된 모든 분야의 뉴스를 빠르고 정확하게 보도합니다.",
    en: "Dive Journal is an AI-powered internet newspaper that delivers worldwide freediving and diving news daily in Korean and English. Registered as an official internet newspaper in Gyeonggi-do, South Korea, we cover all areas of diving including competitions, records, training, safety, equipment, and marine environment.",
  },
} as const;

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
    ko: "다이브 저널은 프리다이빙과 스쿠버, 수중 사진을 다루는 웹 매거진입니다. 국내외 소식과 깊이 있는 기사를 전하고, 수중 사진작가의 작품을 소개하는 갤러리와 누구나 참여하는 온라인 사진 콘테스트를 운영합니다. 경기도에 등록된 인터넷신문입니다.",
    en: "Dive Journal is a web magazine about freediving, scuba and underwater photography. We publish news and in-depth stories, run a gallery that connects collectors with underwater photographers, and host online photo contests open to everyone. Registered internet newspaper, Gyeonggi-do, Korea.",
  },
} as const;

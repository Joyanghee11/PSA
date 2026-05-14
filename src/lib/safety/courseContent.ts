// PSA_safety: designed slide content.
//
// Source material: 「2019 연안체험활동 안전교육 교재」(해양경찰청).
// Two study chapters per the user's request — 연안사고예방법 + 수중형 — plus
// a course-level table of contents and a 2026 law-update addendum.

import type { CourseModel, SafetyChapter, Slide } from "./slideTypes";

// ---------------------------------------------------------------------------
// 목차 (course TOC) — informational, auto-completes on view
// ---------------------------------------------------------------------------
const tocSlides: Slide[] = [
  {
    id: "toc-cover",
    type: "cover",
    eyebrow: "PSA · safety",
    chapter: "Course Overview",
    title: "수중레저 안전교육",
    titleEn: "Underwater Leisure Safety Education",
    subtitle: "「수중레저활동의 안전 및 활성화 등에 관한 법률」 제20조 시행규칙 제13조 1항에 따른 온라인 안전교육 과정",
    accent: "tide",
  },
  {
    id: "toc-overview",
    type: "sectionIntro",
    eyebrow: "목차 · Table of Contents",
    title: "본 과정의 구성",
    intro:
      "본 과정은 「연안사고 예방법」을 중심으로 한 제도·신고·관리 부분과, 수중활동(잠수)에 직접 관련된 안전·생리·장비·법령 부분으로 나뉩니다. 마지막에 2019년 본 교재 발행 이후의 법령 변동사항을 별도 부록으로 다룹니다.",
    sections: [
      { number: "Ⅰ", title: "연안사고 예방법", pages: "법 제정 · 신고제도 · 안전관리요원 · 안전교육 · 안전장비" },
      { number: "Ⅳ", title: "수중형", pages: "잠수 분류 · 안전수칙 · 감압이론 · 장비 · 잠수질환 · 잠수 관련 법률" },
      { number: "📌", title: "2026 최신 법령 업데이트", pages: "수중레저법 · 연안사고예방법 · 운영자 점검 체크리스트" },
    ],
  },
  {
    id: "toc-flow",
    type: "flow",
    eyebrow: "학습 안내",
    title: "학습 흐름",
    intro: "다음 흐름에 따라 진행하시면 자동으로 진도가 저장되고 마지막 단원까지 이수하시면 이수증이 발급됩니다.",
    steps: [
      { label: "회원 정보 확인", actor: "1단계", detail: "PSA 회원명부와 일치하는 4개 항목 검증" },
      { label: "본문 학습", actor: "2단계", detail: "연안사고예방법 → 수중형 순서대로 학습" },
      { label: "법령 부록", actor: "3단계", detail: "2026 최신 법령 변동사항 확인" },
      { label: "이수증 발급", actor: "4단계", detail: "PDF 다운로드 (도장 자동 날인)" },
    ],
    footnote: "각 단원의 마지막 페이지에 도달하면 자동으로 이수가 표시됩니다. 키보드 ←/→ 또는 Space로 빠르게 넘길 수 있습니다.",
  },
];

// ---------------------------------------------------------------------------
// Ⅰ. 연안사고 예방법
// ---------------------------------------------------------------------------
const chapter1Slides: Slide[] = [
  {
    id: "ch1-cover",
    type: "cover",
    eyebrow: "Chapter Ⅰ",
    chapter: "Ⅰ",
    title: "연안사고 예방법",
    titleEn: "Coastal Accident Prevention Law",
    subtitle: "법 제정 배경 · 구성 · 신고제도 · 안전관리요원 · 안전교육 · 안전장비",
    accent: "tide",
  },
  {
    id: "ch1-intro",
    type: "sectionIntro",
    title: "이 단원의 학습 항목",
    intro:
      "본 단원은 「연안사고 예방에 관한 법률」(약칭: 연안사고예방법)의 제정 배경, 법률 구조, 그리고 운영자가 반드시 지켜야 할 신고·안전관리·안전교육 의무를 다룹니다.",
    sections: [
      { number: "1", title: "연안사고 예방법 개요" },
      { number: "2", title: "연안사고 정의 및 현황" },
      { number: "3", title: "연안체험활동 개요" },
      { number: "4", title: "연안체험활동 신고제도" },
      { number: "5", title: "안전관리요원 자격·인원" },
      { number: "6", title: "안전교육·안전장비 기준" },
    ],
  },
  {
    id: "ch1-history",
    type: "timeline",
    title: "법 제정 배경",
    intro:
      "2013년 태안 사설 캠프 사고는 연안 체험활동 안전관리의 공백을 적나라하게 드러낸 사건이었습니다. 그 결과 약 1년 만에 「연안사고 예방법」이 제정·시행되었습니다.",
    events: [
      { date: "2013. 7. 18", label: "태안 사설 유사해병대 캠프 사고", detail: "학생 5명 사망" },
      { date: "2013. 8. 28", label: "정부종합대책 발표", detail: "당정협의 후 입법 추진 결정" },
      { date: "2013. 11. 6", label: "법안 발의", detail: "경대수의원 대표 발의" },
      { date: "2014. 5. 21", label: "「연안사고 예방법」 제정", detail: "법률 공포" },
      { date: "2014. 8. 22", label: "시행", detail: "본격 적용 개시" },
    ],
  },
  {
    id: "ch1-structure",
    type: "table",
    title: "법률 구성 체계",
    intro:
      "본 표는 2019 발간 교재 기준 5장 25개 조문 구성을 보여줍니다. 현행 법률은 6장 32조로 개정되었으니 시험 응시·실무 적용 시에는 부록 「2026 법령 업데이트」와 「국가법령정보센터」 현행 조문을 우선 확인하십시오.",
    columns: ["장", "내용", "조문"],
    rows: [
      ["제1장", { value: "총칙", emphasis: true }, "제1조 ~ 제4조"],
      ["제2장", { value: "연안사고 예방 기본계획 등", emphasis: true }, "제5조 ~ 제8조"],
      ["제3장", { value: "연안사고 안전관리규정 등", emphasis: true, tone: "tide" }, "제9조 ~ 제18조"],
      ["제4장", { value: "안전문화시책 등", emphasis: true }, "제19조 ~ 제22조"],
      ["제5장", { value: "벌칙", emphasis: true, tone: "coral" }, "제23조 ~ 제25조"],
    ],
    footnote:
      "[2019 발간본 기준] 본 교육의 핵심 의무는 제3장(안전관리규정)에 집중되어 있습니다. ★현행은 6장 32조로 확장되었습니다 (부록 참조).",
  },
  {
    id: "ch1-keyContents",
    type: "grid",
    title: "주요 내용",
    intro: "본 법률은 다음 6가지 핵심 의무를 정합니다.",
    columns: 3,
    cards: [
      { glyph: "📋", title: "5년 단위 기본계획", body: "해양수산부장관이 5년마다 연안사고예방 기본계획 수립 (제5조)" },
      { glyph: "🤝", title: "협의회 운영", body: "유관기관 간 협의를 위한 연안사고예방협의회 구성·운영 (제8조)" },
      { glyph: "🛟", title: "안전관리규정", body: "갯벌·갯바위·방파제 등 위험구역 안전관리규정 작성·시행 (제9조)" },
      { glyph: "🚷", title: "출입통제·활동제한", body: "다발지역 출입통제 및 체험활동 제한 (제10조, 제14조)" },
      { glyph: "✅", title: "안전수칙·교육·신고", body: "체험활동 안전수칙 준수, 교육 이수, 사전신고 (제11조, 제12조)" },
      { glyph: "🔍", title: "안전점검", body: "운영자·시설에 대한 점검 (제11조~제13조)" },
    ],
  },
  {
    id: "ch1-quiz1",
    type: "quizCheckpoint",
    title: "지식 복습 ① — 법 제정과 구성",
    intro: "여기까지의 내용을 점검합니다. 모든 문항을 풀어야 다음으로 넘어갈 수 있습니다.",
    questions: [
      {
        id: "q1-1",
        q: "「연안사고 예방법」이 제정·시행된 시기는?",
        choices: [
          "2013년 제정, 2014년 시행",
          "2014년 5월 제정, 2014년 8월 시행",
          "2015년 제정, 2016년 시행",
          "2014년 제정, 2015년 시행",
        ],
        correctIndex: 1,
        explanation: "2014년 5월 21일 제정, 동년 8월 22일 시행되었습니다.",
      },
      {
        id: "q1-2",
        q: "본 교육의 핵심 의무가 집중되어 있는 법률 장(章)은?",
        choices: [
          "제1장 총칙",
          "제2장 연안사고 예방 기본계획 등",
          "제3장 연안사고 안전관리규정 등",
          "제5장 벌칙",
        ],
        correctIndex: 2,
        explanation: "운영자가 지켜야 할 신고·안전관리 의무는 제3장(제9조~제18조)에 집중되어 있습니다.",
      },
      {
        id: "q1-3",
        q: "「연안사고 예방법」 제정의 직접적 배경이 된 사고는?",
        choices: [
          "2014 세월호 사고",
          "2013 태안 사설 유사해병대 캠프 사고 (학생 5명 사망)",
          "2010 천안함 사건",
          "2013 서해 페리 사고",
        ],
        correctIndex: 1,
        explanation: "2013년 7월 태안 캠프 사고를 계기로 입법이 추진되었습니다.",
      },
    ],
  },
  {
    id: "ch1-define",
    type: "definition",
    title: "연안사고란?",
    term: "연안사고",
    termEn: "Coastal Accident",
    definition: "연안해역에서 발생하는 인명에 위해를 끼치는 사고",
    notes: [
      "연안해역 ① — 해안선부터 지적공부에 등록된 지역 사이 (바닷가)",
      "연안해역 ② — 해안선으로부터 영해의 외측한계까지의 사이 (바다)",
      "「연안관리법」 제2조 제2호의 지역(무인도서 포함)",
    ],
  },
  {
    id: "ch1-stats3y",
    type: "stats",
    title: "최근 3년간 연안사고 현황 (2015 ~ 2017)",
    intro: "총 사고인원 3,817명, 인명피해 390명. 연도별 추이는 점차 감소하고 있으나 여전히 연 1,000명 안팎이 사고를 겪습니다.",
    scaleLabel: "사고 인원 (명)",
    bars: [
      { label: "2015년", value: 1684, sub: "인명피해 145" },
      { label: "2016년", value: 1126, sub: "인명피해 130" },
      { label: "2017년", value: 1007, sub: "인명피해 115" },
      { label: "3년 평균", value: 1272, sub: "인명피해 130" },
    ],
    footnote: "출처: 해양경찰청 연안사고 통계 (2019 교재 기준)",
  },
  {
    id: "ch1-defineActivity",
    type: "definition",
    title: "연안체험활동이란?",
    term: "연안체험활동",
    termEn: "Coastal Experience Activity",
    definition: "연안 해역에서 이루어지는 체험활동",
    notes: [
      "본 법은 활동의 형태에 따라 일반형 · 수상형 · 수중형 3가지로 분류합니다.",
      "각 유형마다 신고기준 · 안전관리요원 자격 · 안전장비 기준이 다릅니다.",
    ],
  },
  {
    id: "ch1-types",
    type: "grid",
    title: "연안체험활동 유형",
    intro: "활동 형태에 따라 3가지 유형으로 나뉘며, 본 교육은 그 중 「수중형」 운영자·강사를 주 대상으로 합니다.",
    columns: 3,
    cards: [
      {
        glyph: "🏖",
        title: "일반형",
        body: "수상·수중형 외 연안해역 체험. 갯벌체험, 조개줍기, 갯벌극기훈련 등",
        tone: "neutral",
      },
      {
        glyph: "🏊",
        title: "수상형",
        body: "선박·기구 없이 수상에서 이루어지는 체험. 스노클링, 수영, 물놀이 등",
        tone: "neutral",
      },
      {
        glyph: "🤿",
        title: "수중형",
        body: "수중에서 이루어지는 체험. 씨워킹, 수중 스쿠터, 스킨다이빙, 프리다이빙 등",
        tone: "tide",
      },
    ],
  },
  {
    id: "ch1-reportPurpose",
    type: "bullets",
    title: "연안체험활동 신고제도 — 목적",
    intro: "연안체험활동을 모집·운영하려는 자는 활동 7일 전까지 관할 해양경찰서장에게 신고해야 합니다. (※ 2025년 시행규칙 개정으로 종전 14일 → 7일로 단축)",
    bullets: [
      { lead: "기상", text: "기상 악화 시 통제 가능 — 사전 정보가 있어야 즉각 통제됩니다." },
      { lead: "위험요소", text: "체험현장의 위험요소를 사전 고지받을 수 있습니다." },
      { lead: "안전점검", text: "안전점검을 통해 사고 가능성을 사전에 차단합니다." },
    ],
  },
  {
    id: "ch1-reportTargets",
    type: "compare",
    title: "신고 대상 vs 신고 제외 대상",
    intro: "「수중레저법」 등 다른 법률의 지도·감독을 받는 경우는 원칙적으로 신고 대상이 아닙니다. 다만 위험도가 높은 활동은 종교단체라도 신고 대상입니다.",
    left: {
      title: "신고 대상",
      subtitle: "참가자 모집·프로그램 운영자",
      tone: "tide",
      bullets: [
        "연안체험활동에 참가하려는 사람을 모집하여 프로그램을 운영하려는 모든 운영자",
        "활동 7일 전까지 관할 해양경찰서장에게 신고 (2025년 시행규칙 개정 — 종전 14일에서 단축)",
        "운영자 + 안전관리요원의 안전교육 이수증 첨부",
        "보험가입증명서 첨부 (수상·수중형 의무가입)",
      ],
    },
    right: {
      title: "신고 제외 (법 제12조 단서)",
      subtitle: "다만 위험도 높은 활동은 신고 필요",
      tone: "neutral",
      bullets: [
        "다른 법률의 지도·감독을 받는 법인·단체 (청소년진흥법·수산업법·수중레저법 등)",
        "종교단체가 운영하는 경우",
        "20명 미만 일반형 / 10명 미만 수상형 / 5명 미만 수중형",
        "단, 위험도 높은 활동(20명↑ 수상형, 10명↑ 수중형)은 종교단체도 신고 필수",
      ],
    },
  },
  {
    id: "ch1-reportFlow",
    type: "flow",
    title: "신고처리 절차 (계획 신고)",
    intro: "온라인(https://imsm.kcg.go.kr) 또는 방문 신고. 활동 7일 전 접수가 원칙입니다. (2025년 시행규칙 개정 — 종전 14일에서 단축)",
    steps: [
      { label: "운영계획 수립", actor: "운영자", detail: "인원·장소·일자 등 계획" },
      { label: "계획 신고", actor: "운영자", detail: "모집 7일 전 온라인 시스템으로 접수" },
      { label: "구비서류 확인", actor: "관할 해경서", detail: "신고서 + 4종 첨부서류 확인" },
      { label: "신고증명서 발급", actor: "관할 해경서", detail: "이상 없을 시 발급, 보완 필요시 통보" },
      { label: "참가자 모집", actor: "운영자", detail: "신고된 내용에 따라 모집" },
      { label: "변경신고", actor: "운영자", detail: "변경사항 발생 시 즉시 변경신고" },
      { label: "활동 실시", actor: "운영자 + 해경서", detail: "필요시 안전점검 동행" },
    ],
  },
  {
    id: "ch1-reportTypes",
    type: "table",
    title: "신고 종류 3가지",
    intro: "운영 계획의 확정 정도에 따라 3가지 신고 방식이 있습니다.",
    columns: ["종류", "사용 시점", "신고 기한", "특징"],
    rows: [
      [
        { value: "계획(변경)신고", emphasis: true },
        "참가인원·일자·장소 확정",
        "활동 7일 전",
        "확정된 1회성 활동에 적합",
      ],
      [
        { value: "기간별 신고", emphasis: true, tone: "tide" },
        "세부 운영계획 미확정",
        "활동 7일 전",
        "최대 3개월 단위로 일괄 신고, 활동 직전 건별 신고 보완",
      ],
      [
        { value: "건별 신고", emphasis: true },
        "기간별 신고 후 개별 활동",
        "활동 직전",
        "기간별 신고 범위 내 개별 일정 신고",
      ],
    ],
  },
  {
    id: "ch1-docs",
    type: "checklist",
    title: "신고 시 구비서류",
    intro: "온라인 신고하지 않고 방문 신고 시에는 「연안체험활동 종합정보(imsm.kcg.go.kr) → 자료실 → 서식자료」에서 양식을 다운로드합니다.",
    items: [
      "연안체험활동 신고서 (계획·기간별·건별 중 1)",
      "안전관리계획서 (비상연락망·응급이송 대책 포함)",
      "안전관리요원 명단 + 자격현황 (유형별 인원)",
      "운영자·안전관리요원 안전교육 이수증",
      "안전장비 비치 종류·개수 + 설치 사진 (비상구조선·구명조끼·구명튜브·구명줄·구급장비)",
      "보험가입 증명서류 (배상책임보험)",
    ],
    footnote: "온라인 신고 매뉴얼은 종합정보 시스템 「공지사항」에서 확인할 수 있습니다.",
  },
  {
    id: "ch1-quiz2",
    type: "quizCheckpoint",
    title: "지식 복습 ② — 정의·활동 유형·신고제도",
    intro: "연안체험활동의 정의·유형·신고제도에 관한 핵심을 점검합니다.",
    questions: [
      {
        id: "q2-1",
        q: "다음 중 「수중형」 체험활동의 예에 해당하는 것은?",
        choices: ["갯벌체험", "수영", "프리다이빙", "조개줍기"],
        correctIndex: 2,
        explanation: "수중형 = 수중에서 이루어지는 활동(스킨다이빙·프리다이빙·씨워킹 등). 수영은 수상형, 갯벌체험·조개줍기는 일반형.",
      },
      {
        id: "q2-2",
        q: "연안체험활동 사전신고는 활동 며칠 전까지 해야 하는가? (2025년 시행규칙 개정 기준)",
        choices: ["7일 전", "10일 전", "14일 전", "30일 전"],
        correctIndex: 0,
        explanation: "「연안사고예방법 시행규칙」 제7조 — 2025년 개정으로 신고 기한이 종전 14일에서 7일로 단축되었습니다.",
      },
      {
        id: "q2-3",
        q: "신고 제외 대상이 아닌 것은?",
        choices: [
          "「수중레저법」의 지도·감독을 받는 단체",
          "5명 미만 수중형 활동",
          "20명 이상 수상형을 운영하는 종교단체",
          "「청소년진흥법」의 지도·감독을 받는 단체",
        ],
        correctIndex: 2,
        explanation: "종교단체라도 위험도가 높은 활동(20명↑ 수상형, 10명↑ 수중형)은 신고 의무가 있습니다.",
      },
      {
        id: "q2-4",
        q: "신고 종류 3가지에 해당하지 않는 것은?",
        choices: ["계획(변경) 신고", "기간별 신고", "건별 신고", "수시 통보"],
        correctIndex: 3,
        explanation: "신고 종류는 계획(변경)·기간별·건별 3가지입니다.",
      },
    ],
  },
  {
    id: "ch1-staffQual",
    type: "table",
    title: "안전관리요원 자격·배치 인원",
    intro: "「연안사고 예방법 시행규칙」 제6조 제4항 별표3에 따라 활동 유형별 자격기준과 참가자 대비 인원 비율이 다릅니다.",
    columns: ["구분", "수상형", "수중형", "일반형"],
    rows: [
      [
        { value: "자격", emphasis: true },
        "「수상레저안전법 시행령」 제37조 1항 인명구조요원",
        "해양경찰청장이 고시하는 단체에서 인정하는 자격",
        "안전교육 이수자",
      ],
      [
        { value: "배치 인원", emphasis: true, tone: "tide" },
        "참가자 10명당 1명",
        { value: "참가자 8명당 1명", tone: "tide" },
        "참가자 20명당 1명",
      ],
    ],
    footnote: "비상구조선에는 별도 안전관리요원 1명 추가 배치 (안전교육 이수 必). 수중형 자격: 「레스큐」급 자격 이상.",
  },
  {
    id: "ch1-staffOrgs",
    type: "bullets",
    title: "수중형 안전관리요원 — 자격 인정 단체",
    intro: "해양경찰청장이 고시한 수중관련 단체 (2017년 11월 기준, 알파벳 순). 「레스큐」급 이상 자격이 인정됩니다.",
    bullets: [
      { lead: "국내", text: "(사)한국잠수협회 · (사)한국수중환경안전협회 · (사)대한안전연합" },
      { lead: "국제 A–I", text: "ACUC KOREA · ANDI International KOREA · BSAC KOREA · CMAS KOREA · IANTD KOREA · IDEA ASIA · IDIC" },
      { lead: "국제 N–S", text: "NASDS KOREA · NASE KOREA · NAUI · NDL KOREA · PADI Asia Pacific · PDIC-SEI ASIA · PSAI KOREA · 국제안전잠수협회(SNSI) · RAID/SDD International · SDITDI KOREA · 세계스킨스쿠버연맹(SI) · SSI KOREA" },
      { lead: "국제 U–", text: "UTR KOREA · PSDC · ISEA · AFIA" },
    ],
  },
  {
    id: "ch1-education",
    type: "table",
    title: "안전교육 — 유형별 시간·내용",
    intro: "안전교육의 유효기간은 이수일로부터 2년이며, 이직 등으로 1년 이상 종사하지 않은 경우 신규로 다시 이수해야 합니다.",
    columns: ["구분", "수상형", "수중형", "일반형"],
    rows: [
      [
        { value: "교육내용", emphasis: true },
        "수상안전 수칙 · 관련법령 · 응급처치 · 인명구조",
        "수중안전 수칙 · 관련법령 · 응급처치 · 인명구조",
        "관련법령 · 응급처치술 · 인명구조",
      ],
      [
        { value: "교육시간", emphasis: true, tone: "tide" },
        "6시간",
        { value: "6시간", tone: "tide" },
        "4시간",
      ],
    ],
    footnote: "신규 종사 6개월 이내 1회 이상 이수. 위탁교육기관 명단은 해양경찰청 공시.",
  },
  {
    id: "ch1-equipment",
    type: "table",
    title: "안전장비 종류·배치기준",
    intro: "「연안사고 예방법 시행규칙」 제6조 제4항 별표3에 따른 활동 유형별 안전장비 최소 기준입니다.",
    columns: ["장비", "수상형", "수중형", "일반형"],
    rows: [
      [
        { value: "비상구조선", emphasis: true },
        "탑승정원이 참가자 100% 이상인 선박 (동력·무동력)",
        "탑승정원이 참가자 100% 이상인 선박",
        "없음",
      ],
      [
        { value: "구명조끼/슈트", emphasis: true },
        "참가자 110% 이상 (약 10% 소아용)",
        "참가자 110% 이상",
        "없음",
      ],
      ["구명튜브", "참가자 10명당 1개", "참가자 10명당 1개", "참가자 20명당 1개"],
      ["구명줄", "지름 10mm 이상, 길이 30m 이상 / 10명당 1개", "10명당 1개", "—"],
    ],
  },
  {
    id: "ch1-quiz3",
    type: "quizCheckpoint",
    title: "지식 복습 ③ — 안전관리요원·교육·장비",
    intro: "Ⅰ장 후반부의 자격·교육·장비 기준을 점검합니다.",
    questions: [
      {
        id: "q3-1",
        q: "수중형 안전관리요원 1명당 배치할 수 있는 참가자 인원 비율은?",
        choices: ["5명당 1명", "8명당 1명", "10명당 1명", "20명당 1명"],
        correctIndex: 1,
        explanation: "수중형은 가장 위험도가 높아 8명당 1명 배치. (수상형 10명, 일반형 20명)",
      },
      {
        id: "q3-2",
        q: "수중형 안전관리요원의 자격은?",
        choices: [
          "「수상레저안전법」 인명구조요원",
          "해양경찰청장이 고시하는 수중관련 단체의 「레스큐」급 이상 자격",
          "의료인 자격 보유자",
          "군 잠수사 출신",
        ],
        correctIndex: 1,
        explanation: "PSAI KOREA 등 해경청 고시 단체의 레스큐급 이상.",
      },
      {
        id: "q3-3",
        q: "안전교육의 유효기간은?",
        choices: ["1년", "2년", "3년", "5년"],
        correctIndex: 1,
        explanation: "이수일로부터 2년. 만료 전 갱신 이수해야 합니다.",
      },
      {
        id: "q3-4",
        q: "수중형 활동의 비상구조선 탑승정원 기준은?",
        choices: [
          "참가자 50% 이상",
          "참가자 80% 이상",
          "참가자 100% 이상",
          "참가자 150% 이상",
        ],
        correctIndex: 2,
        explanation: "동력·무동력 불문하고 참가자 100% 이상 탑승 가능 선박.",
      },
    ],
  },
  {
    id: "ch1-recap",
    type: "checklist",
    title: "Ⅰ장 핵심 정리 — 운영자가 반드시 챙길 것",
    intro: "본 단원에서 다룬 핵심 의무를 한눈에 정리합니다.",
    items: [
      "활동 7일 전까지 관할 해양경찰서에 사전 신고 (계획·기간별·건별 중 적합한 종류 선택) — 2025년 시행규칙 개정",
      "5종 구비서류 모두 첨부 (계획서·요원명단·교육이수증·장비·보험)",
      "수중형 안전관리요원 = 참가자 8명당 1명 (레스큐급 이상 자격)",
      "비상구조선에는 별도 안전관리요원 1명 추가",
      "안전교육 유효기간 2년 — 만료 전 갱신 이수",
      "안전장비: 비상구조선·구명조끼·구명튜브·구명줄 모두 기준 충족",
      "변경사항 발생 시 즉시 변경신고",
    ],
    footnote: "위반 시 「연안사고 예방법」 제5장(제23조~제25조)에 따라 과태료가 부과됩니다.",
  },
];

// ---------------------------------------------------------------------------
// Ⅳ. 수중형
// ---------------------------------------------------------------------------
const chapter4Slides: Slide[] = [
  {
    id: "ch4-cover",
    type: "cover",
    eyebrow: "Chapter Ⅳ",
    chapter: "Ⅳ",
    title: "수중형",
    titleEn: "Underwater Activities",
    subtitle: "잠수 분류 · 환경압 vs 대기압 · 스쿠버 안전수칙 · 감압이론 · 장비안전 · 잠수질환 · 잠수 관련 법률",
    accent: "tide",
  },
  {
    id: "ch4-intro",
    type: "sectionIntro",
    title: "이 단원의 학습 항목",
    intro:
      "수중에서 활동하기 위해서는 수중환경, 인체의 변화, 장비, 위험성과 문제 해결 방법 등 다양한 기초 지식이 필요합니다. 본 단원은 전문인을 위한 기초 자료를 다룹니다.",
    sections: [
      { number: "Ⅰ-1", title: "수중 활동별 분류" },
      { number: "Ⅰ-2", title: "감압이론" },
      { number: "Ⅰ-3", title: "기압조절실" },
      { number: "Ⅰ-4", title: "장비 안전" },
      { number: "Ⅰ-5", title: "잠수질환 예방" },
      { number: "Ⅱ", title: "잠수관련 법률 (12개 법령)" },
    ],
  },
  // ---- Ⅰ-1. 분류 ----
  {
    id: "ch4-classification",
    type: "grid",
    title: "잠수 기술의 두 갈래",
    intro: "20세기 이후 잠수기술은 환경압잠수와 대기압잠수 두 방향으로 발전해 왔으며, 현재 대부분의 레저·산업 잠수는 환경압잠수에 속합니다.",
    columns: 2,
    cards: [
      {
        glyph: "🌊",
        title: "환경압 잠수 (Ambient Pressure)",
        body: "잠수사가 주위 압력에 직접 노출된 채, 수압과 동일한 압력의 기체를 호흡 매체로 사용. 별칭 '노출잠수'. 공기잠수 + 혼합기체잠수로 분류.",
        tone: "tide",
      },
      {
        glyph: "🛸",
        title: "대기압 잠수 (Atmospheric)",
        body: "심해잠수정·잠수종 등 압력이 차단된 캡슐 안에서 활동. 잠수사 신체는 1기압 환경 유지.",
        tone: "neutral",
      },
    ],
  },
  {
    id: "ch4-airDiving",
    type: "compare",
    title: "공기잠수의 두 형태",
    intro: "공기잠수는 대기 공기를 압축해 호흡 매체로 사용합니다. 수심·체류시간이 늘면 각 기체 부분압 상승으로 생리학적 문제(산소중독, 질소마취)가 발생합니다.",
    left: {
      title: "스쿠버 잠수 (SCUBA)",
      subtitle: "Self-Contained Underwater Breathing Apparatus",
      tone: "tide",
      bullets: [
        "수중자가호흡기구 — 독립 장비를 착용하고 입수",
        "행동 자유도가 높아 레저잠수의 핵심 장비",
        "공기잠수 한계: 미국 58m / 영국·캐나다 50m",
        "개방식 스쿠버는 30m까지 권장, 비(무)감압한계시간 준수",
        "30m 이상에서는 더블 탱크 사용 권장",
      ],
    },
    right: {
      title: "표면공급식잠수 (SSDS)",
      subtitle: "Surface Supplied Diving System",
      tone: "neutral",
      bullets: [
        "선상·육상의 기체공급원 → 호스로 잠수사 헬멧에 지속 공급",
        "행동범위는 제약, 그러나 장시간 체류 가능",
        "수상-수중 음성 통화, 정확한 수심 측정, 표면 통제 가능",
        "현재까지 산업잠수의 기본 방식",
        "후카(Hooka) 변형은 국내 산업안전보건법상 위법 사용",
      ],
    },
  },
  {
    id: "ch4-mixedGas",
    type: "table",
    title: "혼합기체 잠수 (Mixed Gas Diving)",
    intro: "심해잠수를 위해 인체에 마취성이 약한 비활성 기체와 산소를 혼합한 잠수입니다. 산소분압은 0.5 ATA(산소결핍) ~ 1.6 ATA(폐·CNS 산소중독) 사이로 유지해야 합니다.",
    columns: ["혼합기체", "구성", "주 사용 수심", "특징"],
    rows: [
      [
        { value: "Nitrox", emphasis: true, tone: "tide" },
        "산소 + 질소 (산소 21% 초과)",
        "30m 이내",
        "잠수시간 연장, 감압시간 단축. 산소중독·고압산소 화재 위험 증가",
      ],
      [
        { value: "Heliox", emphasis: true },
        "산소 + 헬륨",
        "200m ~ 300m",
        "헬륨은 비마취성 → 깊은 수심 가능. 180m+ 에서 HPNS 발생",
      ],
      [
        { value: "Trimix", emphasis: true },
        "산소 + 헬륨 + 질소(5–10%)",
        "심해 (HPNS 방지용)",
        "1965년 헬리옥스의 HPNS 방지 위해 개발. 1981년 686m 모의잠수 성공",
      ],
      [
        { value: "Hydrox", emphasis: true },
        "수소 + 산소",
        "250 ~ 300m+",
        "프랑스 HYDRA 계획에서 300m까지 챔버잠수",
      ],
      [
        { value: "Hydreliox", emphasis: true },
        "수소 + 헬륨 + 산소",
        "450m ~ 700m",
        "1989년 코멕스 — 600~700m에서도 안전·효율적 작업 가능 검증",
      ],
    ],
    footnote: "HPNS (High Pressure Nervous Syndrome) — 고압신경증후군. 비마취성 기체 사용 시 발생하는 신경계 증상.",
  },
  {
    id: "ch4-fields",
    type: "grid",
    title: "활동 분야별 잠수 분류",
    intro: "일반적으로 잠수는 4대 분야로 구분되며, 잠수 산업은 군사잠수를 제외한 3대 분야(레저·과학·산업)를 통칭합니다.",
    columns: 4,
    cards: [
      { glyph: "🏝", title: "레저잠수", body: "Leisure Diving — 비영리·자기 만족. 강사가 일반인에게 이론·실기 지도하는 서비스산업", tone: "tide" },
      { glyph: "🔬", title: "과학잠수", body: "Scientific Diving — 수중고고학·해양생물·심해저 탐사. 수중생태조사·수중문화재지표조사" },
      { glyph: "🔧", title: "산업잠수", body: "Commercial Diving — 구조물 용접·절단·보수, 해난구조, 안전진단. 영리 추구가 주목적" },
      { glyph: "⚓", title: "군사잠수", body: "Military Diving — 수중 침투·폭파·기뢰제거·함정 구조. 산업잠수와 장비·구성은 유사하나 목적이 군사적" },
    ],
  },
  {
    id: "ch4-quiz1",
    type: "quizCheckpoint",
    title: "지식 복습 ④ — 잠수 분류와 분야",
    intro: "잠수 기술의 분류와 활동 분야를 점검합니다.",
    questions: [
      {
        id: "q4-1",
        q: "환경압 잠수에 해당하지 않는 것은?",
        choices: [
          "공기잠수 (스쿠버)",
          "표면공급식잠수",
          "혼합기체잠수",
          "대기압 잠수정 잠수",
        ],
        correctIndex: 3,
        explanation: "환경압 잠수는 잠수사가 주위 압력에 직접 노출되는 방식. 대기압 잠수는 캡슐 안에서 1기압 유지.",
      },
      {
        id: "q4-2",
        q: "미국 기준 공기잠수의 한계 수심은?",
        choices: ["30m", "50m", "58m", "70m"],
        correctIndex: 2,
        explanation: "미국 58m / 영국·캐나다 50m. 개방식 스쿠버는 30m까지 권장.",
      },
      {
        id: "q4-3",
        q: "다음 혼합기체 중 헬륨을 사용하지 않는 것은?",
        choices: ["Heliox", "Trimix", "Nitrox", "Hydreliox"],
        correctIndex: 2,
        explanation: "Nitrox = 산소 + 질소 (헬륨 없음). 나머지는 모두 헬륨 함유.",
      },
      {
        id: "q4-4",
        q: "잠수 분야 4대 분류에 해당하지 않는 것은?",
        choices: ["레저잠수", "과학잠수", "산업잠수", "의료잠수"],
        correctIndex: 3,
        explanation: "4대 분야: 레저·과학·산업·군사. 의료잠수는 별도 분류가 아닙니다.",
      },
    ],
  },
  // ---- Ⅰ-사. 안전수칙 ----
  {
    id: "ch4-safetyDivider",
    type: "sectionIntro",
    eyebrow: "Ⅰ-사",
    title: "스쿠버 안전수칙",
    intro:
      "「연안사고 예방법 시행규칙」 제6조 1항에 따라 강사·운영자가 체험자에게 반드시 안내해야 할 안전수칙입니다. 안전은 절대 타협이나 완화의 대상이 아닙니다.",
    sections: [
      { number: "1", title: "체험자 안내 8개 항목" },
      { number: "2", title: "운영자 사전 책무" },
      { number: "3", title: "최근 사고 통계" },
    ],
  },
  {
    id: "ch4-safetyChecklist",
    type: "checklist",
    title: "체험자에게 반드시 안내할 8개 항목",
    intro: "「연안사고 예방법 시행규칙」 제6조 1항에 따른 의무 안내사항입니다.",
    items: [
      "구명조끼 착용에 관한 사항",
      "연안체험활동을 하는 연안해역의 위험요소에 대한 안전조치에 관한 사항",
      "연안사고 발생 시 응급처치에 관한 사항",
      "연안체험활동 참가자의 건강상태 확인에 관한 사항",
      "연안체험활동 참가자에 대한 사전 안전교육 실시에 관한 사항",
      "연안체험활동 참가자에 대한 휴식 제공에 관한 사항",
      "음주행위 금지 등 참가자 및 안전관리요원이 준수해야 할 사항",
      "참가자에 대한 정신적·신체적 폭행 금지 및 활동 강제 금지",
    ],
    footnote: "2014년 영국 사례: 사전 안전 공지 의무 위반으로 운영자에게 2,000파운드 벌금 부과 (영국 HSE).",
  },
  {
    id: "ch4-managerDuties",
    type: "bullets",
    title: "운영자(강사) 사전 책무 — 영국 HSE 기준 참고",
    intro: "잠수 전 다음 3가지가 사전에 명확히 준비되어야 합니다.",
    bullets: [
      { lead: "①", text: "잠수 전 담당 관리자(강사·가이드) 선임" },
      { lead: "②", text: "잠수 전반에 걸친 계획 수립 (다이브 플랜)" },
      { lead: "③", text: "위험 요소와 응급 상황에 대한 사전 설명" },
    ],
  },
  {
    id: "ch4-stats",
    type: "stats",
    title: "최근 3년간 연안사고 발생 건수",
    intro: "안전교육·지도·홍보의 효과로 발생 건수와 인명피해 모두 감소세이지만, 5월·7월·8월·10월에 사고가 집중됩니다.",
    scaleLabel: "발생 건수 (사망)",
    bars: [
      { label: "2015년", value: 1114, sub: "사망 145" },
      { label: "2016년", value: 723, sub: "사망 130" },
      { label: "2017년", value: 698, sub: "사망 115" },
      { label: "3년 합계", value: 2535, sub: "사망 390" },
    ],
    footnote: "출처: 해양경찰청. 사고유형: 익수(가장 많음) > 추락 > 고립 > 표류 > 기타",
  },
  {
    id: "ch4-statsCause",
    type: "table",
    title: "전국 구조 통계 — 사고 원인별 (2015 → 2016)",
    intro: "소방청 통계에 따르면 수난사고 구조 건수는 오히려 증가했습니다 (해수면+내수면 포함).",
    columns: ["구분", "합계", "화재", "교통", "수난", "산악"],
    rows: [
      [
        { value: "2016 구조건수", emphasis: true, tone: "tide" },
        "609,211",
        "65,277",
        "57,325",
        { value: "7,307", tone: "coral" },
        "9,134",
      ],
      [
        { value: "2015 구조건수", emphasis: true },
        "479,786",
        "53,368",
        "51,939",
        { value: "6,860", tone: "coral" },
        "10,310",
      ],
    ],
    footnote: "수난사고는 1년 중 5·7·8·10월에 집중 발생합니다.",
  },
  // ---- Ⅰ-2. 감압이론 ----
  {
    id: "ch4-decoIntro",
    type: "definition",
    title: "감압이론 (Decompression Theory)",
    term: "감압",
    termEn: "Decompression",
    definition:
      "수심이 깊어질수록 호흡한 기체 중 비활성 기체(주로 질소)가 인체 조직에 용해(saturation)되며, 상승할 때 압력이 낮아지면서 다시 기체 형태로 빠져나오는 과정.",
    notes: [
      "헨리의 법칙(Henry's Law): 액체에 용해되는 기체의 양은 그 기체의 부분압에 비례",
      "감압을 너무 빨리 하면 조직 내 질소가 기포(bubble)로 형성되어 감압병(DCS)을 일으킴",
      "안전한 상승 속도: 9 m/min (30 ft/min) 이하 — 단체별 권고 다름",
      "안전정지(Safety Stop): 5m 수심에서 3분 정지 — 무감압 잠수에서도 권장",
    ],
  },
  {
    id: "ch4-decoStop",
    type: "flow",
    title: "다이브 프로파일 — 권장 상승 절차",
    intro: "표준 무감압 다이브의 안전한 종료 절차입니다. 감압잠수의 경우 별도 감압정지(deco stop)가 추가됩니다.",
    steps: [
      { label: "최대 수심 도달", actor: "Bottom", detail: "다이브 컴퓨터의 NDL 내에서 활동" },
      { label: "느린 상승", actor: "Ascent", detail: "9 m/min 이하 — 호흡 멈추지 말 것" },
      { label: "안전정지", actor: "5m × 3min", detail: "버디와 함께 수평 유지, 잔압 확인" },
      { label: "수면 도달", actor: "Surface", detail: "BC 부풀려 양성부력 유지, 출수 신호" },
      { label: "수면 휴식", actor: "Surface Interval", detail: "반복잠수 시 표면경과시간 확인" },
    ],
  },
  {
    id: "ch4-chamber",
    type: "definition",
    title: "기압조절실 (Hyperbaric Chamber)",
    term: "기압조절실",
    termEn: "Hyperbaric Chamber / Recompression Chamber",
    definition:
      "잠수병 환자에 대해 인위적으로 고압 환경을 만들어 가압 → 단계적 감압을 수행하는 의료 장비. 감압병(DCS)·동맥기체색전증(AGE)의 핵심 치료 시설.",
    notes: [
      "감압병 발생 시 가능한 한 빨리 가압 치료 시작 (Golden hour)",
      "산업잠수에서는 잠수 종료 직후 예방적 가압 사용 (포화잠수)",
      "국내 운용 챔버: 해군 잠수의학연구소, 일부 종합병원·해양경찰서 보유",
      "응급 시 119 또는 122(해양경찰) 통해 챔버 위치 안내 받음",
    ],
  },
  {
    id: "ch4-quiz2",
    type: "quizCheckpoint",
    title: "지식 복습 ⑤ — 안전수칙·감압이론",
    intro: "안전수칙·통계·감압의 핵심 사항을 점검합니다.",
    questions: [
      {
        id: "q5-1",
        q: "강사·운영자가 체험자에게 사전 안내해야 할 안전수칙 항목 수는?",
        choices: ["5개", "6개", "8개", "10개"],
        correctIndex: 2,
        explanation: "「연안사고예방법 시행규칙」 제6조 1항 — 8개 항목 의무 안내.",
      },
      {
        id: "q5-2",
        q: "스쿠버 잠수 시 권장 상승속도는?",
        choices: [
          "5 m/min 이하",
          "9 m/min 이하",
          "18 m/min 이하",
          "30 m/min 이하",
        ],
        correctIndex: 1,
        explanation: "9 m/min(30 ft/min) 이하 — 너무 빠른 상승은 감압병의 주된 원인.",
      },
      {
        id: "q5-3",
        q: "표준 안전정지(Safety Stop)는 어디서 얼마간 하는가?",
        choices: [
          "3m에서 1분",
          "5m에서 3분",
          "10m에서 3분",
          "5m에서 5분",
        ],
        correctIndex: 1,
        explanation: "5m 수심에서 3분 — 무감압 잠수에서도 권장.",
      },
    ],
  },
  // ---- Ⅰ-4. 장비안전 ----
  {
    id: "ch4-equipmentDivider",
    type: "sectionIntro",
    eyebrow: "Ⅰ-4",
    title: "장비 안전",
    intro: "스쿠버 잠수의 핵심 장비는 잠수사의 생명선입니다. 매 잠수 전후 점검과 정기 정비가 필수입니다.",
    sections: [
      { number: "1", title: "필수 장비 6종" },
      { number: "2", title: "장비별 점검·정비 주기" },
    ],
  },
  {
    id: "ch4-equipmentList",
    type: "grid",
    title: "스쿠버 핵심 장비 6종",
    intro: "각 장비의 역할과 주요 점검 포인트입니다.",
    columns: 3,
    cards: [
      { glyph: "🤿", title: "마스크 · 스노클 · 핀", body: "시야 확보·호흡·추진. 스트랩·실리콘 균열 점검, 스노클 밸브 작동 확인" },
      { glyph: "💨", title: "호흡기 (Regulator)", body: "1·2단계로 공기 압력 감압. 매년 오버홀, 사용 전 자유유동(free flow) 테스트" },
      { glyph: "🎈", title: "BC (부력조절기)", body: "부력 제어. 인플레이터·덤프밸브·공기 누출 점검" },
      { glyph: "🧯", title: "공기탱크 (Cylinder)", body: "압축공기 저장. 매년 육안검사, 5년마다 수압검사. 잔압 확인 必" },
      { glyph: "🖥", title: "다이브 컴퓨터", body: "수심·시간·NDL 계산. 배터리·O링·동기화 상태 점검" },
      { glyph: "🥽", title: "잠수복 + 무게벨트", body: "체온 유지·중성부력. 봉제 손상·지퍼·웨이트 잠금장치 확인" },
    ],
  },
  // ---- Ⅰ-5. 잠수질환 ----
  {
    id: "ch4-diseaseDivider",
    type: "sectionIntro",
    eyebrow: "Ⅰ-5",
    title: "잠수질환 예방",
    intro: "잠수 중 발생할 수 있는 주요 질환과 예방법을 다룹니다.",
    sections: [
      { number: "1", title: "감압병 (DCS, Decompression Sickness)" },
      { number: "2", title: "폐 과팽창 손상 (POIS)" },
      { number: "3", title: "산소중독 / 질소마취" },
      { number: "4", title: "예방 원칙" },
    ],
  },
  {
    id: "ch4-dcs",
    type: "definition",
    title: "감압병 (DCS) — Decompression Sickness",
    term: "감압병",
    termEn: "DCS, '벤즈(The Bends)'",
    definition:
      "감압을 너무 빠르게 하여 조직 내 질소가 기포 형태로 분리되어 혈관·관절·신경계 등을 막는 질환.",
    notes: [
      "Type Ⅰ — 관절통(가장 흔함), 피부 발진, 림프 부종",
      "Type Ⅱ — 중추신경계 침범 (마비·언어장애·의식저하), 폐 침범('Chokes')",
      "발현: 잠수 후 24시간 이내 (대부분 1시간 이내)",
      "처치: 100% 산소 공급 + 즉시 가압 치료 (기압조절실 이송)",
      "예방: 보수적 다이빙(NDL의 80% 이내), 안전정지 준수, 잠수 후 24시간 비행·고지대 금지",
    ],
  },
  {
    id: "ch4-pois",
    type: "definition",
    title: "폐 과팽창 손상 (POIS)",
    term: "폐 과팽창 손상",
    termEn: "Pulmonary Over-Inflation Syndrome",
    definition:
      "수중에서 호흡을 멈춘 채 상승하면 폐 속 공기가 팽창하여 폐포가 파열되는 손상. 가장 위험한 잠수 사고 중 하나.",
    notes: [
      "동맥기체색전증(AGE) — 파열된 폐포에서 기체가 동맥으로 진입, 뇌 색전증 유발 (사망 가능)",
      "기흉(Pneumothorax) — 흉막강 내 공기 축적, 호흡 곤란",
      "종격동 기종(Mediastinal Emphysema) — 기관 주변 공기 축적",
      "예방: 절대 호흡을 멈추지 말 것 (Never hold your breath)",
      "처치: 즉시 출수 + 100% 산소 + 가압 치료",
    ],
  },
  {
    id: "ch4-toxicity",
    type: "compare",
    title: "산소중독 vs 질소마취",
    intro: "고압에서 호흡 기체의 부분압이 비정상적으로 변하면 발생하는 두 가지 대표적 생리현상입니다.",
    left: {
      title: "산소중독 (Oxygen Toxicity)",
      subtitle: "PO₂ 1.6 ATA 초과 시",
      tone: "coral",
      bullets: [
        "중추신경계(CNS) 산소중독 — 경련·의식 상실 (수중에서 치명적)",
        "폐(Pulmonary) 산소중독 — 흉통·기침·호흡곤란",
        "공기잠수 시 70m 이상에서 PO₂가 1.6 ATA 초과",
        "Nitrox 사용 시 MOD(최대운용수심) 엄격 준수",
        "예방: PO₂ 한계 1.4 ATA 권장(레저), 1.6 ATA 절대한계",
      ],
    },
    right: {
      title: "질소마취 (Nitrogen Narcosis)",
      subtitle: "수심 30m 이상에서 발생",
      tone: "tide",
      bullets: [
        "'심해의 황홀경(Rapture of the Deep)' — 알코올 중독 유사 증상",
        "판단력·운동능력 저하 → 위험 인식 저하",
        "공기잠수 한계 미국 58m / 영국·캐나다 50m 의 주된 이유",
        "상승하면 즉시 회복 — 후유증 없음",
        "예방: Trimix(헬륨 함유) 혼합기체 사용",
      ],
    },
  },
  {
    id: "ch4-prevention",
    type: "checklist",
    title: "잠수질환 예방 — 핵심 원칙",
    intro: "사고는 한순간이지만, 사고를 막는 것은 일상의 작은 습관에서 비롯됩니다.",
    items: [
      "절대 호흡을 멈추지 말 것 (특히 상승 중)",
      "상승속도 9 m/min 이하 준수",
      "5m에서 3분 안전정지 (무감압 잠수에서도)",
      "보수적인 다이빙 — NDL의 80% 이내에서 종료",
      "잠수 후 24시간 비행·고지대 이동 금지",
      "음주 후 잠수 절대 금지 (전·후 모두)",
      "감기·축농증·중이염 등 압력평형 곤란 시 잠수 중단",
      "버디 시스템 준수 — 단독잠수 금지",
      "사전 다이브 플랜 + 비상 절차 공유",
    ],
    footnote: "이상 증상 발생 시 즉시 출수 → 100% 산소 → 119/122 신고 → 가장 가까운 기압조절실 이송.",
  },
  // ---- Ⅱ. 잠수관련 법률 ----
  {
    id: "ch4-lawDivider",
    type: "sectionIntro",
    eyebrow: "Ⅱ",
    title: "잠수 관련 법률",
    intro:
      "수중활동은 단일 법률이 아니라 여러 법률의 교차점에서 규율됩니다. 주된 법률은 「수중레저법」이며, 활동 형태에 따라 인접 법률 12개가 동시에 적용됩니다.",
    sections: [
      { number: "1", title: "수중레저법 — 핵심 조항" },
      { number: "2", title: "인접 법률 12개" },
      { number: "3", title: "운영자 사전 점검 체크리스트" },
    ],
  },
  {
    id: "ch4-lawUnderwater",
    type: "quote",
    title: "수중레저법 — 핵심 조항",
    source: "「수중레저활동의 안전 및 활성화 등에 관한 법률」 (2017 시행)",
    text: "본 법은 수중레저활동의 안전을 확보하고 수중레저사업의 건전한 발전을 도모함을 목적으로 한다. (제1조)",
    bullets: [
      "제18조 — 수중레저활동자 안전수칙: 음주 금지, 안전장비 의무, 사고 발생 시 즉시 신고",
      "제20조 — 수중레저안전요원 자격 및 교육 (본 교육의 법적 근거)",
      "제21조 — 수중레저사업자 등록 의무",
      "제22조 — 보험가입 의무 (참가자 책임보험)",
      "벌칙 — 미등록 영업, 안전수칙 위반 시 형사처벌·과태료",
    ],
  },
  {
    id: "ch4-laws12",
    type: "lawList",
    title: "인접 법률 12개",
    intro: "수중활동에는 다음 12개 법률이 활동 형태에 따라 동시에 적용됩니다. 운영자는 자신의 활동 영역에 해당하는 법률을 사전에 확인해야 합니다.",
    laws: [
      { name: "자격기본법", subject: "민간자격 등록·관리 체계" },
      { name: "표시·광고의 공정화에 관한 법률", subject: "자격·교육과정 광고 표시 기준" },
      { name: "수중레저법", subject: "수중레저활동 안전·사업 등록 (핵심 법률)" },
      { name: "수산자원관리법", subject: "보호종·금어기·금지구역 (활동 가능 해역 영향)" },
      { name: "수산업법", subject: "어업권·면허해역 출입 시 유의사항" },
      { name: "해사안전법", subject: "항행구역·통항분리방식 (보트·잠수 활동 영향)" },
      { name: "체육시설의 설치·이용에 관한 법률", subject: "다이빙 풀·일부 시설 적용" },
      { name: "해양환경관리법", subject: "폐기물 투기 금지·생태계 보호" },
      { name: "어촌·어항법", subject: "어항 내 활동 시 신고·허가" },
      { name: "항만법", subject: "항만구역 잠수 신고" },
      { name: "해양생태계의 보전 및 관리에 관한 법률", subject: "보호구역·해양보호생물" },
      { name: "(참고) 미국 스쿠버 잠수 관련 법", subject: "OSHA·NOAA 기준 — 국제 가이드 참고" },
    ],
    reference: { kr: "국가법령정보센터", url: "https://www.law.go.kr/" },
  },
  {
    id: "ch4-operatorChecklist",
    type: "checklist",
    title: "운영자·강사 사전 점검 체크리스트",
    intro: "본 단원의 모든 내용을 종합한 매 시즌 점검표입니다. 활동 시작 전 빠짐없이 확인하세요.",
    items: [
      "□ 연안체험활동 사전신고 완료 (관할 해양경찰서)",
      "□ 수중레저사업 등록증·변경등록 사항 최신화",
      "□ 안전관리요원·강사 자격 유효기간 확인",
      "□ 책임보험 가입증서 비치",
      "□ 안전장비 점검일지 — 구조튜브·산소·AED·제세동기",
      "□ 비상연락망 게시 — 해양경찰청 122, 119, 관할 해경서",
      "□ 출입통제·위험구역 고시 확인 (당일 기상·수상상태 포함)",
      "□ 참가자 의료진술서·면책동의서 보관",
      "□ 사전 안전브리핑 8개 항목 모두 안내",
      "□ 다이브 플랜 + 비상절차 공유",
      "□ 사고 발생 시 즉시 신고 절차 숙지 (수중레저법 제18조)",
    ],
    footnote: "본 체크리스트는 위·변조 없이 그대로 운영장에 게시·보관하는 것을 권장합니다.",
  },
  {
    id: "ch4-quiz3",
    type: "quizCheckpoint",
    title: "지식 복습 ⑥ — 잠수질환과 관련 법률",
    intro: "Ⅳ장 후반부의 잠수질환 예방과 법률을 점검합니다.",
    questions: [
      {
        id: "q6-1",
        q: "감압병(DCS)의 가장 흔한 증상은?",
        choices: ["의식 상실", "관절통", "흉통", "발작"],
        correctIndex: 1,
        explanation: "Type Ⅰ DCS '벤즈' — 관절통이 가장 흔합니다.",
      },
      {
        id: "q6-2",
        q: "잠수 후 비행이나 고지대 이동을 피해야 하는 시간은?",
        choices: ["6시간", "12시간", "24시간", "48시간"],
        correctIndex: 2,
        explanation: "잠수 후 24시간 내 비행·고지대 이동 시 감압병 위험 급증.",
      },
      {
        id: "q6-3",
        q: "폐 과팽창 손상(POIS) 예방의 가장 중요한 원칙은?",
        choices: [
          "천천히 상승하기",
          "절대 호흡을 멈추지 말 것",
          "물 안에서 충분히 휴식",
          "마스크 압력평형 자주 하기",
        ],
        correctIndex: 1,
        explanation: "Never hold your breath — 호흡을 멈춘 채 상승하면 폐 파열 위험.",
      },
      {
        id: "q6-4",
        q: "본 안전교육의 법적 근거인 「수중레저법」 조문은?",
        choices: ["제18조", "제20조", "제21조", "제22조"],
        correctIndex: 1,
        explanation: "「수중레저법」 제20조 — 수중레저안전요원 자격 및 교육.",
      },
    ],
  },
  {
    id: "ch4-recap",
    type: "bullets",
    title: "Ⅳ장 핵심 정리",
    intro: "수중형 안전관리의 5가지 핵심 메시지를 정리합니다.",
    bullets: [
      { lead: "📚", text: "잠수는 두 갈래(환경압·대기압)이며, 레저·산업·과학·군사 4대 분야로 나뉩니다." },
      { lead: "🌬", text: "공기잠수의 한계는 산소중독(70m+)·질소마취(30m+)에 의해 결정됩니다." },
      { lead: "🛡", text: "안전수칙 8개 항목은 강사가 체험자에게 반드시 사전 안내해야 합니다." },
      { lead: "🩺", text: "감압병·폐 과팽창 손상이 가장 치명적 — 호흡 정지 금지, 안전정지 준수." },
      { lead: "⚖️", text: "수중레저법을 핵심으로 12개 인접 법률이 동시 적용됩니다." },
    ],
  },
];

// ---------------------------------------------------------------------------
// 부록 — 2026 최신 법령 업데이트
// ---------------------------------------------------------------------------
const addendumSlides: Slide[] = [
  {
    id: "addendum-cover",
    type: "cover",
    eyebrow: "Appendix · 2026",
    chapter: "📌",
    title: "2026 최신 법령 업데이트",
    titleEn: "Law Update Addendum",
    subtitle: "2019 발간본 이후의 주요 법령 변동사항을 학습자가 인지할 수 있도록 정리합니다.",
    accent: "coral",
  },
  {
    id: "addendum-intro",
    type: "bullets",
    title: "본 부록의 취지",
    intro:
      "본 교재 본문은 2019년 발간본을 기준으로 합니다. 이후 「연안사고 예방법」 시행규칙(2025년 개정)과 「수중레저법」(2025.4.23 시행 + 2026.4.23 시행)이 잇달아 개정되어, 본문과 차이 나는 부분이 발생했습니다. 본 부록의 내용은 본문을 우선합니다.",
    bullets: [
      { lead: "★", text: "[2025] 연안체험활동 신고 기한: 활동 14일 전 → 7일 전 단축 (다음 슬라이드)" },
      { lead: "★", text: "[2025] 수중레저활동 5명당 교육자 1명 배치 + 사업자 정기교육 의무 신설 (다음다음 슬라이드)" },
      { lead: "ⓘ", text: "본 부록은 학습 안내용 요약입니다. 실제 인허가·신고 시 「국가법령정보센터(law.go.kr)」 또는 소관 부처(해양수산부·해양경찰청) 게시 현행 조문을 반드시 확인하십시오." },
      { lead: "🔗", text: "각 슬라이드 하단의 [참고] 링크는 해당 법령의 공식 정보 페이지로 연결됩니다." },
    ],
    reference: { kr: "국가법령정보센터", url: "https://www.law.go.kr/" },
  },
  {
    id: "addendum-coastal",
    type: "bullets",
    title: "1. 연안사고 예방에 관한 법률 — 2025 확정 개정",
    intro:
      "「연안사고 예방법」은 2014년 제정·시행 이후 수 차례 개정되었으며, 2025년 시행규칙 개정으로 본 교재 본문과 차이 나는 부분이 발생했습니다. 아래 사항은 본문보다 부록을 우선합니다.",
    bullets: [
      { lead: "★법률 본문 구성", text: "[현행] 2019 발간본은 5장 25조였으나, 그 후 개정으로 현행은 6장 32조. 안전관리·교육·벌칙 영역에 신설 조문이 추가됨 — 시험 정답은 「6장 32조」로 갱신되었습니다." },
      { lead: "★신고 기한", text: "[2025 변경] 「시행규칙 제7조」 — 연안체험활동 사전신고 기한이 활동 14일 전 → 활동 7일 전으로 단축. 본 교재 본문 Ⅰ장의 모든 14일 표기는 7일로 갱신되었습니다." },
      { lead: "출입통제", text: "해경청장이 지정·고시하는 위험구역 범위는 수시 갱신 — 활동 전 「해양경찰청 안전정보(imsm.kcg.go.kr)」 또는 관할 해경서를 통해 최신 고시 확인 필수." },
      { lead: "요원 배치", text: "수상·수중·일반형 활동별 안전관리요원 배치 기준은 시행규칙 별표3 — 본 교재 표 그대로 유효. 신규 위험 유형 추가 시 별표 갱신될 수 있으므로 매 시즌 시작 전 별표 확인." },
      { lead: "신고 시스템", text: "온라인 신고 포털 imsm.kcg.go.kr 표준화 — 방문 신고도 가능하나 온라인이 원칙." },
      { lead: "벌칙", text: "신고 누락·허위 신고·안전수칙 위반에 대한 과태료 한도가 상향된 사례 있음 — 현행 시행령 별표 점검 권장." },
    ],
    reference: {
      kr: "국가법령정보센터 — 연안사고 예방에 관한 법률 시행규칙",
      url: "https://www.law.go.kr/lsSc.do?menuId=1&query=%EC%97%B0%EC%95%88%EC%82%AC%EA%B3%A0%EC%98%88%EB%B0%A9",
    },
  },
  {
    id: "addendum-underwater",
    type: "bullets",
    title: "2. 수중레저법 — 2025·2026 확정 개정",
    intro:
      "「수중레저활동의 안전 및 활성화 등에 관한 법률」은 2017년 시행 이후 2024.10.22 공포·2025.4.23 시행 개정과 2025.4.22 공포·2026.4.23 시행 개정이 잇달아 적용되어, 본 교재의 4장 「Ⅱ. 잠수관련 법률」보다 강화된 안전 의무가 도입되었습니다.",
    bullets: [
      { lead: "★요원 배치 (5:1)", text: "[2025.4.23 시행] 수중레저활동자 5명당 수중레저교육자(강사) 1명 이상을 사업장에 배치하거나 수중레저기구에 탑승. — 「연안사고예방법 시행규칙」 별표3의 수중형 8:1과는 별개로 「수중레저법」 자체 비율 적용." },
      { lead: "★사업자 정기교육", text: "[2025.4.23 시행] 수중레저사업 종사자는 정기적으로 「수중레저활동의 안전」 + 「사고 시 조치사항」 교육 의무. 본 「PSA 안전교육」도 그 위탁 교육 중 하나." },
      { lead: "사업등록", text: "수중레저사업(렌탈·교육·체험)은 관할 시·군·구청에 등록 필요. 시행규칙 2025.7.10 / 2025.9.25 개정으로 등록기준(인적·시설·장비) 갱신 — 사업자는 매 갱신마다 점검." },
      { lead: "안전수칙 (제18조)", text: "음주 금지·안전장비 의무·사고 즉시 신고. 위반 시 과태료 + 형사처벌. 음주 측정·확인 절차 정비됨." },
      { lead: "안전요원 자격 (제20조)", text: "본 「PSA 안전교육」의 법적 근거 조문. 자격유효기간·보수교육 주기 시행규칙 별표 — 통상 매 2년 갱신." },
      { lead: "보험", text: "사업자는 참가자 책임보험 가입 의무. 가입 한도는 시행령 별표로 정해지며 상향된 사례 있음 — 매년 갱신 점검." },
    ],
    reference: {
      kr: "국가법령정보센터 — 수중레저법 시행규칙 (현행 2025.9.25.)",
      url: "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=194016",
    },
  },
  {
    id: "addendum-checklist",
    type: "checklist",
    title: "3. 운영자·강사 사전 점검 체크리스트 (현행 기준)",
    intro: "위 법령들의 갱신을 반영해 매 시즌 점검할 항목입니다.",
    items: [
      "□ 연안체험활동 사전신고서 제출 — 활동 7일 전까지 (2025 시행규칙 개정)",
      "□ 수중레저사업 등록증·변경등록 사항 최신화 (시행규칙 2025.7.10 / 2025.9.25 갱신 반영)",
      "□ 수중레저활동자 5명당 강사 1명 이상 배치 (2025.4.23 시행)",
      "□ 사업 종사자 정기 안전·사고대응 교육 이수 (2025.4.23 시행)",
      "□ 안전관리요원·강사 자격 유효기간 확인 (통상 2년)",
      "□ 책임보험 가입증서 비치 (가입 한도 현행 시행령 별표 충족)",
      "□ 안전장비 점검 일지 (구조튜브·산소·AED·제세동기)",
      "□ 비상연락망 게시 (해양경찰청 122, 119, 관할 해경서 직통)",
      "□ 출입통제·위험구역 고시 확인 (당일 기상·수상상태 포함)",
      "□ 참가자 의료진술서·면책동의서 보관",
      "□ 사고 발생 시 즉시 신고 절차 숙지 (수중레저법 제18조)",
    ],
    footnote: "본 체크리스트는 매 분기 갱신. 다음 점검 예정: 2026 하반기 시행규칙 개정 검토.",
  },
];

// ---------------------------------------------------------------------------
// Course assembly
// ---------------------------------------------------------------------------
export const COURSE_CHAPTERS: SafetyChapter[] = [
  {
    id: "toc",
    number: "Intro",
    titleKr: "목차",
    titleEn: "Course Overview",
    required: false,
    slides: tocSlides,
  },
  {
    id: "ch1",
    number: "Ⅰ",
    titleKr: "연안사고 예방법",
    titleEn: "Coastal Accident Prevention Law",
    required: true,
    slides: chapter1Slides,
  },
  {
    id: "ch4",
    number: "Ⅳ",
    titleKr: "수중형",
    titleEn: "Underwater Activities",
    required: true,
    slides: chapter4Slides,
  },
  {
    id: "addendum",
    number: "📌",
    titleKr: "2026 법령 업데이트",
    titleEn: "Law Update Addendum",
    required: true,
    slides: addendumSlides,
  },
];

export const COURSE_MODEL: CourseModel = { chapters: COURSE_CHAPTERS };

export function getChapter(id: string): SafetyChapter | null {
  return COURSE_CHAPTERS.find((c) => c.id === id) ?? null;
}

export function totalSlideCount(): number {
  return COURSE_CHAPTERS.reduce((sum, c) => sum + c.slides.length, 0);
}

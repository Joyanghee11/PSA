// PSA_safety: final exam — 25 multiple-choice questions.
//
// Server-only. Correct answers never leave this module. The client receives
// only `id`, `q`, and `choices` via the sanitized accessor.
import "server-only";

export interface ExamQuestion {
  id: string;
  q: string;
  choices: string[];
  correctIndex: number;
  topic: "ch1" | "ch4";
}

export interface PublicExamQuestion {
  id: string;
  q: string;
  choices: string[];
}

export const EXAM_PASS_PERCENT = 90;
export const EXAM_QUESTION_COUNT = 25;

const QUESTIONS: ExamQuestion[] = [
  // ---------- 연안사고 예방법 (ch1) — 12 questions ----------
  {
    id: "e01",
    topic: "ch1",
    q: "「연안사고 예방법」이 시행된 시점은?",
    choices: ["2013년 11월", "2014년 5월", "2014년 8월", "2015년 1월"],
    correctIndex: 2,
  },
  {
    id: "e02",
    topic: "ch1",
    q: "본 법률(연안사고예방법)은 현행 기준 총 몇 개 장과 몇 개 조문으로 구성되는가?",
    choices: ["3장 18조", "4장 20조", "5장 25조", "6장 32조"],
    correctIndex: 3,
  },
  {
    id: "e03",
    topic: "ch1",
    q: "「제3장 연안사고 안전관리규정 등」의 조문 범위는?",
    choices: ["제1조 ~ 제4조", "제5조 ~ 제8조", "제9조 ~ 제18조", "제19조 ~ 제22조"],
    correctIndex: 2,
  },
  {
    id: "e04",
    topic: "ch1",
    q: "다음 중 「연안사고」 정의에 해당하는 것은?",
    choices: [
      "어업 활동 중 발생한 모든 사고",
      "연안해역에서 발생하는 인명에 위해를 끼치는 사고",
      "내수면에서 발생하는 수난사고",
      "원양 어선의 해난사고",
    ],
    correctIndex: 1,
  },
  {
    id: "e05",
    topic: "ch1",
    q: "「수상형」 체험활동의 예가 아닌 것은?",
    choices: ["스노클링", "수영", "물놀이", "씨워킹"],
    correctIndex: 3,
  },
  {
    id: "e06",
    topic: "ch1",
    q: "연안체험활동 사전 신고서는 누구에게 제출하는가?",
    choices: ["소관 시·군·구청장", "관할 해양경찰서장", "관할 소방서장", "해양수산부 장관"],
    correctIndex: 1,
  },
  {
    id: "e07",
    topic: "ch1",
    q: "신고 종류 3가지에 해당하지 않는 것은?",
    choices: ["계획(변경) 신고", "기간별 신고", "건별 신고", "수시 통보 신고"],
    correctIndex: 3,
  },
  {
    id: "e08",
    topic: "ch1",
    q: "5명 미만 수중형 활동의 신고 의무는?",
    choices: [
      "반드시 신고해야 한다",
      "원칙적으로 신고 제외 (단 종교단체 위험 활동 등 예외 적용)",
      "활동 후 사후 신고",
      "관할 해경서 재량",
    ],
    correctIndex: 1,
  },
  {
    id: "e09",
    topic: "ch1",
    q: "수중형 안전관리요원의 자격 인정 단체는 누가 고시하는가?",
    choices: ["해양수산부 장관", "해양경찰청장", "행정안전부 장관", "관할 시도지사"],
    correctIndex: 1,
  },
  {
    id: "e10",
    topic: "ch1",
    q: "수중형 활동의 안전관리요원 1인당 참가자 인원 비율은?",
    choices: ["5명당 1명", "8명당 1명", "10명당 1명", "20명당 1명"],
    correctIndex: 1,
  },
  {
    id: "e11",
    topic: "ch1",
    q: "수상·수중형 안전교육의 교육 시간은?",
    choices: ["4시간", "6시간", "8시간", "12시간"],
    correctIndex: 1,
  },
  {
    id: "e12",
    topic: "ch1",
    q: "수중형 활동의 비상구조선 탑승정원 기준은?",
    choices: [
      "참가자 50% 이상",
      "참가자 80% 이상",
      "참가자 100% 이상",
      "참가자 150% 이상",
    ],
    correctIndex: 2,
  },

  // ---------- 수중형 (ch4) — 13 questions ----------
  {
    id: "e13",
    topic: "ch4",
    q: "환경압 잠수의 정의로 옳은 것은?",
    choices: [
      "1기압이 유지되는 캡슐 안에서 활동",
      "잠수사가 주위 압력에 직접 노출되어 수압과 동일한 압력의 기체를 호흡",
      "표면에서 헬멧으로만 호흡하는 잠수",
      "산소만을 사용하는 잠수",
    ],
    correctIndex: 1,
  },
  {
    id: "e14",
    topic: "ch4",
    q: "공기잠수 시 산소중독이 발생하는 PO₂ 임계 값은?",
    choices: ["0.5 ATA", "1.0 ATA", "1.4 ATA", "1.6 ATA 초과"],
    correctIndex: 3,
  },
  {
    id: "e15",
    topic: "ch4",
    q: "질소마취가 일반적으로 발생하기 시작하는 수심은?",
    choices: ["10m 이상", "20m 이상", "30m 이상", "60m 이상"],
    correctIndex: 2,
  },
  {
    id: "e16",
    topic: "ch4",
    q: "산소와 질소의 혼합기체로, 산소 비율이 21% 이상인 것은?",
    choices: ["Heliox", "Trimix", "Nitrox", "Hydrox"],
    correctIndex: 2,
  },
  {
    id: "e17",
    topic: "ch4",
    q: "헬리옥스(Heliox)의 주된 사용 수심대는?",
    choices: ["30m 이내", "60m ~ 100m", "200m ~ 300m", "500m 이상"],
    correctIndex: 2,
  },
  {
    id: "e18",
    topic: "ch4",
    q: "고압신경증후군(HPNS)이 발생하기 시작하는 수심은?",
    choices: ["50m 이상", "100m 이상", "180m 이상", "300m 이상"],
    correctIndex: 2,
  },
  {
    id: "e19",
    topic: "ch4",
    q: "표준 안전정지(Safety Stop) 권장 사양은?",
    choices: [
      "3m에서 1분",
      "5m에서 3분",
      "10m에서 3분",
      "5m에서 5분",
    ],
    correctIndex: 1,
  },
  {
    id: "e20",
    topic: "ch4",
    q: "감압병(DCS) 발생 시 1차 응급처치로 가장 적절한 것은?",
    choices: [
      "차가운 물에 담그기",
      "100% 산소 공급 + 즉시 가압 치료(기압조절실) 이송",
      "온수찜질 후 휴식",
      "심호흡으로 자가 회복 시도",
    ],
    correctIndex: 1,
  },
  {
    id: "e21",
    topic: "ch4",
    q: "폐 과팽창 손상(POIS)의 가장 위험한 합병증은?",
    choices: [
      "폐렴",
      "기흉",
      "동맥기체색전증(AGE) — 뇌 색전증으로 사망 가능",
      "기관지염",
    ],
    correctIndex: 2,
  },
  {
    id: "e22",
    topic: "ch4",
    q: "잠수질환 예방의 핵심 원칙으로 가장 중요한 것은?",
    choices: [
      "더 깊은 수심에서 충분한 시간 머무르기",
      "절대 호흡을 멈추지 말 것 + 9 m/min 이하 상승 + 안전정지",
      "잠수 직후 비행기 이용",
      "음주 후 적정 잠수",
    ],
    correctIndex: 1,
  },
  {
    id: "e23",
    topic: "ch4",
    q: "「수중레저법」 제18조의 핵심 의무에 해당하지 않는 것은?",
    choices: [
      "음주 활동 금지",
      "안전장비 의무 착용",
      "사고 발생 시 즉시 신고",
      "활동 전 6개월간 의무 보험 가입 (이는 사업자 의무)",
    ],
    correctIndex: 3,
  },
  {
    id: "e24",
    topic: "ch4",
    q: "본 안전교육의 법적 근거가 되는 「수중레저법」 조문은?",
    choices: ["제18조", "제20조", "제21조", "제22조"],
    correctIndex: 1,
  },
  {
    id: "e25",
    topic: "ch4",
    q: "잠수 분야 4대 분류에 해당하지 않는 것은?",
    choices: ["레저잠수", "과학잠수", "산업잠수", "관광잠수"],
    correctIndex: 3,
  },
];

if (QUESTIONS.length !== EXAM_QUESTION_COUNT) {
  // Fail loudly at module load if we ever drift from the contract.
  throw new Error(
    `EXAM_QUESTION_COUNT mismatch: expected ${EXAM_QUESTION_COUNT}, got ${QUESTIONS.length}`
  );
}

export interface ExamSubmission {
  answers: { id: string; choiceIndex: number }[];
}

export interface ExamResult {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  perQuestion: { id: string; correct: boolean; correctIndex: number }[];
}

export function getPublicQuestions(seed?: number): PublicExamQuestion[] {
  // Optional shuffling by Fisher–Yates with a deterministic seed; if no seed
  // we just return the original order. The client receives a stable order
  // for the duration of the attempt.
  const list = QUESTIONS.map((q) => ({ id: q.id, q: q.q, choices: q.choices }));
  if (seed === undefined) return list;
  const rng = mulberry32(seed);
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function gradeExam(submission: ExamSubmission): ExamResult {
  const map = new Map(QUESTIONS.map((q) => [q.id, q]));
  const perQuestion = QUESTIONS.map((q) => {
    const ans = submission.answers.find((a) => a.id === q.id);
    const correct = ans ? ans.choiceIndex === q.correctIndex : false;
    return { id: q.id, correct, correctIndex: q.correctIndex };
  });
  const correct = perQuestion.filter((p) => p.correct).length;
  const total = QUESTIONS.length;
  const percent = Math.round((correct / total) * 100);
  return {
    correct,
    total,
    percent,
    passed: percent >= EXAM_PASS_PERCENT,
    perQuestion,
  };
  void map; // referenced for shape clarity
}

// Tiny seedable RNG for deterministic shuffling
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

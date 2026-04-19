import Anthropic from "@anthropic-ai/sdk";
import type { Article, ArticleEvaluation } from "@/lib/types";

// ==========================================================
// 하드 게이트 (구조적 검증, Claude API 호출 없음)
// ==========================================================

const VALID_CATEGORIES = new Set<string>([
  "freediving",
  "freediving-competition",
  "freediving-records",
  "freediving-training",
  "freediving-safety",
  "scuba-news",
  "scuba-equipment",
  "scuba-destination",
  "science",
  "environment",
  "people",
  "diving-spot",
  "recipe",
  "workout",
  "video",
  "competition",
  "records",
  "training",
  "safety",
  "equipment",
]);

export interface HardGateResult {
  pass: boolean;
  failureReason?: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

export function runHardGates(article: Article): HardGateResult {
  // H3 - 이중언어 누락
  if (!article.en?.body?.trim() || !article.ko?.body?.trim()) {
    return { pass: false, failureReason: "H3: EN 또는 KO body 누락" };
  }

  // H4 - 단어 수 극단 이탈
  const enWords = stripHtml(article.en.body).split(/\s+/).filter(Boolean).length;
  if (enWords < 200 || enWords > 800) {
    return { pass: false, failureReason: `H4: EN ${enWords} 단어 (200~800 범위 밖)` };
  }
  const koEojeol = stripHtml(article.ko.body).split(/\s+/).filter(Boolean).length;
  if (koEojeol < 150 || koEojeol > 700) {
    return { pass: false, failureReason: `H4: KO ${koEojeol} 어절 (150~700 범위 밖)` };
  }

  // H5 - JSON 스키마 (필수 필드)
  const required: (keyof Article)[] = ["slug", "category", "tags", "en", "ko", "sourceUrls"];
  for (const f of required) {
    if (article[f] === undefined || article[f] === null) {
      return { pass: false, failureReason: `H5: 필수 필드 '${String(f)}' 누락` };
    }
  }

  // H6 - enum·태그 개수
  if (!VALID_CATEGORIES.has(article.category)) {
    return { pass: false, failureReason: `H6: 정의되지 않은 category '${article.category}'` };
  }
  if (article.tags.length < 1 || article.tags.length > 8) {
    return { pass: false, failureReason: `H6: tag 개수 ${article.tags.length} (1~8 범위 밖)` };
  }

  // H1·H2는 구조적으로 판별 불가 — Claude 평가 단계에서 처리
  return { pass: true };
}

// ==========================================================
// Claude 기반 루브릭 채점
// ==========================================================

const EVALUATION_SYSTEM = `당신은 이중언어(영·한) 프리다이빙/스쿠버 다이빙 기사의 편집자입니다.
주어진 기사를 아래 루브릭에 따라 엄격하게 평가하고 JSON으로만 응답하세요.

## 하드 게이트 (하나라도 실패면 gate="fail" 즉시)
- H1: 검증 불가능한 사실 주장 1건 이상
- H2: sourceUrls의 원문에서 20 단어 이상 그대로 복사

## 점수 루브릭 (100점 만점)
### 섹션 1. 콘텐츠 무결성 (30점)
- 사실 정확성 (15): 모든 사실 주장이 sourceUrls에서 검증 가능 (이 항목만 감점 허용)
- 원본성 (10): 원문을 자기 언어로 완전히 재구성
- 출처 표기 (5): sourceUrls 배열에 유효한 URL 1개 이상

### 섹션 2. 언어 품질 (25점)
- 한국어 자연성 (10): 직역체 아닌 자연스러운 한국어
- 영어 저널리즘 톤 (10): 전문 기자 수준
- 양 언어 일치성 (5): EN/KO가 같은 사실 전달

### 섹션 3. 구조와 포맷 (15점)
- 단어 수 (5): EN 300~500 단어, KO 300+ 어절
- HTML 포맷팅 (5): <p>, <h3> 등 적절
- 카테고리·태그 (5): 정확한 카테고리, 3~6개 관련 태그

### 섹션 4. SEO (10점)
- 제목 (3): EN 60자 이하, KO 40자 이하
- summary (3): 160자 이하, 1-2 문장
- metaDescription (2): 155자 이하
- slug (2): URL 친화적, 키워드 반영

### 섹션 5. 도메인 가치 (10점)
- 주제 적합성 (5): 다이빙/프리다이빙 범위
- 독자 효용 (5): 실용적 가치

### 섹션 6. 안전·윤리 (10점)
- 안전 면책 (3): 공인 교육 기관 권장 문구
- 사고 보도 톤 (3): 존중·사실 기반
- 이미지 관련성 (2): 주제 부합
- 추측 vs 사실 (2): 헷지 어휘

## 패스 게이트 (매우 엄격)
두 조건 모두 만족해야 gate="pass":
1. 하드 게이트 H1·H2 통과
2. **사실 정확성(15점)을 제외한 모든 항목이 만점**
   → 사실 정확성에서만 감점 허용, 다른 항목은 0.5점이라도 감점되면 fail

## 출력 형식
반드시 다음 JSON 객체로만 응답하세요 (마크다운 블록 없이):
{
  "score": <0-100 실수>,
  "gate": "pass" | "fail",
  "breakdown": {
    "contentIntegrity": <0-30>,
    "languageQuality": <0-25>,
    "structureFormat": <0-15>,
    "seoMetadata": <0-10>,
    "domainValue": <0-10>,
    "safetyEthics": <0-10>
  },
  "deductions": [
    { "item": "<항목명>", "lost": <감점>, "reason": "<사유>", "fixable": <true|false> }
  ],
  "notes": "<한 줄 요약>"
}`;

interface ClaudeEvaluationResponse {
  score: number;
  gate: "pass" | "fail";
  breakdown: ArticleEvaluation["breakdown"];
  deductions: Array<{
    item: string;
    lost: number;
    reason: string;
    fixable: boolean;
  }>;
  notes: string;
}

async function scoreWithClaude(
  article: Article,
  client: Anthropic
): Promise<ClaudeEvaluationResponse | null> {
  const payload = {
    slug: article.slug,
    category: article.category,
    tags: article.tags,
    sourceUrls: article.sourceUrls,
    imageUrl: article.imageUrl,
    en: article.en,
    ko: article.ko,
  };

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: EVALUATION_SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `평가할 기사:\n\n${JSON.stringify(payload, null, 2)}`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[Evaluator] No JSON in response");
      return null;
    }
    return JSON.parse(jsonMatch[0]) as ClaudeEvaluationResponse;
  } catch (error) {
    console.error("[Evaluator] Claude evaluation failed:", error);
    return null;
  }
}

export async function evaluateArticle(
  article: Article,
  client: Anthropic
): Promise<ArticleEvaluation> {
  const evaluatedAt = new Date().toISOString();

  // 1. 하드 게이트 먼저
  const hg = runHardGates(article);
  if (!hg.pass) {
    return {
      score: 0,
      gate: "fail",
      evaluatedAt,
      notes: `하드 게이트 실패 — ${hg.failureReason}`,
    };
  }

  // 2. Claude 루브릭 채점
  const rubric = await scoreWithClaude(article, client);
  if (!rubric) {
    return {
      score: 0,
      gate: "fail",
      evaluatedAt,
      notes: "평가 API 호출 실패 (네트워크 또는 파싱 오류). 수동 검토 필요.",
    };
  }

  const deductionsText = rubric.deductions
    .map((d) => `${d.item}(-${d.lost}): ${d.reason}`)
    .join(" / ");

  return {
    score: rubric.score,
    gate: rubric.gate,
    evaluatedAt,
    notes: rubric.notes + (deductionsText ? ` | 감점: ${deductionsText}` : ""),
    breakdown: rubric.breakdown,
  };
}

// ==========================================================
// 생성 → 평가 → 수정 → 재평가 루프 (최대 3 라운드)
// ==========================================================

export interface IterationResult {
  article: Article;
  rounds: number;
  finalEvaluation: ArticleEvaluation;
  allDeductions: string[];
}

export async function iterateToPass(
  initialArticle: Article,
  client: Anthropic,
  reviseFn: (article: Article, feedback: string) => Promise<Article | null>,
  maxRounds = 3
): Promise<IterationResult> {
  let article = initialArticle;
  let evaluation: ArticleEvaluation = {
    score: 0,
    gate: "fail",
    evaluatedAt: new Date().toISOString(),
    notes: "Not yet evaluated",
  };
  const allDeductions: string[] = [];

  for (let round = 1; round <= maxRounds; round++) {
    evaluation = await evaluateArticle(article, client);

    if (evaluation.notes) allDeductions.push(`R${round}: ${evaluation.notes}`);

    if (evaluation.gate === "pass") {
      return {
        article: {
          ...article,
          status: "published",
          evaluation: {
            ...evaluation,
            notes: `Round ${round}에서 통과. ${evaluation.notes}`,
          },
        },
        rounds: round,
        finalEvaluation: evaluation,
        allDeductions,
      };
    }

    // 마지막 라운드면 수정 시도 없이 종료
    if (round === maxRounds) break;

    // 하드 게이트 실패는 자동 수정 안 함 (수동 검토)
    if (evaluation.notes?.startsWith("하드 게이트 실패")) break;

    // 수정 시도
    const feedback = evaluation.notes || "품질 개선 필요";
    const revised = await reviseFn(article, feedback);
    if (!revised) {
      allDeductions.push(`R${round}: 수정 실패 (reviseFn returned null)`);
      break;
    }
    article = revised;
  }

  return {
    article: {
      ...article,
      status: "draft",
      evaluation: {
        ...evaluation,
        notes: `${maxRounds} 라운드 후에도 게이트 통과 실패. 수동 검토 대기. ${evaluation.notes}`,
      },
    },
    rounds: maxRounds,
    finalEvaluation: evaluation,
    allDeductions,
  };
}

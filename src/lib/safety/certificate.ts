// PSA_safety: server-side certificate PDF generation.
//
// Layout follows the template the user supplied:
//   [Cert No.]   →  e.g., "제 2026-05-123456호"
//   "수중레저 교육 이수증" (large, centered)
//   Field block: 성명 / 생년월일 / 교육과정명 / 보유 자격 / 자격 유효기간
//   Body paragraph (수중레저법 제20조 제1항 / 시행규칙 제13조 제1항)
//   Issue date (centered)
//   "PSAI KOREA" + seal stamp (right-aligned)
import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { SafetySessionPayload } from "./types";

export interface CertificateInput {
  session: SafetySessionPayload;
  certNo: string;        // "제 YYYY-MM-XXXXXX호"
  issueDate: Date;       // when cert is issued
  validityYears?: number; // default 2 (수중레저법 시행규칙 제13조 보수교육 주기)
}

function formatKoreanDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}년  ${m}월  ${day}일`;
}

function formatIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildCertNo(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `제 ${y}-${m}-${rand}호`;
}

export async function buildCertificatePdf(
  input: CertificateInput
): Promise<Uint8Array> {
  const validityYears = input.validityYears ?? 2;
  const validUntil = new Date(input.issueDate);
  validUntil.setFullYear(validUntil.getFullYear() + validityYears);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Embed Korean fonts (server-side files). Static (non-variable) Nanum fonts
  // are used so pdf-lib's subset embedding works correctly — variable fonts
  // produce mojibake when subsetted.
  const fontDir = path.join(process.cwd(), "src", "lib", "safety", "fonts");
  const sansBytes = await readFile(path.join(fontDir, "NanumGothic.ttf"));
  const serifBytes = await readFile(path.join(fontDir, "NanumMyeongjo.ttf"));
  const sans = await pdfDoc.embedFont(sansBytes, { subset: false });
  const serif = await pdfDoc.embedFont(serifBytes, { subset: false });

  // Embed seal image
  const sealPath = path.join(
    process.cwd(),
    "public",
    "safety",
    "seal-transparent.png"
  );
  const sealBytes = await readFile(sealPath);
  const seal = await pdfDoc.embedPng(sealBytes);

  // A4 portrait (595 x 842 pt)
  const W = 595;
  const H = 842;
  const page = pdfDoc.addPage([W, H]);
  const ink = rgb(0.06, 0.1, 0.12);
  const muted = rgb(0.32, 0.34, 0.34);
  const accent = rgb(0.18, 0.29, 0.31); // tide
  const border = rgb(0.55, 0.49, 0.4);

  // ---- Decorative border frame ----
  const margin = 36;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: W - margin * 2,
    height: H - margin * 2,
    borderColor: border,
    borderWidth: 1.4,
  });
  page.drawRectangle({
    x: margin + 6,
    y: margin + 6,
    width: W - margin * 2 - 12,
    height: H - margin * 2 - 12,
    borderColor: border,
    borderWidth: 0.5,
  });

  // ---- Certificate number (top left) ----
  page.drawText(input.certNo, {
    x: margin + 24,
    y: H - margin - 50,
    size: 11,
    font: sans,
    color: muted,
  });

  // ---- Title ----
  const title = "수중레저 교육 이수증";
  const titleSize = 36;
  const titleWidth = serif.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (W - titleWidth) / 2,
    y: H - margin - 130,
    size: titleSize,
    font: serif,
    color: ink,
  });

  // small subtitle
  const subtitle = "Underwater Leisure Safety Education — Certificate of Completion";
  const subSize = 9;
  const subWidth = sans.widthOfTextAtSize(subtitle, subSize);
  page.drawText(subtitle, {
    x: (W - subWidth) / 2,
    y: H - margin - 152,
    size: subSize,
    font: sans,
    color: muted,
  });

  // accent rule
  page.drawLine({
    start: { x: W / 2 - 60, y: H - margin - 168 },
    end: { x: W / 2 + 60, y: H - margin - 168 },
    color: accent,
    thickness: 1.2,
  });

  // ---- Field block ----
  const labelX = margin + 70;
  const valueX = margin + 200;
  const lineH = 30;
  let y = H - margin - 220;

  const fields: { label: string; value: string }[] = [
    { label: "성    명", value: `${input.session.nameKo}  (${input.session.nameEn})` },
    { label: "생년월일", value: input.session.dob },
    { label: "교육과정명", value: "수중레저안전요원 안전교육" },
    {
      label: "보유 자격",
      value: input.session.level
        ? `PSA — ${input.session.level}`
        : "PSA — Safety Member",
    },
    {
      label: "자격 유효 기간",
      value: `${formatIsoDate(input.issueDate)}  ~  ${formatIsoDate(validUntil)}  (${validityYears}년)`,
    },
  ];

  for (const f of fields) {
    page.drawText(f.label, {
      x: labelX,
      y,
      size: 12,
      font: sans,
      color: muted,
    });
    page.drawText(f.value, {
      x: valueX,
      y,
      size: 13,
      font: sans,
      color: ink,
    });
    y -= lineH;
  }

  // separator
  page.drawLine({
    start: { x: margin + 60, y: y - 8 },
    end: { x: W - margin - 60, y: y - 8 },
    color: border,
    thickness: 0.6,
  });

  // ---- Body paragraph ----
  const bodyLines = [
    "귀하는 「수중레저활동의 안전 및 활성화 등에 관한 법률」",
    "제20조 제1항에 따라 같은 법 시행규칙 제13조 제1항 각 호의",
    "교육을 이수하였으므로 이 증을 수여합니다.",
  ];
  let by = y - 50;
  for (const line of bodyLines) {
    const w = sans.widthOfTextAtSize(line, 12.5);
    page.drawText(line, {
      x: (W - w) / 2,
      y: by,
      size: 12.5,
      font: sans,
      color: ink,
    });
    by -= 22;
  }

  // ---- Issue date (centered) ----
  const issueText = formatKoreanDate(input.issueDate);
  const issueWidth = serif.widthOfTextAtSize(issueText, 14);
  page.drawText(issueText, {
    x: (W - issueWidth) / 2,
    y: by - 50,
    size: 14,
    font: serif,
    color: ink,
  });

  // ---- Issuer + seal ----
  const issuerY = by - 110;
  const issuer = "PSAI  KOREA";
  const issuerWidth = serif.widthOfTextAtSize(issuer, 22);
  page.drawText(issuer, {
    x: (W - issuerWidth) / 2 - 30,
    y: issuerY,
    size: 22,
    font: serif,
    color: ink,
  });
  // seal placed to the right of the issuer text
  const sealSize = 96;
  const sealAspect = seal.height / seal.width;
  page.drawImage(seal, {
    x: (W - issuerWidth) / 2 + issuerWidth - 30,
    y: issuerY - 28,
    width: sealSize,
    height: sealSize * sealAspect,
    opacity: 0.92,
  });

  // ---- Footer note ----
  const footer =
    "본 이수증은 PSAI KOREA가 발행하며, 법령 적용 시에는 「국가법령정보센터」 현행 조문을 확인하십시오.";
  const fSize = 8;
  const fW = sans.widthOfTextAtSize(footer, fSize);
  page.drawText(footer, {
    x: (W - fW) / 2,
    y: margin + 18,
    size: fSize,
    font: sans,
    color: muted,
  });

  return pdfDoc.save();
}

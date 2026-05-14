"use client";

import { useMemo, useState } from "react";
import type { CompletionRecord } from "@/lib/safety/completions";

interface Props {
  records: CompletionRecord[];
}

export function AdminCompletionsTable({ records }: Props) {
  const [query, setQuery] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      [
        r.certNo,
        r.nameKo,
        r.nameEn,
        r.instructorNo,
        r.email,
        r.contactNo,
        r.level,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [records, query]);

  async function handleDownload(certNo: string, nameKo: string) {
    setError("");
    setDownloading(certNo);
    try {
      const res = await fetch(
        `/api/admin/safety/certificate/${encodeURIComponent(certNo)}`
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(`다운로드 실패 (${data.error ?? res.status})`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const cd = res.headers.get("Content-Disposition") || "";
      const m = cd.match(/filename\*=UTF-8''([^;]+)/);
      const filename = m
        ? decodeURIComponent(m[1])
        : `PSA_safety_cert_${nameKo}_${certNo}.pdf`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("네트워크 오류로 다운로드에 실패했습니다.");
    } finally {
      setDownloading(null);
    }
  }

  function formatDate(iso: string): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toISOString().slice(0, 10);
  }

  function formatPhone(s: string): string {
    if (!s) return "—";
    const digits = s.replace(/\D/g, "");
    if (digits.length === 11)
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    if (digits.length === 10)
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return s;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="문서번호 / 성명 / 강사번호 / 이메일 / 연락처로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3.5 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {filtered.length} / {records.length}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-[color:var(--accent-warm)] px-1"
        >
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60 border-b border-border">
              <Th>문서번호</Th>
              <Th>성명 (한글 / 영문)</Th>
              <Th>강사번호</Th>
              <Th>연락처</Th>
              <Th>이메일</Th>
              <Th align="right">점수</Th>
              <Th>발급일</Th>
              <Th align="right">재발급</Th>
              <Th align="center">이수증</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.certNo}
                className="border-b border-border/60 even:bg-muted/20 hover:bg-accent/5"
              >
                <Td className="font-mono text-[12.5px]">{r.certNo}</Td>
                <Td>
                  <span className="font-medium text-foreground">{r.nameKo}</span>{" "}
                  <span className="text-muted-foreground text-[12.5px]">
                    {r.nameEn}
                  </span>
                </Td>
                <Td className="tabular-nums">{r.instructorNo}</Td>
                <Td className="tabular-nums text-[12.5px]">
                  {formatPhone(r.contactNo)}
                </Td>
                <Td className="text-[12.5px]">{r.email}</Td>
                <Td align="right" className="tabular-nums">
                  <span
                    className={
                      r.examScore >= 90 ? "text-accent font-medium" : ""
                    }
                  >
                    {r.examScore}
                  </span>
                </Td>
                <Td className="text-[12.5px] tabular-nums">
                  {formatDate(r.firstIssuedAt)}
                </Td>
                <Td align="right" className="tabular-nums text-muted-foreground">
                  {r.reissueCount > 1 ? `${r.reissueCount - 1}회` : "—"}
                </Td>
                <Td align="center">
                  <button
                    onClick={() => handleDownload(r.certNo, r.nameKo)}
                    disabled={downloading === r.certNo}
                    className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {downloading === r.certNo ? "발급 중..." : "📥 PDF"}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          검색 결과가 없습니다.
        </p>
      )}
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      className={`px-3 py-2.5 text-${align} text-[11px] font-bold uppercase tracking-wider text-muted-foreground`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  return (
    <td className={`px-3 py-2.5 align-middle text-${align} ${className}`}>
      {children}
    </td>
  );
}

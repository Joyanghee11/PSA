"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormState {
  instructorNo: string;
  email: string;
  nameKo: string;
  nameEn: string;
  dob: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-found": "강사 번호를 찾을 수 없습니다. PSA 등록 정보를 확인해 주세요.",
  mismatch:
    "입력하신 정보가 PSA 등록 정보와 일치하지 않습니다. 이메일·영문성명·생년월일을 다시 확인해 주세요.",
  inactive: "현재 비활성 상태의 회원입니다. PSA 본부로 문의해 주세요.",
  "invalid-input": "입력값을 확인해 주세요. 모든 항목은 필수입니다.",
};

export function SafetyLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    instructorNo: "",
    email: "",
    nameKo: "",
    nameEn: "",
    dob: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/safety/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/safety/course");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(
        ERROR_MESSAGES[data.error ?? ""] ||
          "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요."
      );
    } catch {
      setError("서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  const baseInput =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="강사 번호 (Instructor No.)" hint="예: 5939">
        <input
          required
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className={baseInput}
          value={form.instructorNo}
          onChange={(e) => update("instructorNo", e.target.value)}
          placeholder="PSA 강사 번호"
        />
      </Field>

      <Field label="이메일">
        <input
          required
          type="email"
          autoComplete="email"
          className={baseInput}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="psa@example.com"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="한글성명">
          <input
            required
            type="text"
            autoComplete="name"
            className={baseInput}
            value={form.nameKo}
            onChange={(e) => update("nameKo", e.target.value)}
            placeholder="홍길동"
          />
        </Field>
        <Field label="영문성명">
          <input
            required
            type="text"
            autoComplete="off"
            className={baseInput}
            value={form.nameEn}
            onChange={(e) => update("nameEn", e.target.value)}
            placeholder="HONG GIL DONG"
          />
        </Field>
      </div>

      <Field label="생년월일" hint="YYYY-MM-DD">
        <input
          required
          type="date"
          className={baseInput}
          value={form.dob}
          onChange={(e) => update("dob", e.target.value)}
        />
      </Field>

      {error && (
        <p
          role="alert"
          className="text-sm text-[color:var(--accent-warm)] leading-relaxed"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "확인 중..." : "안전교육 시작하기"}
      </button>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        ※ 한글성명은 검증되지 않으며 이수증에 표기될 이름으로 사용됩니다.
        강사 번호·이메일·영문성명·생년월일 4개 항목이 PSA 등록 정보와 일치해야
        합니다.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground mb-1.5 flex items-baseline justify-between">
        <span>{label}</span>
        {hint && <span className="text-muted-foreground font-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

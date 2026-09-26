"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PSA_SITE_URL } from "@/config/psa";
import { AuthShell, FormAlert, PsaMemberNote } from "@/components/auth/AuthShell";

// 다이브 저널 가입 = PSA 회원 가입. 입력 항목과 검증 기준은 divepsa.com 가입과 같고,
// 계정은 divepsa.com 의 /api/journal/signup 이 만든다. 만든 뒤 바로 로그인시킨다.

const COUNTRIES: [string, string][] = [
  ["KR", "대한민국"], ["JP", "일본"], ["PH", "필리핀"], ["ID", "인도네시아"], ["TH", "태국"],
  ["VN", "베트남"], ["MY", "말레이시아"], ["SG", "싱가포르"], ["CN", "중국"], ["TW", "대만"],
  ["HK", "홍콩"], ["AU", "호주"], ["NZ", "뉴질랜드"], ["US", "미국"], ["CA", "캐나다"],
  ["GB", "영국"], ["DE", "독일"], ["FR", "프랑스"], ["IT", "이탈리아"], ["ES", "스페인"],
  ["MV", "몰디브"], ["EG", "이집트"],
];

const ERRORS: Record<string, string> = {
  invalidEmail: "이메일 주소를 확인해 주세요.",
  emailTypo: "이메일 주소 끝부분(.com 등)에 오타가 있습니다.",
  emailTaken: "이미 가입된 이메일입니다. 그 계정으로 로그인해 주세요.",
  weakPassword: "비밀번호는 8자 이상으로 입력해 주세요.",
  invalidHandle: "닉네임은 영문·숫자·밑줄(_)로 2~24자까지 입력할 수 있습니다.",
  handleTaken: "이미 쓰고 있는 닉네임입니다. 다른 닉네임을 입력해 주세요.",
  nameEnRequired: "영문 이름을 알파벳으로 입력해 주세요.",
  invalidDob: "생년월일을 숫자 8자리로 입력해 주세요.",
  genderRequired: "성별을 골라 주세요.",
  invalidCountry: "국가를 골라 주세요.",
  invalidPhone: "연락처는 숫자만 입력해 주세요.",
  agreeRequired: "필수 항목에 모두 동의해 주세요.",
  fieldRequired: "필수 항목을 모두 입력해 주세요.",
};
const FALLBACK_ERROR = "가입을 처리하지 못했습니다. 잠시 뒤 다시 시도해 주세요.";

function formatDob(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

function safeNext(raw: string | null): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/ko";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground border-b border-border pb-2">{title}</h2>
      {children}
    </section>
  );
}

function SignupForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [dob, setDob] = useState("");
  const [agree, setAgree] = useState({ terms: false, privacy: false, age: false, marketing: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code: string; field?: string } | null>(null);
  const allAgreed = agree.terms && agree.privacy && agree.age && agree.marketing;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    if (!agree.terms || !agree.privacy || !agree.age) {
      setError({ code: "agreeRequired" });
      return;
    }
    const payload = {
      email: v("email"),
      password: String(f.get("password") ?? ""),
      handle: v("handle"),
      name_ko: v("name_ko"),
      name_en: v("name_en"),
      dob,
      gender: v("gender"),
      country: v("country"),
      phone: v("phone").replace(/\D/g, ""),
      address: v("address"),
      agree_terms: agree.terms,
      agree_privacy: agree.privacy,
      agree_age: agree.age,
      marketing_opt_in: agree.marketing,
    };

    setLoading(true);
    try {
      const res = await fetch(`${PSA_SITE_URL}/api/journal/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; field?: string } | null;
      if (!data?.ok) {
        setError({ code: data?.error ?? "unexpected", field: data?.field });
        setLoading(false);
        return;
      }
      const { error: signInError } = await createClient().auth.signInWithPassword({ email: payload.email, password: payload.password });
      if (signInError) {
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError({ code: "unexpected" });
      setLoading(false);
    }
  }

  const bad = (field: string) => (error?.field === field ? "!border-danger" : "");

  return (
    <AuthShell
      kicker="Join Dive Journal"
      title="다이브 저널 계정 만들기"
      lead="가입하면 기사에 댓글을 남기고, 갤러리에 작품을 올리고, 사진 콘테스트에 참여할 수 있습니다."
      width={600}
    >
      <PsaMemberNote>
        PSA 회원이신가요? 다이브 저널은 PSA와 회원 정보를 함께 씁니다. divepsa.com 계정이 있다면 새로 가입하지 않고{" "}
        <Link href={`/login${next !== "/ko" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-accent-blue underline underline-offset-2">
          그 계정으로 바로 로그인
        </Link>
        하면 됩니다.
      </PsaMemberNote>

      <form onSubmit={handleSubmit} className="grid gap-8 mt-7" noValidate={false}>
        <Section title="계정">
          <div className="field">
            <label htmlFor="email">이메일 <span className="text-danger">*</span></label>
            <input id="email" name="email" type="email" required className={`input ${bad("email")}`} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">비밀번호 <span className="text-danger">*</span></label>
            <input id="password" name="password" type="password" required minLength={8} className={`input ${bad("password")}`} autoComplete="new-password" />
            <span className="hint">8자 이상</span>
          </div>
          <div className="field">
            <label htmlFor="handle">닉네임 <span className="text-danger">*</span></label>
            <input id="handle" name="handle" required pattern="[A-Za-z0-9_]{2,24}" className={`input ${bad("handle")}`} placeholder="diver_kim" autoComplete="username" />
            <span className="hint">영문·숫자·밑줄(_) 2~24자. 댓글에 이 이름이 보입니다.</span>
          </div>
        </Section>

        <Section title="개인 정보">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="field">
              <label htmlFor="name_ko">이름(한글) <span className="text-danger">*</span></label>
              <input id="name_ko" name="name_ko" required maxLength={60} className={`input ${bad("name_ko")}`} placeholder="홍길동" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="name_en">이름(영문) <span className="text-danger">*</span></label>
              <input
                id="name_en"
                name="name_en"
                required
                maxLength={120}
                pattern="[A-Za-z\s]+"
                className={`input ${bad("name_en")}`}
                placeholder="HONG GILDONG"
                onChange={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="field">
              <label htmlFor="dob">생년월일 <span className="text-danger">*</span></label>
              <input id="dob" name="dob" required inputMode="numeric" maxLength={10} pattern="\d{4}-\d{2}-\d{2}" value={dob} onChange={(e) => setDob(formatDob(e.target.value))} className={`input ${bad("dob")}`} placeholder="19900101" />
            </div>
            <div className="field">
              <label htmlFor="gender">성별 <span className="text-danger">*</span></label>
              <select id="gender" name="gender" required defaultValue="" className={`input ${bad("gender")}`}>
                <option value="" disabled>선택</option>
                <option value="M">남성</option>
                <option value="F">여성</option>
                <option value="O">기타</option>
                <option value="N">밝히지 않음</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="country">국가 <span className="text-danger">*</span></label>
            <select id="country" name="country" required defaultValue="KR" className={`input ${bad("country")}`}>
              {COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </Section>

        <Section title="연락처">
          <div className="field">
            <label htmlFor="phone">휴대전화 <span className="text-danger">*</span></label>
            <input id="phone" name="phone" type="tel" inputMode="numeric" required className={`input ${bad("phone")}`} placeholder="01000000000" onChange={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))} />
          </div>
          <div className="field">
            <label htmlFor="address">주소 <span className="text-muted-foreground font-normal">(선택)</span></label>
            <input id="address" name="address" maxLength={255} className="input" autoComplete="street-address" />
          </div>
        </Section>

        <fieldset className="grid gap-2.5 rounded-xl border border-border bg-muted/60 p-4 text-[14px]">
          <label className="flex items-start gap-2.5 pb-2.5 border-b border-border font-semibold text-headline">
            <input type="checkbox" className="mt-1" checked={allAgreed} onChange={(e) => setAgree({ terms: e.target.checked, privacy: e.target.checked, age: e.target.checked, marketing: e.target.checked })} />
            <span>모두 동의합니다</span>
          </label>
          <label className="flex items-start gap-2.5">
            <input type="checkbox" className="mt-1" checked={agree.terms} onChange={(e) => setAgree({ ...agree, terms: e.target.checked })} />
            <span>
              (필수){" "}
              <a href={`${PSA_SITE_URL}/terms`} target="_blank" rel="noopener" className="underline underline-offset-2 text-accent-blue">이용약관</a>
              에 동의합니다.
            </span>
          </label>
          <label className="flex items-start gap-2.5">
            <input type="checkbox" className="mt-1" checked={agree.privacy} onChange={(e) => setAgree({ ...agree, privacy: e.target.checked })} />
            <span>
              (필수){" "}
              <a href={`${PSA_SITE_URL}/privacy`} target="_blank" rel="noopener" className="underline underline-offset-2 text-accent-blue">개인정보 처리방침</a>
              에 동의합니다.
            </span>
          </label>
          <label className="flex items-start gap-2.5">
            <input type="checkbox" className="mt-1" checked={agree.age} onChange={(e) => setAgree({ ...agree, age: e.target.checked })} />
            <span>(필수) 만 14세 이상입니다.</span>
          </label>
          <label className="flex items-start gap-2.5">
            <input type="checkbox" className="mt-1" checked={agree.marketing} onChange={(e) => setAgree({ ...agree, marketing: e.target.checked })} />
            <span>(선택) 소식과 이벤트 안내를 받겠습니다.</span>
          </label>
        </fieldset>

        {error && (
          <FormAlert>
            {ERRORS[error.code] ?? FALLBACK_ERROR}
            {error.code === "emailTaken" && (
              <>
                {" "}
                <Link href="/login" className="font-semibold underline underline-offset-2">로그인하기</Link>
              </>
            )}
          </FormAlert>
        )}

        <div className="grid gap-3">
          <button type="submit" disabled={loading} className="btn btn-primary w-full !h-12">
            {loading ? "계정을 만드는 중..." : "가입하기"}
          </button>
          <p className="text-[13px] leading-relaxed text-muted-foreground text-center">
            가입한 계정은 PSA(divepsa.com)에서도 같은 이메일과 비밀번호로 쓸 수 있습니다.
          </p>
        </div>
      </form>

      <p className="mt-7 pt-6 border-t border-border text-center text-[14px] text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-semibold text-accent-blue hover:underline">로그인</Link>
      </p>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

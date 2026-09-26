import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PSA_SITE_URL } from "@/config/psa";
import { getStaff, ROLE_LABEL } from "@/lib/staff";
import { AuthShell, PsaMemberNote } from "@/components/auth/AuthShell";
import LogoutButton from "./LogoutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const [{ data: prof }, staff] = await Promise.all([
    supabase.from("profiles").select("name_ko, handle, created_at").eq("id", user.id).maybeSingle(),
    getStaff(),
  ]);
  const p = prof as { name_ko?: string | null; handle?: string | null; created_at?: string | null } | null;

  const rows: [string, string][] = [
    ["이름", p?.name_ko || "-"],
    ["닉네임", p?.handle || "-"],
    ["이메일", user.email ?? "-"],
    ["가입일", new Date(p?.created_at ?? user.created_at).toLocaleDateString("ko")],
  ];
  if (staff?.userId) rows.push(["편집진 직책", ROLE_LABEL[staff.role]]);

  return (
    <AuthShell kicker="My account" title="내 정보">
      <dl className="spec !grid-cols-[96px_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt>{k}</dt>
            <dd className="break-all">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <PsaMemberNote>
          다이브 저널 계정은 PSA 회원 계정과 같습니다. 이름·연락처 수정, 비밀번호 변경, 탈퇴는{" "}
          <a href={`${PSA_SITE_URL}/account-settings`} target="_blank" rel="noopener" className="font-semibold text-accent-blue underline underline-offset-2">
            divepsa.com 회원 정보
          </a>
          에서 할 수 있습니다.
        </PsaMemberNote>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/ko" className="btn btn-ghost">사이트로</Link>
        {staff && <Link href="/admin" className="btn btn-ghost">관리 화면</Link>}
        <LogoutButton />
      </div>
    </AuthShell>
  );
}

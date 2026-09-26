// /admin/staff — 편집진 직책 관리(편집장 전용, 미들웨어가 막는다)
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStaff } from "@/lib/staff";
import type { Member } from "@/app/actions/staff";
import { StaffManager } from "./StaffManager";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const staff = await getStaff();
  let list: (Member & { granted_at: string })[] = [];
  if (staff?.userId) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("journal_list_staff");
    list = (data as (Member & { granted_at: string })[] | null) ?? [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Newsroom · Staff</p>
          <h1 className="font-headline text-3xl mt-2">편집진 관리</h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            회원을 검색해 직책을 부여합니다. 편집장은 관리 기능 전부, 책임 기자는 기사·갤러리·콘테스트·광고, 기자는 기사 작성(초안)을 맡습니다.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">← Admin 홈</Link>
      </header>

      {staff?.userId ? (
        <StaffManager initial={list} myId={staff.userId} />
      ) : (
        <div className="p-5 rounded-lg border border-border bg-muted text-sm leading-relaxed">
          직책을 부여하려면 관리자 비밀번호가 아니라 편집장 직책이 있는 다이브 저널(PSA) 계정으로 로그인해야 합니다.{" "}
          <Link href="/login?next=/admin/staff" className="font-semibold text-accent-blue underline underline-offset-2">계정으로 로그인</Link>
        </div>
      )}
    </div>
  );
}

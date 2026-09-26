// 다이브 저널 편집진 직책과 권한.
//
//   편집장(editor_in_chief)   관리 기능 전부 + 직책 부여
//   책임 기자(senior_reporter) 기사(발행 포함)·갤러리·콘테스트·광고
//   기자(reporter)            기사 작성(초안 저장, 본인이 쓴 초안만 수정)
//
// 직책은 PSA 회원 DB 의 journal_staff 표에 있고 journal_my_role() 로 읽는다.
// 예전 관리자 비밀번호로 들어온 세션(psa-admin-token)은 편집장으로 본다.
import "server-only";
import { isAuthenticated as hasAdminPasswordSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "editor_in_chief" | "senior_reporter" | "reporter";

export const ROLE_LABEL: Record<StaffRole, string> = {
  editor_in_chief: "편집장",
  senior_reporter: "책임 기자",
  reporter: "기자",
};

const RANK: Record<StaffRole, number> = { reporter: 1, senior_reporter: 2, editor_in_chief: 3 };

export function roleAtLeast(role: StaffRole | null | undefined, min: StaffRole): boolean {
  return !!role && RANK[role] >= RANK[min];
}

export type Staff = {
  role: StaffRole;
  /** PSA 회원으로 로그인했을 때만 있다. 비밀번호 세션이면 null. */
  userId: string | null;
  name: string | null;
};

/** 현재 요청의 편집진 정보. PSA 로그인 직책을 먼저 보고, 없으면 관리자 비밀번호 세션을 본다. */
export async function getStaff(): Promise<Staff | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: role } = await supabase.rpc("journal_my_role");
    if (role === "editor_in_chief" || role === "senior_reporter" || role === "reporter") {
      const { data: prof } = await supabase.from("profiles").select("name_ko, handle").eq("id", user.id).maybeSingle();
      const name = (prof as { name_ko?: string | null; handle?: string | null } | null);
      return { role, userId: user.id, name: name?.name_ko || name?.handle || user.email || null };
    }
  }
  if (await hasAdminPasswordSession()) return { role: "editor_in_chief", userId: null, name: null };
  return null;
}

/** 최소 직책을 갖춘 편집진만 통과. 아니면 null. */
export async function requireStaff(min: StaffRole): Promise<Staff | null> {
  const staff = await getStaff();
  return staff && roleAtLeast(staff.role, min) ? staff : null;
}

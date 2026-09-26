"use server";

// 편집진 직책 관리(편집장 전용). PSA 회원 DB 의 journal_* 함수를 로그인한 편집장 세션으로 부른다.
// 함수 쪽에서도 편집장인지 다시 확인하므로 여기서 우회할 수 없다.
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/lib/staff";

export type Member = { id: string; name_ko: string | null; name_en: string | null; handle: string | null; email: string | null; role: StaffRole | null };

export async function searchMembers(q: string): Promise<{ ok: true; members: Member[] } | { ok: false; error: string }> {
  const query = q.trim();
  if (query.length < 2) return { ok: false, error: "두 글자 이상 입력해 주세요." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("journal_search_members", { p_q: query.slice(0, 60) });
  if (error) return { ok: false, error: error.code === "42501" ? "편집장만 검색할 수 있습니다." : "검색하지 못했습니다." };
  return { ok: true, members: (data as Member[]) ?? [] };
}

export async function setStaffRole(userId: string, role: StaffRole | null): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("journal_set_staff_role", { p_user: userId, p_role: role });
  if (error) {
    if (/own role/.test(error.message)) return { ok: false, error: "본인 직책은 바꿀 수 없습니다." };
    return { ok: false, error: error.code === "42501" ? "편집장만 직책을 바꿀 수 있습니다." : "저장하지 못했습니다." };
  }
  revalidatePath("/admin/staff");
  return { ok: true };
}

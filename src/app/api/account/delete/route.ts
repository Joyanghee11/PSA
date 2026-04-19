import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// DELETE /api/account/delete
// 본인 계정 완전 삭제.
// - 호출자의 세션에서 user.id를 가져오므로 타인 계정은 삭제 불가
// - auth.users 행이 삭제되면 public.comments.user_id FK의 ON DELETE CASCADE가
//   해당 사용자의 모든 댓글을 DB 레벨에서 자동 삭제
export async function DELETE(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  // 우발적 호출 방지: body에 { confirm: true } 필수
  let confirm = false;
  try {
    const body = await request.json();
    confirm = body?.confirm === true;
  } catch {
    // body 없이 호출된 경우
  }
  if (!confirm) {
    return NextResponse.json(
      { error: "Confirmation required" },
      { status: 400 }
    );
  }

  // 1. auth.users 삭제 (CASCADE로 comments도 자동 삭제)
  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      console.error("[Account Delete] admin.deleteUser failed:", error);
      return NextResponse.json(
        { error: `계정 삭제 실패: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[Account Delete] unexpected error:", msg);
    return NextResponse.json(
      { error: `서버 오류: ${msg}` },
      { status: 500 }
    );
  }

  // 2. 세션 쿠키 정리
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}

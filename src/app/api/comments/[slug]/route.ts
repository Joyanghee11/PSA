import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 로그인 확인은 PSA 회원 DB(createClient), 댓글 저장은 저널 DB(createAdminClient).
// 저널 DB 의 RLS 는 PSA 로그인을 모르므로 본인 확인은 여기서 한다.

const COLUMNS = "id, display_name, body, created_at, user_id";

// GET: 특정 기사의 댓글 목록 (공개). 이메일은 내보내지 않는다.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { data, error } = await createAdminClient()
    .from("comments")
    .select(COLUMNS)
    .eq("article_slug", slug)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ comments: data || [] });
}

// POST: 새 댓글 작성 (로그인 필요)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: string;
  try {
    const json = await request.json();
    body = String(json.body || "").trim();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식" }, { status: 400 });
  }

  if (body.length === 0) {
    return NextResponse.json({ error: "댓글 내용을 입력해주세요." }, { status: 400 });
  }
  if (body.length > 2000) {
    return NextResponse.json({ error: "댓글은 2000자 이하여야 합니다." }, { status: 400 });
  }

  // 댓글에 보이는 이름: PSA 닉네임 → 한글 이름 → 이메일 앞부분
  const { data: prof } = await supabase.from("profiles").select("handle, name_ko").eq("id", user.id).maybeSingle();
  const p = prof as { handle?: string | null; name_ko?: string | null } | null;
  const displayName = p?.handle || p?.name_ko || user.email?.split("@")[0] || "사용자";

  const { data, error } = await createAdminClient()
    .from("comments")
    .insert({
      article_slug: slug,
      user_id: user.id,
      user_email: user.email!,
      display_name: displayName,
      body,
    })
    .select(COLUMNS)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ comment: data }, { status: 201 });
}

// DELETE: 본인 댓글 삭제
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const commentId = url.searchParams.get("id");
  if (!commentId) {
    return NextResponse.json({ error: "comment id 필요" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { error } = await createAdminClient().from("comments").delete().eq("id", commentId).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

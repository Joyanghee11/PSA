import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: 특정 기사의 댓글 목록 (공개)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("id, user_email, display_name, body, created_at, user_id")
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

  const displayName =
    (user.user_metadata as { display_name?: string })?.display_name ||
    user.email?.split("@")[0] ||
    "사용자";

  const { data, error } = await supabase
    .from("comments")
    .insert({
      article_slug: slug,
      user_id: user.id,
      user_email: user.email!,
      display_name: displayName,
      body,
    })
    .select("id, user_email, display_name, body, created_at, user_id")
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

  // RLS 정책이 본인 소유 확인을 처리하므로 별도 조회 불필요
  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

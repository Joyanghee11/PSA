"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Comment {
  id: string;
  user_email: string;
  display_name: string | null;
  body: string;
  created_at: string;
  user_id: string;
}

export default function CommentSection({ slug }: { slug: string }) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments/${slug}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments || []);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchComments();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id || null);
    });
    return () => sub.subscription.unsubscribe();
  }, [fetchComments, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (body.trim().length === 0) return;
    setSubmitting(true);

    const res = await fetch(`/api/comments/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "댓글 등록 실패");
      return;
    }
    setBody("");
    fetchComments();
  }

  async function handleDelete(commentId: string) {
    if (!confirm("이 댓글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/comments/${slug}?id=${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-bold mb-4">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* 작성 폼 */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="이 기사에 대한 의견을 남겨주세요..."
            rows={4}
            maxLength={2000}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background resize-none"
            required
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{body.length}/2000</span>
            <button
              type="submit"
              disabled={submitting || body.trim().length === 0}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
          {error && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-lg border border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground">
            댓글을 작성하려면{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              로그인
            </Link>{" "}
            또는{" "}
            <Link href="/signup" className="text-accent hover:underline font-medium">
              회원가입
            </Link>
            이 필요합니다.
          </p>
        </div>
      )}

      {/* 댓글 목록 */}
      {loading ? (
        <p className="text-sm text-muted-foreground">댓글을 불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {c.display_name || c.user_email.split("@")[0]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleString("ko")}
                  </span>
                </div>
                {currentUserId === c.user_id && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

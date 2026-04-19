import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import DeleteAccountButton from "./DeleteAccountButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const displayName =
    (user.user_metadata as { display_name?: string })?.display_name ||
    user.email?.split("@")[0] ||
    "사용자";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">내 정보</h1>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">표시 이름</div>
            <div className="text-lg font-medium">{displayName}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">이메일</div>
            <div>{user.email}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">가입일</div>
            <div>{new Date(user.created_at).toLocaleDateString("ko")}</div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/ko"
            className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            사이트로
          </Link>
          <LogoutButton />
        </div>

        <DeleteAccountButton />
      </div>
    </div>
  );
}

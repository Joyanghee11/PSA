"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/ko");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn-ghost !text-danger"
    >
      로그아웃
    </button>
  );
}

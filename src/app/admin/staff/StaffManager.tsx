"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchMembers, setStaffRole, type Member } from "@/app/actions/staff";
import type { StaffRole } from "@/lib/staff";

const ROLES: [StaffRole, string][] = [
  ["editor_in_chief", "편집장"],
  ["senior_reporter", "책임 기자"],
  ["reporter", "기자"],
];
const LABEL = Object.fromEntries(ROLES) as Record<StaffRole, string>;

function who(m: Member) {
  return (
    <div className="min-w-0">
      <div className="font-medium truncate">
        {m.name_ko || m.name_en || "(이름 없음)"}
        {m.handle && <span className="text-muted-foreground font-normal"> · @{m.handle}</span>}
      </div>
      <div className="text-xs text-muted-foreground truncate">{m.email}</div>
    </div>
  );
}

function RoleControl({ member, myId, onDone }: { member: Member; myId: string; onDone: (role: StaffRole | null) => void }) {
  const [role, setRole] = useState<string>(member.role ?? "");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  if (member.id === myId) return <span className="text-xs text-muted-foreground">본인</span>;

  function save() {
    setMsg(null);
    const next = (role || null) as StaffRole | null;
    start(async () => {
      const r = await setStaffRole(member.id, next);
      if (r.ok) {
        setMsg("저장했습니다.");
        onDone(next);
      } else setMsg(r.error);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 justify-end">
      <select value={role} onChange={(e) => setRole(e.target.value)} className="input !h-9 !w-auto !text-sm">
        <option value="">직책 없음</option>
        {ROLES.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <button onClick={save} disabled={pending || role === (member.role ?? "")} className="btn btn-primary !h-9 !px-4 !text-sm">
        {pending ? "저장 중" : "저장"}
      </button>
      {msg && <span className="basis-full text-right text-xs text-muted-foreground">{msg}</span>}
    </div>
  );
}

export function StaffManager({ initial, myId }: { initial: Member[]; myId: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function search(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await searchMembers(q);
      if (r.ok) setResults(r.members);
      else {
        setResults(null);
        setError(r.error);
      }
    });
  }

  const refresh = (id: string) => (role: StaffRole | null) => {
    setResults((prev) => prev?.map((m) => (m.id === id ? { ...m, role } : m)) ?? null);
    router.refresh();
  };

  return (
    <div className="grid gap-10">
      <section>
        <h2 className="font-subheadline text-lg mb-3">회원 검색</h2>
        <form onSubmit={search} className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input flex-1" placeholder="이름, 영문 이름, 이메일, 닉네임" />
          <button type="submit" disabled={pending} className="btn btn-primary shrink-0">{pending ? "검색 중" : "검색"}</button>
        </form>
        {error && <p className="text-sm text-danger mt-2">{error}</p>}
        {results && (
          <ul className="mt-4 divide-y divide-border border border-border rounded-lg bg-card">
            {results.length === 0 && <li className="p-4 text-sm text-muted-foreground">검색 결과가 없습니다.</li>}
            {results.map((m) => (
              <li key={m.id} className="p-4 grid sm:grid-cols-[1fr_auto] gap-3 items-center">
                {who(m)}
                <RoleControl member={m} myId={myId} onDone={refresh(m.id)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-subheadline text-lg mb-3">현재 편집진 ({initial.length}명)</h2>
        <p className="text-xs text-muted-foreground mb-3">PSA 총괄 관리자는 목록에 없어도 편집장 권한을 가집니다.</p>
        {initial.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg">아직 지정된 편집진이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-border border border-border rounded-lg bg-card">
            {initial.map((m) => (
              <li key={m.id} className="p-4 grid sm:grid-cols-[1fr_auto] gap-3 items-center">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="chip chip-live shrink-0">{m.role ? LABEL[m.role] : "-"}</span>
                  {who(m)}
                </div>
                <RoleControl member={m} myId={myId} onDone={() => router.refresh()} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

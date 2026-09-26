import { NextResponse } from "next/server";
import { getStaff } from "@/lib/staff";

// 관리 화면이 메뉴를 직책에 맞게 보여 주려고 부른다.
export async function GET() {
  const staff = await getStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(staff);
}

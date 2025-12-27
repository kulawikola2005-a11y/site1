import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  // Pobieramy rezerwacje (nie anulowane) i blokady
  const { data: bookings, error: bErr } = await supabaseAdmin
    .from("bookings")
    .select("check_in, check_out, status")
    .neq("status", "cancelled");

  if (bErr) {
    return NextResponse.json({ ok: false, error: bErr.message }, { status: 500 });
  }

  const { data: blocks, error: blErr } = await supabaseAdmin
    .from("blocks")
    .select("check_in, check_out");

  if (blErr) {
    return NextResponse.json({ ok: false, error: blErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    booked: bookings ?? [],
    blocks: blocks ?? [],
  });
}

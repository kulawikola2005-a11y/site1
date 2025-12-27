import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { bookingSchema } from "@/lib/bookingSchema";

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  // Konflikt jeśli: aStart < bEnd && aEnd > bStart
  return aStart < bEnd && aEnd > bStart;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, phone, checkIn, checkOut, notes } = parsed.data;

  // 1) Pobierz istniejące rezerwacje/ blokady do sprawdzenia konfliktu
  const { data: bookings, error: bErr } = await supabaseAdmin
    .from("bookings")
    .select("check_in, check_out, status")
    .neq("status", "cancelled");

  if (bErr)
    return NextResponse.json({ ok: false, error: bErr.message }, { status: 500 });

  const { data: blocks, error: blErr } = await supabaseAdmin
    .from("blocks")
    .select("check_in, check_out");

  if (blErr)
    return NextResponse.json({ ok: false, error: blErr.message }, { status: 500 });

  const conflictBooking = (bookings ?? []).some((r) =>
    overlaps(checkIn, checkOut, r.check_in, r.check_out)
  );
  const conflictBlock = (blocks ?? []).some((r) =>
    overlaps(checkIn, checkOut, r.check_in, r.check_out)
  );

  if (conflictBooking || conflictBlock) {
    return NextResponse.json(
      { ok: false, message: "Ten termin jest już zajęty. Wybierz inny." },
      { status: 409 }
    );
  }

  // 2) Zapis do bazy
  const { error: insErr } = await supabaseAdmin.from("bookings").insert([
    {
      name,
      email,
      phone: phone || null,
      check_in: checkIn,
      check_out: checkOut,
      notes: notes || null,
      status: "pending",
    },
  ]);

  if (insErr) {
    return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

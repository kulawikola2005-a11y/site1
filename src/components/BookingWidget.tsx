"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

type RangeRow = { check_in: string; check_out: string };

function toDate(s: string) {
  // s = YYYY-MM-DD
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toYMD(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export default function BookingWidget() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState<RangeRow[]>([]);
  const [blocks, setBlocks] = useState<RangeRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  // Formularz
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);

      const res = await fetch("/api/availability");
      const data = await res.json();

      if (!data.ok) {
        setMsg("Nie udało się pobrać dostępności.");
        setLoading(false);
        return;
      }

      setBooked(data.booked ?? []);
      setBlocks(data.blocks ?? []);
      setLoading(false);
    })();
  }, []);

  const disabledRanges = useMemo(() => {
    const all = [...booked, ...blocks];
    return all.map((r) => ({
      from: toDate(r.check_in),
      to: new Date(toDate(r.check_out).getTime() - 24 * 60 * 60 * 1000), // checkout jest “nie wliczany”
    }));
  }, [booked, blocks]);

  async function submit() {
    setMsg(null);

    if (!range?.from || !range.to) {
      setMsg("Wybierz zakres dat (od–do).");
      return;
    }

    const payload = {
      name,
      email,
      phone: phone || undefined,
      checkIn: toYMD(range.from),
      checkOut: toYMD(range.to),
      notes: notes || undefined,
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.status === 409) {
      setMsg(data.message ?? "Termin zajęty.");
      return;
    }

    if (!data.ok) {
      setMsg("Błąd zapisu. Sprawdź dane i spróbuj ponownie.");
      return;
    }

    setMsg("✅ Zgłoszenie wysłane! Odezwę się z potwierdzeniem.");
    setRange(undefined);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-2xl border p-4">
        <h2 className="text-lg font-medium">Wybierz termin</h2>
        <p className="text-sm text-gray-600 mb-3">
          Zajęte dni są zablokowane w kalendarzu.
        </p>

        {loading ? (
          <p>Ładowanie dostępności...</p>
        ) : (
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={disabledRanges}
            numberOfMonths={2}
          />
        )}
      </div>

      <div className="rounded-2xl border p-4">
        <h2 className="text-lg font-medium">Dane kontaktowe</h2>

        <div className="mt-4 grid gap-3">
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Imię i nazwisko"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Telefon (opcjonalnie)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            className="w-full rounded-xl border px-3 py-2 min-h-[110px]"
            placeholder="Wiadomość (opcjonalnie)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"
            onClick={submit}
            disabled={loading}
          >
            Wyślij rezerwację
          </button>

          {msg && <p className="text-sm">{msg}</p>}
        </div>
      </div>
    </div>
  );
}

import BookingWidget from "@/components/BookingWidget";

export default function RezerwacjaPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Rezerwacja domku</h1>
      <p className="mt-2 text-gray-600">
        Wybierz daty pobytu i zostaw kontakt. Potwierdzimy dostępność i wrócimy z
        finalnym potwierdzeniem.
      </p>

      <div className="mt-8">
        <BookingWidget />
      </div>
    </main>
  );
}

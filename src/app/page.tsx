import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-3xl border p-10">
        <h1 className="text-4xl font-semibold">Domek w Krynicy</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">
          Klimatyczny domek w górach — idealny na weekend, ferie i odpoczynek.
          Sprawdź dostępność i zarezerwuj termin online.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            className="rounded-xl bg-black text-white px-5 py-3"
            href="/rezerwacja"
          >
            Rezerwuj termin
          </Link>
          <a className="rounded-xl border px-5 py-3" href="#galeria">
            Zobacz zdjęcia
          </a>
        </div>
      </div>

      <section id="galeria" className="mt-10">
        <h2 className="text-2xl font-semibold">Galeria</h2>
        <p className="text-gray-600 mt-2">
          Tu wstawimy Twoje zdjęcia (następny krok).
        </p>
      </section>
    </main>
  );
}

import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "Podaj imię (min 2 znaki)"),
  email: z.string().email("Podaj poprawny email"),
  phone: z.string().optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Niepoprawna data check-in"),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Niepoprawna data check-out"),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

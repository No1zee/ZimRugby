import { z } from "zod";

export const fanSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  favoriteTeam: z.enum(["Sables", "Lady Sables", "Cheetahs", "Junior Sables", "Domestic Rugby"]),
  cdpaConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing under Zimbabwe CDPA 2021",
  }),
});

export type FanSignupInput = z.infer<typeof fanSignupSchema>;

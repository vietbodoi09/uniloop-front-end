import { z } from "zod";

export const productStep1Schema = z
  .object({
    title: z.string().min(3, "Title must be ≥ 3 characters").max(120),
    description: z.string().max(2000).optional(),
    listingType: z.enum(["sell", "exchange"]),
    condition: z.enum(["new", "like_new", "used", "for_parts"]),
    price: z.coerce.number().int().nonnegative().optional(),
    subjectId: z.string().uuid().optional().nullable(),
    images: z.array(z.string()).min(1, "Add at least 1 photo").max(8),
  })
  .refine(
    (d) =>
      d.listingType === "exchange" || (d.price !== undefined && d.price > 0),
    { path: ["price"], message: "Price is required for Sell listings" }
  );

export const productStep2Schema = z.object({
  locationLabel: z.string().min(1, "Pick a location"),
  lat: z.number(),
  lng: z.number(),
});

export const productFullSchema = productStep1Schema.and(productStep2Schema);

export type ProductStep1 = z.infer<typeof productStep1Schema>;
export type ProductStep2 = z.infer<typeof productStep2Schema>;

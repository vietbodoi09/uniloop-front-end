"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productStep1Schema,
  type ProductStep1,
} from "@/lib/validators/product";
import { usePostingStore } from "@/lib/stores/postingStore";
import { ImageUploader } from "@/components/products/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step1() {
  const router = useRouter();
  const { draft, update, setStep } = usePostingStore();
  useEffect(() => setStep(1), [setStep]);

  const form = useForm<ProductStep1>({
    resolver: zodResolver(productStep1Schema),
    defaultValues: {
      title: draft.title,
      description: draft.description,
      listingType: draft.listingType,
      condition: draft.condition,
      price: draft.price,
      images: draft.images,
    },
  });

  const listingType = form.watch("listingType");
  const images = form.watch("images");

  const onSubmit = (data: ProductStep1) => {
    update(data);
    router.push("/products/new/step-2-location");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Photos</Label>
        <ImageUploader
          value={images}
          onChange={(v) => form.setValue("images", v, { shouldValidate: true })}
        />
        {form.formState.errors.images && (
          <p className="text-sm text-red-600">
            {form.formState.errors.images.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input
          placeholder="VD: Giáo trình Kinh tế Vi mô — UEB"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          rows={4}
          placeholder="Tình trạng, lý do bán…"
          {...form.register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Listing type</Label>
          <Select
            value={form.watch("listingType")}
            onValueChange={(v) =>
              form.setValue("listingType", v as ProductStep1["listingType"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sell">Sell</SelectItem>
              <SelectItem value="exchange">Exchange</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Condition</Label>
          <Select
            value={form.watch("condition")}
            onValueChange={(v) =>
              form.setValue("condition", v as ProductStep1["condition"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like_new">Like new</SelectItem>
              <SelectItem value="used">Used</SelectItem>
              <SelectItem value="for_parts">For parts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {listingType === "sell" && (
        <div className="space-y-1.5">
          <Label>Price (VND)</Label>
          <Input
            type="number"
            min={0}
            step={1000}
            {...form.register("price")}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-600">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit">Next: Location →</Button>
      </div>
    </form>
  );
}

"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string[];
  onChange: (paths: string[]) => void;
  max?: number;
}

export function ImageUploader({ value, onChange, max = 8 }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("Please log in");

    const remaining = max - value.length;
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of toUpload) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) toast.error(error.message);
      else uploaded.push(path);
    }
    setUploading(false);
    onChange([...value, ...uploaded]);
  };

  const remove = async (path: string) => {
    const supabase = createClient();
    await supabase.storage.from("product-images").remove([path]);
    onChange(value.filter((p) => p !== path));
  };

  const publicUrl = (path: string) => {
    const supabase = createClient();
    return supabase.storage.from("product-images").getPublicUrl(path).data
      .publicUrl;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {value.map((p) => (
          <div
            key={p}
            className="relative aspect-square rounded-md overflow-hidden border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={publicUrl(p)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(p)}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <label className="flex aspect-square cursor-pointer items-center justify-center rounded-md border border-dashed text-slate-500 hover:bg-slate-50">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />
            <UploadCloud className="h-5 w-5" />
          </label>
        )}
      </div>
      <p className="text-xs text-slate-500">
        {value.length}/{max} images · JPG/PNG/WebP
      </p>
    </div>
  );
}

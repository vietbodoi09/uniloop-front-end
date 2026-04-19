"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, UploadCloud, Loader2 } from "lucide-react";
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
    if (!user) return toast.error("Vui lòng đăng nhập");

    const remaining = max - value.length;
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    const uploaded: string[] = [];
    let failures = 0;
    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Ảnh quá lớn (>5MB)`);
        failures++;
        continue;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: Không phải file ảnh`);
        failures++;
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadErr) {
        toast.error(`Upload thất bại: ${uploadErr.message}`);
        failures++;
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      try {
        const res = await fetch(urlData.publicUrl, { method: "HEAD" });
        if (!res.ok) {
          toast.error(
            `Ảnh không truy cập được (${res.status}). Kiểm tra bucket có public không.`
          );
          await supabase.storage.from("product-images").remove([path]);
          failures++;
          continue;
        }
      } catch {
        toast.error("Không xác thực được URL ảnh. Kiểm tra cấu hình storage.");
        await supabase.storage.from("product-images").remove([path]);
        failures++;
        continue;
      }

      uploaded.push(path);
    }

    setUploading(false);
    if (uploaded.length) {
      onChange([...value, ...uploaded]);
      toast.success(`Đã tải lên ${uploaded.length} ảnh`);
    }
    if (failures && !uploaded.length) {
      toast.error("Không có ảnh nào được tải lên thành công");
    }
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
            <img
              src={publicUrl(p)}
              alt=""
              className="h-full w-full object-cover"
            />
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
          <label
            className={`flex aspect-square cursor-pointer items-center justify-center rounded-md border border-dashed text-slate-500 hover:bg-slate-50 ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </label>
        )}
      </div>
      <p className="text-xs text-slate-500">
        {value.length}/{max} ảnh · JPG/PNG/WebP · tối đa 5MB mỗi ảnh
      </p>
    </div>
  );
}

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "lucide-react";
import { toast } from "sonner";

interface Props {
  universities: { id: string; short_name: string }[];
  faculties: { id: string; name: string; university_id: string }[];
  subjects: { id: string; name: string; faculty_id: string | null }[];
}

export function FilterSidebar({ universities, faculties, subjects }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [uni, setUni] = useState(sp.get("uni") ?? "");
  const [fac, setFac] = useState(sp.get("fac") ?? "");
  const [sub, setSub] = useState(sp.get("sub") ?? "");
  const [type, setType] = useState(sp.get("type") ?? "");
  const [min, setMin] = useState(sp.get("min") ?? "");
  const [max, setMax] = useState(sp.get("max") ?? "");
  const [radius, setRadius] = useState(sp.get("r") ?? "");
  const [lat, setLat] = useState(sp.get("lat") ?? "");
  const [lng, setLng] = useState(sp.get("lng") ?? "");

  const filteredFaculties = uni
    ? faculties.filter((f) => f.university_id === uni)
    : faculties;
  const filteredSubjects = fac
    ? subjects.filter((s) => s.faculty_id === fac)
    : subjects;

  const useGeo = () =>
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLat(String(p.coords.latitude));
        setLng(String(p.coords.longitude));
      },
      () => toast.error("Unable to get location")
    );

  const apply = () => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (uni) p.set("uni", uni);
    if (fac) p.set("fac", fac);
    if (sub) p.set("sub", sub);
    if (type) p.set("type", type);
    if (min) p.set("min", min);
    if (max) p.set("max", max);
    if (radius && lat && lng) {
      p.set("r", radius);
      p.set("lat", lat);
      p.set("lng", lng);
    }
    router.push(`/search?${p.toString()}`);
  };

  const reset = () => router.push("/search");

  return (
    <aside className="space-y-4 w-64 shrink-0">
      <div className="space-y-1.5">
        <Label>Keyword</Label>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="book title, item…"
        />
      </div>

      <div className="space-y-1.5">
        <Label>University</Label>
        <Select value={uni} onValueChange={setUni}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {universities.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.short_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Faculty</Label>
        <Select value={fac} onValueChange={setFac} disabled={!uni}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {filteredFaculties.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Select value={sub} onValueChange={setSub} disabled={!fac}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {filteredSubjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Listing type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sell">Sell</SelectItem>
            <SelectItem value="exchange">Exchange</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label>Min ₫</Label>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Max ₫</Label>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Distance radius (km)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="e.g. 2"
          />
          <Button type="button" variant="outline" onClick={useGeo}>
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
        {lat && lng && (
          <p className="text-xs text-slate-500">
            📍 {(+lat).toFixed(3)}, {(+lng).toFixed(3)}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={apply} className="flex-1">
          Apply
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>
    </aside>
  );
}

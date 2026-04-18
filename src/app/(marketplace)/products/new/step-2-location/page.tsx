"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePostingStore } from "@/lib/stores/postingStore";
import { CAMPUS_LOCATIONS } from "@/lib/constants/campus-locations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

export default function Step2() {
  const router = useRouter();
  const { draft, update, setStep } = usePostingStore();
  useEffect(() => setStep(2), [setStep]);

  const [selectedId, setSelectedId] = useState<string | null>(
    CAMPUS_LOCATIONS.find((l) => l.label === draft.locationLabel)?.id ?? null
  );
  const [custom, setCustom] = useState(
    draft.locationLabel && !selectedId ? draft.locationLabel : ""
  );

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update({
          locationLabel: custom || "Current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        toast.success("Location captured");
      },
      () => toast.error("Unable to get location")
    );
  };

  const pick = (id: string) => {
    const loc = CAMPUS_LOCATIONS.find((l) => l.id === id)!;
    setSelectedId(id);
    setCustom("");
    update({ locationLabel: loc.label, lat: loc.lat, lng: loc.lng });
  };

  const onNext = () => {
    if (!draft.lat || !draft.lng || !draft.locationLabel) {
      return toast.error("Pick a location or share your current one");
    }
    router.push("/products/new/step-3-review");
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Pick a campus location</Label>
        <div className="grid grid-cols-2 gap-2">
          {CAMPUS_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => pick(loc.id)}
              className={`flex items-start gap-2 rounded-md border p-3 text-left text-sm hover:bg-slate-50 ${
                selectedId === loc.id ? "border-slate-900 bg-slate-50" : ""
              }`}
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Or use your current location</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Optional label (e.g. Cafe gần cổng chính)"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={useCurrentLocation}>
            <Navigation className="h-4 w-4 mr-1" /> Use GPS
          </Button>
        </div>
        {draft.lat && draft.lng && (
          <p className="text-xs text-slate-500">
            📍 {draft.locationLabel} ({draft.lat.toFixed(4)},{" "}
            {draft.lng.toFixed(4)})
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products/new/step-1-details")}
        >
          ← Back
        </Button>
        <Button type="button" onClick={onNext}>
          Next: Review →
        </Button>
      </div>
    </div>
  );
}

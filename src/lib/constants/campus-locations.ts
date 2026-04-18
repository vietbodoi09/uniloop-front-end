export interface CampusLocation {
  id: string;
  label: string;
  universityShort: string;
  lat: number;
  lng: number;
}

// UEB (VNU University of Economics and Business) — 144 Xuân Thủy, Cầu Giấy, Hà Nội
export const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: "ueb-e4",     label: "Giảng đường E4 — UEB",        universityShort: "UEB", lat: 21.0367, lng: 105.7826 },
  { id: "ueb-gd2",    label: "Nhà GD2 — UEB",                universityShort: "UEB", lat: 21.0371, lng: 105.7820 },
  { id: "ueb-thuvien",label: "Thư viện VNU",                 universityShort: "UEB", lat: 21.0375, lng: 105.7832 },
  { id: "ueb-canteen",label: "Căn tin UEB",                  universityShort: "UEB", lat: 21.0369, lng: 105.7828 },
  { id: "ueb-cong",   label: "Cổng chính 144 Xuân Thủy",     universityShort: "UEB", lat: 21.0363, lng: 105.7822 },
  { id: "ueb-ktx",    label: "Ký túc xá Mỹ Đình",            universityShort: "UEB", lat: 21.0249, lng: 105.7702 },
];

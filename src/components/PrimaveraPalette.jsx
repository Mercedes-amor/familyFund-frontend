
const colors = [
  { name: "Ivory", hex: "#FFF8E1" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Peach", hex: "#FFCBA4" },
  { name: "Apricot", hex: "#FBCEB1" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Mint Green", hex: "#98FF98" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Leaf Green", hex: "#74C365" },
  { name: "Soft Fuchsia", hex: "#FFB7D5" },
  { name: "Night Shadz", hex: "#AA3158" },
  { name: "Gigas", hex: "#593E93" },
  { name: "Yale Blue", hex: "#1D4B87" },
  { name: "Cloud Burst", hex: "#1D2F53" }
];

export default function PrimaveraPalette() {
  return (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white min-h-screen">
      {colors.map((color) => (
        <div
          key={color.hex}
          className="rounded-2xl shadow-md p-4 flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: color.hex }}
        >
          <span className="font-bold text-sm text-black/70 drop-shadow">
            {color.name}
          </span>
          <span className="text-xs text-black/60 drop-shadow">
            {color.hex}
          </span>
        </div>
      ))}
    </div>
  );
}

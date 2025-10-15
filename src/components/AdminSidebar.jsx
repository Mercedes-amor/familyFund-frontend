import React from "react";

export default function AdminSidebar({ selected, onSelect }) {
  const items = [
    { key: "usuarios", label: "Usuarios" },
    { key: "familias", label: "Familias" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          className={`text-left px-4 py-2 rounded mb-2 ${
            selected === item.key ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

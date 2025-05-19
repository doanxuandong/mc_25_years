import { useState } from "react";

export default function TopBarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Icon bar */}
      <button
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 hover:bg-white shadow"
        onClick={() => setOpen(o => !o)}
      >
        {/* Hamburger icon */}
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h20M4 14h20M4 20h20" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-4 top-16 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 z-50 min-w-[180px]">
          <button className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition">
            {/* Login icon */}
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1" />
            </svg>
            Đăng nhập
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition">
            {/* Bookmark icon */}
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 3v18l7-5 7 5V3z" />
            </svg>
            Đã lưu
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition">
            {/* Trophy icon */}
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 21h8M12 17v4M17 3v4a5 5 0 01-10 0V3" />
              <path d="M21 5a2 2 0 01-2 2h-1V3h1a2 2 0 012 2zM3 5a2 2 0 002 2h1V3H5a2 2 0 00-2 2z" />
            </svg>
            Bảng xếp hạng
          </button>
        </div>
      )}
    </div>
  );
} 
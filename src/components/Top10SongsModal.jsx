import React from "react";

export default function Top10SongsModal({ open, onClose, songs }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gradient-to-br from-blue-600 via-blue-900 to-[#141e30] rounded-2xl shadow-2xl w-full max-w-xl mx-2 p-6 relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white hover:text-yellow-300 text-3xl font-bold"
        >
          ×
        </button>
        <div className="text-center mb-6">
          <div className="text-3xl text-[#FFD700] font-extrabold tracking-wide">THANH ÂM 25</div>
          <div className="text-lg font-semibold uppercase tracking-widest">TOP 10 SONGS</div>
        </div>
        <table className="w-full text-left rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-white bg-opacity-20">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Song</th>
              <th className="py-2 px-3">Artist</th>
              <th className="py-2 px-3 text-right">Votes</th>
            </tr>
          </thead>
          <tbody>
            {songs.slice(0, 10).map((song, idx) => (
              <tr key={song.id || idx} className={idx % 2 === 0 ? "bg-white bg-opacity-10" : ""}>
                <td className="py-2 px-3 font-bold text-yellow-300 text-lg">{idx + 1}</td>
                <td className="py-2 px-3 font-semibold">{song.title}</td>
                <td className="py-2 px-3">{song.artist}</td>
                <td className="py-2 px-3 text-right font-mono">{song.votes.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-center text-white/70 mt-4">* Dữ liệu cập nhật theo lượt vote</div>
      </div>
    </div>
  );
} 
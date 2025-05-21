import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import SavedVotesModal from "./SavedVotesModal";
import Top10SongsModal from "./Top10SongsModal";
import tomImg from "../img/tom.jpg";
// Dữ liệu mẫu cho các bài hát đã vote và top 10
const mockVotedSongs = [
  {
    id: 1,
    title: "Đi về nhà",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    id: 2,
    title: "Bài hát 2",
    artist: "Tác giả 2",
    img: tomImg,
    votes: 5000,
  },
  // ... có thể thêm tối đa 5 bài
];

const mockTop10Songs = [
  { id: 1, title: "Seven", artist: "Jung Kook ft. Latto", votes: 12000 },
  { id: 2, title: "LaLa", artist: "Myke Towers", votes: 11000 },
  { id: 3, title: "Dance The Night", artist: "Dua Lipa", votes: 10500 },
  { id: 4, title: "What Was I Made For?", artist: "Billie Eilish", votes: 10000 },
  { id: 5, title: "Cruel Summer", artist: "Taylor Swift", votes: 9500 },
  { id: 6, title: "Super Shy", artist: "NewJeans", votes: 9000 },
  { id: 7, title: "Paint The Town Red", artist: "Doja Cat", votes: 8500 },
  { id: 8, title: "Columbia", artist: "Quevedo", votes: 8000 },
  { id: 9, title: "Vampire", artist: "Olivia Rodrigo", votes: 7800 },
  { id: 10, title: "Sprinter", artist: "Dave & Central Cee", votes: 7500 },
];

export default function TopBarMenu() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showTop10, setShowTop10] = useState(false);
  const [votedSongs, setVotedSongs] = useState([]);
  const [user, setUser] = useState(null);
  const [showVoteLimit, setShowVoteLimit] = useState(false);

  // Lấy user hiện tại
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [showLogin]);

  // Lấy danh sách voted của user
  const fetchVotes = () => {
    if (user) {
      fetch(`http://localhost:5000/api/votes?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => setVotedSongs(data));
    } else {
      setVotedSongs([]);
    }
  };
  useEffect(() => {
    fetchVotes();
  }, [user, showSaved]);

  const handleRemoveVote = async (vote) => {
    const res = await fetch(`http://localhost:5000/api/votes/${vote.id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchVotes();
    } else {
      alert('Unvote thất bại');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  // Hiển thị thông báo giới hạn vote
  const VoteLimitModal = () => showVoteLimit && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-2 p-6 relative text-gray-900 text-center">
        <button
          onClick={() => setShowVoteLimit(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-3xl font-bold"
        >×</button>
        <h2 className="text-2xl font-bold mb-4">Bạn chỉ được vote tối đa 5 bài hát!</h2>
        <div className="text-gray-600">Hãy xóa bớt bài hát đã vote nếu muốn chọn thêm.</div>
      </div>
    </div>
  );

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
          <button
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
            onClick={() => {
              if (!user) setShowLogin(true);
              setOpen(false);
            }}
          >
            {/* Login icon */}
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1" />
            </svg>
            {user ? user.full_name : "Đăng nhập"}
          </button>
          {user && (
            <button
              className="flex items-center gap-3 text-red-600 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
              onClick={handleLogout}
            >
              {/* Logout icon */}
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 17l5-5-5-5M21 12H9" />
                <path d="M4 4v16h8" />
              </svg>
              Đăng xuất
            </button>
          )}
          <button
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
            onClick={() => { setShowSaved(true); setOpen(false); }}
          >
            {/* Bookmark icon */}
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 3v18l7-5 7 5V3z" />
            </svg>
            Đã lưu
          </button>
          <button
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
            onClick={() => { setShowTop10(true); setOpen(false); }}
          >
            {/* Trophy icon */}
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 21h8M12 17v4M17 3v4a5 5 0 01-10 0V3" />
              <path d="M21 5a2 2 0 01-2 2h-1V3h1a2 2 0 012 2zM3 5a2 2 0 002 2h1V3H5a2 2 0 00-2 2z" />
            </svg>
            Bảng xếp hạng
          </button>
        </div>
      )}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <SavedVotesModal
        open={showSaved}
        onClose={() => setShowSaved(false)}
        votes={votedSongs}
        onRemove={handleRemoveVote}
      />
      <Top10SongsModal
        open={showTop10}
        onClose={() => setShowTop10(false)}
        songs={mockTop10Songs}
      />
      <VoteLimitModal />
    </div>
  );
} 
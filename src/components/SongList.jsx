import SongCard from "./SongCard";
import tomImg from "../img/tom.jpg";

const songs = [
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    votes: 8303,
  },
];

export default function SongList() {
  return (
    <div id="songlist" className="max-w-6xl mx-auto px-2 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {songs.map((song, idx) => (
        <SongCard key={idx} song={song} />
      ))}
    </div>
  );
} 
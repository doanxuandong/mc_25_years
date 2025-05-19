import HeroSection from "./components/HeroSection";
import SongList from "./components/SongList";
import ClickSpark from './components/ClickSpark';

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <HeroSection />
      <SongList />
    </div>
  );
}

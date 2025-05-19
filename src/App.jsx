import HeroSection from "./components/HeroSection";
import SongList from "./components/SongList";
import ClickSpark from './components/ClickSpark';

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <ClickSpark
        sparkColor='black'
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
      <HeroSection />
      <SongList />
      </ClickSpark>
      
    </div>
  );
}

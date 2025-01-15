import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Blocks, BookOpen, GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BrailleCell } from './components/BrailleCell';
import { ProgressBar } from './components/ProgressBar';
import { useProgress } from './hooks/useProgress';
import { useAudio } from './hooks/useAudio';
import { brailleAlphabet, brailleNumbers, braillePunctuation, checkPattern } from './lib/braille';

// Components
const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

// Pages
const Home = () => {
  const { progress } = useProgress();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Learn LEGO Braille Bricks with DARJYO</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
        <div className="grid gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Letters</span>
              <span>{Math.round((progress.letters / brailleAlphabet.length) * 100)}%</span>
            </div>
            <ProgressBar progress={progress.letters} total={brailleAlphabet.length} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Numbers</span>
              <span>{Math.round((progress.numbers / brailleNumbers.length) * 100)}%</span>
            </div>
            <ProgressBar progress={progress.numbers} total={brailleNumbers.length} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Punctuation</span>
              <span>{Math.round((progress.punctuation / braillePunctuation.length) * 100)}%</span>
            </div>
            <ProgressBar progress={progress.punctuation} total={braillePunctuation.length} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=2070"
            alt="Colorful LEGO bricks"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">Learn Braille with DARJYO</h2>
          <p className="text-gray-600 mb-4">Start your journey into the world of Braille with our interactive lessons.</p>
          <Link
            to="/learn"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Learning
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=2071"
            alt="Child playing with LEGO"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">Practice with DARJYO</h2>
          <p className="text-gray-600 mb-4">Reinforce your learning with fun, interactive exercises.</p>
          <Link
            to="/practice"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Practice
          </Link>
        </div>
      </div>
    </div>
  );
};

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState<'letters' | 'numbers' | 'punctuation' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playSuccess } = useAudio();
  const { updateProgress } = useProgress();

  const categories = {
    letters: brailleAlphabet,
    numbers: brailleNumbers,
    punctuation: braillePunctuation
  };

  const currentSet = selectedCategory ? categories[selectedCategory] : null;
  const currentChar = currentSet?.[currentIndex];

  const handleNext = () => {
    playSuccess();
    if (currentSet && currentIndex < currentSet.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
      setSelectedCategory(null);
      if (selectedCategory) {
        updateProgress(selectedCategory, currentIndex + 1);
      }
    }
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Learn Braille with DARJYO</h1>
        <div className="grid gap-6">
          {Object.entries(categories).map(([category, chars]) => (
            <button
              key={category}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setSelectedCategory(category as keyof typeof categories)}
            >
              <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {chars.slice(0, 4).map((char, i) => (
                  <BrailleCell key={i} pattern={char.pattern} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{selectedCategory} with DARJYO</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-8">
          <div className="text-6xl font-bold">{currentChar?.char}</div>
          <BrailleCell pattern={currentChar?.pattern || []} />
          <button
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const Practice = () => {
  const [currentPattern, setCurrentPattern] = useState<number[]>([]);
  const [currentChar, setCurrentChar] = useState(() => brailleAlphabet[Math.floor(Math.random() * brailleAlphabet.length)]);
  const { playSuccess, playError } = useAudio();
  const { updateProgress } = useProgress();

  const handleDotClick = (position: number) => {
    setCurrentPattern(prev => 
      prev.includes(position)
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };

  const handleCheck = () => {
    if (checkPattern(currentPattern, currentChar)) {
      playSuccess();
      updateProgress('letters', 1);
      setCurrentChar(brailleAlphabet[Math.floor(Math.random() * brailleAlphabet.length)]);
      setCurrentPattern([]);
    } else {
      playError();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Practice with DARJYO</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Letter Recognition</h2>
          <div className="flex flex-col items-center gap-6">
            <div className="text-6xl font-bold">{currentChar.char}</div>
            <BrailleCell
              pattern={currentPattern}
              onDotClick={handleDotClick}
              interactive
            />
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleCheck}
            >
              Check Answer
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Word Building</h2>
          <p className="text-gray-600 mb-4">Coming soon! Practice building complete words using Braille patterns.</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2">
                <Blocks className="h-8 w-8 text-blue-500" />
                <span className="font-bold text-xl">Braille Bricks by DARJYO</span>
              </Link>
              
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>

              <div className="hidden md:flex items-center gap-4">
                <NavLink to="/learn">
                  <BookOpen className="h-5 w-5" />
                  Learn
                </NavLink>
                <NavLink to="/practice">
                  <GraduationCap className="h-5 w-5" />
                  Practice
                </NavLink>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <NavLink to="/learn" onClick={closeMenu}>
                  <BookOpen className="h-5 w-5" />
                  Learn
                </NavLink>
                <NavLink to="/practice" onClick={closeMenu}>
                  <GraduationCap className="h-5 w-5" />
                  Practice
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/practice" element={<Practice />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

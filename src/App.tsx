import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GRID_ROWS = 15;
const GRID_COLS = 20;

function App() {
  const [currentCol, setCurrentCol] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  const calculateWave = (col: number) => {
    const wave = Array(GRID_ROWS).fill(0).map(() => Array(GRID_COLS).fill(0));
    
    for (let i = 0; i < GRID_ROWS; i++) {
      for (let j = 0; j < GRID_COLS; j++) {
        const distance = Math.abs(j - col);
        if (distance <= 2) {
          wave[i][j] = Math.max(0, 1 - distance * 0.3);
        }
      }
    }
    return wave;
  };

  const [wave, setWave] = useState(() => calculateWave(currentCol));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCol(prev => {
        const next = prev + direction;
        
        // If we hit the right edge or left edge, change direction
        if (next >= GRID_COLS - 1) {
          setDirection(-1); // Start moving left
          return GRID_COLS - 2;
        } else if (next <= 0) {
          setDirection(1); // Start moving right
          return 1;
        }
        
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    setWave(calculateWave(currentCol));
  }, [currentCol]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-500 mb-4">Wave Scanner</h1>
        <p className="text-gray-400">Dynamic Grid Animation</p>
      </div>

      <div className="bg-black p-8 rounded-lg shadow-2xl border border-green-500/30">
        <div 
          className="grid gap-1" 
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
            width: 'fit-content'
          }}
        >
          {wave.map((row, i) =>
            row.map((value, j) => (
              <motion.div
                key={`${i}-${j}`}
                className="w-5 h-5 rounded-sm"
                initial={{ backgroundColor: 'rgb(0, 0, 0)' }}
                animate={{
                  backgroundColor: `rgb(0, ${Math.floor(value * 255)}, 0)`
                }}
                transition={{ duration: 0.2 }}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-green-400">Grid Size: {GRID_ROWS}x{GRID_COLS}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
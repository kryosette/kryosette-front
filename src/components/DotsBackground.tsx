"use client";

import { useEffect, useState } from "react";

const DotsBackground = () => {
  const [dots, setDots] = useState<{ x: number; y: number; key: string }[]>([]);

  useEffect(() => {
    const spacing = 28;
    const columns = Math.ceil(window.innerWidth / spacing) + 2;
    const rows = Math.ceil(window.innerHeight / spacing) + 2;
    const items = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        items.push({
          x: col * spacing,
          y: row * spacing,
          key: `${row}-${col}`,
        });
      }
    }
    setDots(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {dots.map((dot) => (
        <div
          key={dot.key}
          className="absolute rounded-full bg-black"
          style={{
            left: dot.x,
            top: dot.y,
            width: 2,
            height: 2,
            opacity: 0.08,
          }}
        />
      ))}
    </div>
  );
};

export default DotsBackground;
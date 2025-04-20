import React from 'react';

export default function Obstacle({ x, y, type }) {
  const image = type === 'rock' ? '/rock.png' : '/mine.png';
  return (
    <div
      className="obstacle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundImage: `url(${image})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

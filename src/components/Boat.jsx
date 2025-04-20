import React from 'react';

export default function Boat({ x, shield }) {
  return (
    <div
      className="boat"
      style={{
        left: `${x}%`,
        boxShadow: shield ? '0 0 20px gold' : 'none',
      }}
    />
  );
}

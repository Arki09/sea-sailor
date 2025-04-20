import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import './Game.css';

export default function BoatGame() {
  const [boatPosition, setBoatPosition] = useState(50); // Boat position (centered initially)
  const [obstacles, setObstacles] = useState([]); // State to hold obstacles
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  // Set up background music
  const backgroundMusic = new Howl({
    src: ['/music.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.1,
  });

  // Set up crash sound
  const crashSound = new Howl({
    src: ['/crash.mp3'],
    volume: 0.7,
  });

  // Function to generate obstacles
  const generateObstacles = () => {
    const newObstacle = {
      x: Math.random() * 100, // Random x position (within game area)
      y: 0, // Start at the top of the screen
      width: 30, // Obstacle width
      height: 30, // Obstacle height
    };
    setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
  };

  // Move obstacles down the screen
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // Move obstacles down
      setObstacles((prevObstacles) => {
        return prevObstacles.map((obstacle) => ({
          ...obstacle,
          y: obstacle.y + 5, // Move down by 5 pixels each frame
        }));
      });

      // Generate new obstacles at random intervals
      if (Math.random() < 0.05) {
        generateObstacles();
      }

      // Check for collisions
      checkCollision();

    }, 100);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [gameOver]);

  const checkCollision = () => {
    obstacles.forEach((obstacle) => {
      // Simple collision check (based on position and size)
      if (
        obstacle.y >= 90 && // Obstacle has reached the bottom of the screen
        obstacle.x >= boatPosition - 10 && // Obstacle is near the boat horizontally
        obstacle.x <= boatPosition + 10 // Obstacle is near the boat horizontally
      ) {
        setLives(lives - 1); // Decrease lives on collision
        crashSound.play(); // Play crash sound

        // If lives reach 0, game over
        if (lives - 1 <= 0) {
          setGameOver(true);
          backgroundMusic.stop(); // Stop background music on game over
        }
      }
    });
  };

  // Handle boat movement
  const handleBoatMove = (e) => {
    if (e.key === 'ArrowLeft' && boatPosition > 0) {
      setBoatPosition(boatPosition - 5); // Move boat left
    }
    if (e.key === 'ArrowRight' && boatPosition < 100) {
      setBoatPosition(boatPosition + 5); // Move boat right
    }
  };

  // Add event listener for boat movement
  useEffect(() => {
    window.addEventListener('keydown', handleBoatMove);
    return () => {
      window.removeEventListener('keydown', handleBoatMove);
    };
  }, [boatPosition]);

  // Render obstacles
  const obstacleElements = obstacles.map((obstacle, index) => (
    <div
      key={index}
      className="obstacle"
      style={{
        position: 'absolute',
        top: `${obstacle.y}%`,
        left: `${obstacle.x}%`,
        width: `${obstacle.width}px`,
        height: `${obstacle.height}px`,
        backgroundColor: 'red',
      }}
    ></div>
  ));

  return (
    <div className="game-container">
      <div className="score">Score: {score} | Lives: {lives}</div>
      <div className="game-area">
        {!gameOver ? (
          <div className="boat" style={{ left: `${boatPosition}%` }}>
            🚤 {/* Boat emoji */}
          </div>
        ) : (
          <div className="game-over">Game Over! Click to Restart.</div>
        )}
        {obstacleElements}
      </div>
    </div>
  );
}

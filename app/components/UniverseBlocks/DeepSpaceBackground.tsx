"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Star, ShootingStar } from '../../types/universe'

const DeepSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize stars
  const initializeStars = (width: number, height: number) => {
    const stars: Star[] = [];
    // Reduce star count for better performance
    const starCount = Math.floor((width * height) / 8000); // Reduced from 3000 to 8000

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5, // Stars size between 0.5 and 2
        opacity: Math.random() * 0.8 + 0.2, // Base opacity
        twinkleSpeed: Math.random() * 0.02 + 0.005, // Twinkling speed
        twinklePhase: Math.random() * Math.PI * 2, // Random starting phase
        brightness: Math.random() * 0.5 + 0.5, // Brightness variation
      });
    }
    starsRef.current = stars;
  };

  // Initialize shooting stars
  const initializeShootingStars = () => {
    const shootingStars: ShootingStar[] = [];
    // Reduce from 3 to 2 for better performance
    for (let i = 0; i < 2; i++) {
      shootingStars.push({
        x: 0,
        y: 0,
        length: 0,
        speed: 0,
        angle: 0,
        opacity: 0,
        active: false,
      });
    }
    shootingStarsRef.current = shootingStars;
  };

  // Create shooting star
  const createShootingStar = (width: number, height: number) => {
    const inactiveStars = shootingStarsRef.current.filter(star => !star.active);
    if (inactiveStars.length === 0) return;

    const star = inactiveStars[0];
    const side = Math.floor(Math.random() * 4); // Which side to start from

    switch (side) {
      case 0: // Top
        star.x = Math.random() * width;
        star.y = -50;
        star.angle = Math.random() * Math.PI / 3 + Math.PI / 6; // 30-60 degrees down
        break;
      case 1: // Right
        star.x = width + 50;
        star.y = Math.random() * height;
        star.angle = Math.random() * Math.PI / 3 + Math.PI * 2 / 3; // 120-150 degrees
        break;
      case 2: // Bottom
        star.x = Math.random() * width;
        star.y = height + 50;
        star.angle = Math.random() * Math.PI / 3 + Math.PI * 7 / 6; // 210-240 degrees
        break;
      case 3: // Left
        star.x = -50;
        star.y = Math.random() * height;
        star.angle = Math.random() * Math.PI / 3 + Math.PI * 11 / 6; // 330-360 degrees
        break;
    }

    star.length = Math.random() * 60 + 20;
    star.speed = Math.random() * 3 + 2;
    star.opacity = 1;
    star.active = true;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;

    // Clear canvas with deep space gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a1a'); // Deep dark blue
    gradient.addColorStop(0.3, '#000510'); // Very dark blue
    gradient.addColorStop(0.6, '#000208'); // Almost black
    gradient.addColorStop(1, '#000000'); // Pure black

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw twinkling stars
    starsRef.current.forEach((star) => {
      // Update twinkling
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7; // Oscillate between 0.4 and 1
      const currentOpacity = star.opacity * twinkle * star.brightness;

      // Create star glow effect
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.radius * 3
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
      gradient.addColorStop(0.4, `rgba(255, 255, 255, ${currentOpacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw bright center
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Update and draw shooting stars
    shootingStarsRef.current.forEach((star) => {
      if (!star.active) return;

      // Update position
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.opacity -= 0.01; // Fade out

      if (star.opacity <= 0 || 
          star.x < -100 || star.x > width + 100 || 
          star.y < -100 || star.y > height + 100) {
        star.active = false;
        return;
      }

      // Draw shooting star trail
      const tailX = star.x - Math.cos(star.angle) * star.length;
      const tailY = star.y - Math.sin(star.angle) * star.length;

      const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${star.opacity * 0.6})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(star.x, star.y);
      ctx.stroke();

      // Draw bright head
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Randomly create shooting stars - reduce frequency
    if (Math.random() < 0.001) { // Reduced from 0.003 to 0.001
      createShootingStar(width, height);
    }

    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    canvas.width = newWidth;
    canvas.height = newHeight;

    setDimensions({ width: newWidth, height: newHeight });
    initializeStars(newWidth, newHeight);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    initializeShootingStars();

    // Start animation
    animate();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      animate();
    }
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-black"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -10,
      }}
    />
  );
};

export default DeepSpaceBackground;

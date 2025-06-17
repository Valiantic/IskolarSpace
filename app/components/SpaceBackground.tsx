import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  velocity: number;
  alpha: number;
  color: string;
}


const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const stars: Star[] = [];
    const numStars = 200;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };
      const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          velocity: Math.random() * 0.2 + 0.05,
          alpha: Math.random() * 0.5 + 0.5,
          color: Math.random() > 0.8 ? '#90e0ef' : Math.random() > 0.6 ? '#caf0f8' : '#ffffff'
        });
      }
    };    

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      

      
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        star.x += star.velocity;
        
        if (star.x > canvas.width) {
          star.x = 0;
        }
          ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        const hex = star.color.substring(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.alpha})`;
        
        ctx.fill();
      }
      
      if (Math.random() < 0.01) {
        const shootingStar = {
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 2),
          length: Math.random() * 80 + 20,
          velocity: Math.random() * 10 + 5,
          angle: Math.PI / 4,
          decay: 0.02,
          alpha: 1
        };
        
        const drawShootingStar = () => {
          if (shootingStar.alpha <= 0) return;
          
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
            shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length
          );         
          const gradient = ctx.createLinearGradient(
            shootingStar.x, 
            shootingStar.y,
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
            shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length
          );
          
          gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
          gradient.addColorStop(1, `rgba(144, 224, 239, ${shootingStar.alpha * 0.5})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          shootingStar.x += shootingStar.velocity * Math.cos(shootingStar.angle);
          shootingStar.y += shootingStar.velocity * Math.sin(shootingStar.angle);
          shootingStar.alpha -= shootingStar.decay;
          
          if (shootingStar.alpha > 0) {
            requestAnimationFrame(drawShootingStar);
          }
        };
        
        drawShootingStar();
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
      window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);
    return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #001233, #023e8a, #0077b6)' }}
    />
  );
};

export default SpaceBackground;

import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  
  // Use refs for positions to avoid re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const outlinePos = useRef({ x: 0, y: 0 });
  const requestRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isClickable);
    };

    // Animation loop for smooth movement
    const animate = () => {
      // Smooth the dot slightly
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 1.0; // Instant for the center dot
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 1.0;

      // Lerp for the outline (0.15 provides a nice lag/fluidity)
      outlinePos.current.x += (mousePos.current.x - outlinePos.current.x) * 0.15;
      outlinePos.current.y += (mousePos.current.y - outlinePos.current.y) * 0.15;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = `translate3d(${outlinePos.current.x}px, ${outlinePos.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      {/* 
          IMPORTANT: Remove CSS transition-transform from position. 
          Only keep transitions for scale/color.
      */}
      <div 
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-accent pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 will-change-transform ${isHovering ? 'scale-0' : 'scale-100'}`}
      />
      <div 
        ref={cursorOutlineRef}
        className={`fixed top-0 left-0 rounded-full border-2 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color] duration-500 ease-out will-change-transform ${isHovering ? 'w-14 h-14 border-accent bg-accent/5' : 'w-10 h-10 border-accent/30'}`}
      />
    </>
  );
};

export default CustomCursor;

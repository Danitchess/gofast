'use client';

import { useEffect, useRef, useState } from 'react';

export default function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      const duration = 1400;
      const start = performance.now();
      const isInt = value % 1 === 0;
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = value * eased;
        setDisplay((isInt ? Math.round(current) : current.toFixed(1)) + suffix);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      animate();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          io.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);

  return <span ref={ref}>{display}</span>;
}

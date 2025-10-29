import { useState, useEffect, useRef } from 'react';

interface CounterProps {
  target: number;
  duration?: number;
}

const Counter = ({ target, duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = target;
          const startTime = Date.now();

          const animateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              setCount(end); // Ensure it ends on the exact target
            }
          };
          requestAnimationFrame(animateCount);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
};

export default Counter;

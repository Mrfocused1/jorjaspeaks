import React, { useRef } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";

export const StickyScroll = ({ content }: { content: { title: string; description: string; content?: React.ReactNode }[] }) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
    "linear-gradient(to bottom right, rgb(6 182 212), rgb(16 185 129))",
  ];

  return (
    <div ref={ref} className="sticky-scroll-section">
      <div className="sticky-scroll-left-panel">
        {content.map((item, index) => (
          <div key={item.title + index} className="sticky-scroll-card-content">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              className="sticky-scroll-title"
            >
              {item.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              className="sticky-scroll-description"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>
      <motion.div
        animate={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        className="sticky-scroll-right-panel"
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </div>
  );
};
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="timeline-wrapper"
      ref={containerRef}
    >
      <div className="timeline-header">
        <h2 className="timeline-title">
          Speaking Topics
        </h2>
        <p className="timeline-subtitle">
          Transformative presentations designed to inspire action and drive meaningful change in your organization.
        </p>
      </div>

      <div ref={ref} className="timeline-container">
        {data.map((item, index) => (
          <div
            key={index}
            className="timeline-item"
          >
            <div className="timeline-marker-container">
              <div className="timeline-marker-outer">
                <div className="timeline-marker-inner" />
              </div>
              <h3 className="timeline-item-title-desktop">
                {item.title}
              </h3>
            </div>

            <div className="timeline-content">
              <h3 className="timeline-item-title-mobile">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="timeline-line"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="timeline-progress"
          />
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  duration?: number;
}

export const Reveal = ({ 
  children, 
  width = '100%', 
  delay = 0, 
  direction = 'up',
  className = '',
  duration = 0.8
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const yOffset = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;
  const xOffset = direction === 'left' ? 40 : direction === 'right' ? -40 : 0;

  return (
    <div ref={ref} style={{ width }} className={twMerge(clsx("relative", className))}>
      <motion.div
        variants={{
          hidden: { 
            opacity: 0, 
            y: yOffset,
            x: xOffset,
            scale: 0.98
          },
          visible: { 
            opacity: 1, 
            y: 0,
            x: 0,
            scale: 1
          },
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: duration, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

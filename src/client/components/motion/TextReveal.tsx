import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const TextReveal = ({ children, delay = 0, className = '' }: TextRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <div ref={ref} className={twMerge(clsx("relative overflow-hidden", className))}>
      <motion.div
        variants={{
          hidden: { 
            y: '110%',
            opacity: 0,
            rotateZ: 2
          },
          visible: { 
            y: 0,
            opacity: 1,
            rotateZ: 0,
            transition: {
              duration: 1.2,
              delay: delay,
              ease: [0.16, 1, 0.3, 1]
            }
          }
        }}
        initial="hidden"
        animate={controls}
      >
        {children}
      </motion.div>
    </div>
  );
};

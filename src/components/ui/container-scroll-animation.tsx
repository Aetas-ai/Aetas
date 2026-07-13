import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.96, 1] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -30 : -90]);

  return (
    <div ref={containerRef} className="relative flex min-h-[48rem] items-center justify-center px-4 py-20 md:min-h-[70rem] md:px-8">
      <div className="relative w-full">
        <motion.div style={{ translateY: translate }} className="mx-auto mb-8 max-w-5xl text-center">
          {titleComponent}
        </motion.div>
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a',
      }}
      className="mx-auto h-[22rem] w-full max-w-6xl rounded-[26px] border border-white/15 bg-[#12141d] p-2 shadow-2xl md:h-[38rem] md:rounded-[34px] md:p-4"
    >
      <div className="h-full w-full overflow-hidden rounded-[20px] bg-black md:rounded-[26px]">
        {children}
      </div>
    </motion.div>
  );
}

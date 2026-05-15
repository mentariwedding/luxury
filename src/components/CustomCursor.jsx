"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 350, damping: 30, restDelta: 0.001 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Slightly lagged ring for luxury feel
  const ringSpringConfig = { stiffness: 180, damping: 25, restDelta: 0.001 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    // Detect touch device
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setIsTouch(false);

    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleOver = (e) => {
      const target = e.target;
      const isInteractive = !!target.closest(
        'a, button, [role="button"], input, select, textarea',
      );
      // Detect cards with data-cursor-label attribute
      const cursorEl = target.closest("[data-cursor-label]");
      const label = cursorEl?.dataset?.cursorLabel || "";
      setIsHovering(isInteractive || !!cursorEl);
      setCursorLabel(label);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    document.documentElement.style.cursor = "none";
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseover", handleOver);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseover", handleOver);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Inner dot — fast */}
      <motion.div
        className="fixed z-[99999] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            opacity: isVisible ? (isHovering ? 0 : 0.9) : 0,
            scale: isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-2 h-2 rounded-full bg-[#CEB175]"
        />
      </motion.div>

      {/* Outer ring — lagged */}
      <motion.div
        className="fixed z-[99998] pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            opacity: isVisible ? (isHovering ? 0.7 : 0.25) : 0,
            scale: isHovering ? 1 : 0.5,
            width: isHovering ? (cursorLabel ? 56 : 40) : 20,
            height: isHovering ? (cursorLabel ? 56 : 40) : 20,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full border border-[#CEB175]"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence>
            {cursorLabel && isHovering && (
              <motion.span
                key={cursorLabel}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#CEB175] font-light uppercase"
                style={{
                  fontSize: "6px",
                  letterSpacing: "0.3em",
                  pointerEvents: "none",
                }}
              >
                {cursorLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

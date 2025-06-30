"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  {
    value: 20,
    label: "Countries Reached",
    color: "#56B13E",
    suffix: "+",
  },
  {
    value: 30,
    label: "No. Of Categories",
    color: "#F2C94C",
    suffix: "+",
  },
  {
    value: 2500,
    label: "Customer",
    color: "#56B13E",
    suffix: "",
  },
  {
    value: 99,
    label: "Solution Provided",
    color: "#56B13E",
    suffix: "%",
  },
  {
    value: 1,
    label: "MHE Solution Provider",
    color: "#FF6333",
    suffix: "st",
  },
];

interface AnimatedCircleProps {
  value: number;
  label: string;
  color: string;
  suffix: string;
  duration?: number;
}

const AnimatedCircle = ({
  value,
  label,
  color,
  suffix,
  duration = 1.5,
}: AnimatedCircleProps) => {
  const controls = useAnimation();
  const radius = 60;
  const stroke = 13;
  const circumference = 2 * Math.PI * radius;
  const valueRef = useRef<HTMLSpanElement>(null);

  // For numbers > 100, always show full ring
  const percent = value > 100 ? 1 : value / 100;

  useEffect(() => {
    controls.start({ strokeDashoffset: circumference * (1 - percent) });

    // Animate number counting up
    const start = 0;
    let startTimestamp: number | null = null;
    let raf: number;

    const animateValue = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min(
        (timestamp - startTimestamp) / (duration * 1000),
        1
      );
      const current =
        value > 100 ? value : Math.floor(progress * (value - start) + start);

      if (valueRef.current) {
        valueRef.current.textContent =
          value > 100 ? `${value}${suffix}` : `${current}${suffix}`;
      }

      if (progress < 1 && value <= 100) {
        raf = requestAnimationFrame(animateValue);
      } else if (valueRef.current) {
        valueRef.current.textContent = `${value}${suffix}`;
      }
    };

    raf = requestAnimationFrame(animateValue);

    return () => cancelAnimationFrame(raf);
  }, [controls, circumference, percent, value, suffix, duration]);

  return (
    <div className="flex flex-col items-center w-40 min-w-[140px] mx-auto group transition-all duration-300 hover:scale-105">
      <div className="relative flex items-center justify-center">
        <svg width={140} height={140} className="mb-2 block">
          {/* Background ring */}
          <circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke="#E5ECE3"
            strokeWidth={stroke}
          />
          {/* Animated colored ring */}
          <motion.circle
            cx={70}
            cy={70}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 70 70)"
            style={{
              transition: "filter 0.3s",
            }}
            animate={controls}
            transition={{ duration, ease: "easeInOut" }}
          />
        </svg>
        {/* Centered value */}
        <span
          ref={valueRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[1.7rem] md:text-3xl font-extrabold"
          style={{ color }}
        >
          0{suffix}
        </span>
      </div>
      <span className="text-base md:text-lg text-gray-900 text-center mt-2 font-medium leading-tight">
        {label}
      </span>
    </div>
  );
};

const AboutStats = () => (
  <section className="w-full py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-900">
        Brand Presence Globally
      </h2>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {stats.map((stat, i) => (
          <AnimatedCircle key={i} {...stat} duration={1.2 + i * 0.18} />
        ))}
      </div>
    </div>
  </section>
);

export default AboutStats;

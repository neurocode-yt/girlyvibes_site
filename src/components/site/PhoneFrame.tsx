import { motion } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  notch?: "rose" | "cream" | "blush" | "dark";
  glow?: boolean;
};

const notchClass: Record<NonNullable<Props["notch"]>, string> = {
  rose: "bg-gradient-to-br from-[#FDE8EF] to-[#FBC4D6] dark:from-[#3a2230] dark:to-[#5a2f44]",
  cream: "bg-gradient-to-br from-[#FFF9F7] to-[#FBE4EC] dark:from-[#3a2230] dark:to-[#5a2f44]",
  blush: "bg-gradient-to-br from-[#F7C9D9] to-[#E59DB8] dark:from-[#3a2230] dark:to-[#5a2f44]",
  dark: "bg-gradient-to-br from-[#3a2230] to-[#5a2f44]",
};

export function PhoneFrame({ children, className = "", notch = "rose", glow = false }: Props) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      {glow && (
        <div
          aria-hidden
          className="absolute -inset-8 rounded-[60px] blur-3xl opacity-70"
          style={{ background: "radial-gradient(circle, #F7C9D9, transparent 70%)" }}
        />
      )}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="relative mx-auto w-[280px] md:w-[320px] aspect-[9/19] rounded-[44px] bg-[#1a1014] p-2.5 shadow-2xl">
          <div className={`relative w-full h-full rounded-[36px] overflow-hidden ${notchClass[notch]}`}>
            {/* Dynamic island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black/60 z-20" />
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

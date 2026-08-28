import { motion } from "framer-motion";
import profileImg from "@/assets/me.jpg";

export default function ProfilePhoto() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 70%, hsl(210 100% 65% / 0.8) 100%)",
        }}
      />

      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          boxShadow:
            "0 0 40px hsl(210 100% 65% / 0.3), 0 0 80px hsl(210 100% 65% / 0.15)",
          background:
            "radial-gradient(circle, hsl(210 100% 65% / 0.1) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative w-60 h-60 rounded-full overflow-hidden border-2 z-10"
        style={{ borderColor: "hsl(210 100% 65% / 0.6)" }}
      >
        <img
          src={profileImg}
          alt="Mohammad Aljamal"
          className="w-full h-full object-cover"
          style={{ objectPosition: "50% 18%" }}
        />
      </div>

      {[0, 90, 180, 270].map((deg) => (
        <motion.div
          key={deg}
          className="absolute w-2 h-2 rounded-full bg-primary"
          style={{
            transform: `rotate(${deg}deg) translateY(-148px)`,
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: deg / 360,
          }}
        />
      ))}
    </motion.div>
  );
}

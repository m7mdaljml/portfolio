import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Terminal } from "lucide-react";

interface DevLoaderProps {
  show: boolean;
  onComplete?: () => void;
}

export default function DevLoader({ show, onComplete }: DevLoaderProps) {
  const [progress, setProgress] = useState(0);

  const reset = useCallback(() => {
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!show) {
      reset();
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, 120);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        onComplete?.();
      }, 100);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
      reset();
    };
  }, [show, onComplete, reset]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="w-[340px] rounded-xl border border-border shadow-2xl overflow-hidden bg-card"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <Terminal size={12} className="text-muted-foreground ml-2" />
              <span className="text-[11px] text-muted-foreground font-mono tracking-tight">
                dev-loader
              </span>
            </div>

            <div className="px-4 pb-4 mt-3">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {progress < 100 ? "compiling..." : "complete"}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

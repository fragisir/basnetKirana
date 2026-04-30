"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="relative"
          >
            <div className="w-32 h-32 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 flex items-center justify-center shadow-2xl shadow-blue-900/40">
              <Store size={64} className="text-white drop-shadow-lg" />
            </div>
            
            {/* Pulsing effect */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-white rounded-[2.5rem] -z-10"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <h1 className="text-4xl font-black uppercase tracking-[0.2em]">Pasal Udhaar</h1>
            <p className="text-blue-200 mt-2 font-medium tracking-widest uppercase text-sm">Basnet Khadnya Bikri Sasta</p>
          </motion.div>

          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="mt-12 h-1 bg-white/20 rounded-full overflow-hidden w-[200px]"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="h-full bg-white w-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

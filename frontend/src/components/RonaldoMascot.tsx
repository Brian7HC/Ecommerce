import { motion, AnimatePresence } from 'framer-motion';

interface RonaldoMascotProps {
  isHiding: boolean;
}

export const RonaldoMascot = ({ isHiding }: RonaldoMascotProps) => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
      {/* Simple Stylized Ronaldo Head */}
      <motion.div 
        className="relative w-24 h-24 bg-orange-200 rounded-full border-4 border-zinc-800 overflow-hidden"
        animate={{ scale: isHiding ? 0.95 : 1 }}
      >
        {/* Hair */}
        <div className="absolute top-0 w-full h-1/3 bg-zinc-900 rounded-t-full" />
        
        {/* Eyes Section */}
        <div className="absolute top-1/2 left-0 w-full flex justify-around px-4 -translate-y-1/2">
          {/* Left Eye */}
          <div className="relative w-4 h-4">
             <motion.div 
                className="w-full h-full bg-white rounded-full flex items-center justify-center"
                animate={{ height: isHiding ? 2 : 16 }}
                transition={{ duration: 0.2 }}
             >
                {!isHiding && <div className="w-2 h-2 bg-zinc-900 rounded-full" />}
             </motion.div>
          </div>
          {/* Right Eye */}
          <div className="relative w-4 h-4">
             <motion.div 
                className="w-full h-full bg-white rounded-full flex items-center justify-center"
                animate={{ height: isHiding ? 2 : 16 }}
                transition={{ duration: 0.2 }}
             >
                {!isHiding && <div className="w-2 h-2 bg-zinc-900 rounded-full" />}
             </motion.div>
          </div>
        </div>

        {/* Mouth */}
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-2 bg-red-400 rounded-full"
          animate={{ scaleX: isHiding ? 0.5 : 1 }}
        />
      </motion.div>

      {/* Hands */}
      <AnimatePresence>
        {isHiding && (
          <>
            <motion.div
              initial={{ y: 80, opacity: 0, x: -40, rotate: -45 }}
              animate={{ y: -15, opacity: 1, x: -22, rotate: -25 }}
              exit={{ y: 80, opacity: 0, x: -40, rotate: -45 }}
              transition={{ type: 'spring', damping: 15 }}
              className="absolute z-20 w-14 h-20 bg-orange-200 border-4 border-zinc-800 rounded-[2rem] shadow-xl"
              style={{ top: '35%', left: '0%' }}
            >
               {/* Finger Detail */}
               <div className="absolute top-2 right-2 w-1 h-8 bg-black/10 rounded-full" />
            </motion.div>
            <motion.div
              initial={{ y: 80, opacity: 0, x: 40, rotate: 45 }}
              animate={{ y: -15, opacity: 1, x: 22, rotate: 25 }}
              exit={{ y: 80, opacity: 0, x: 40, rotate: 45 }}
              transition={{ type: 'spring', damping: 15 }}
              className="absolute z-20 w-14 h-20 bg-orange-200 border-4 border-zinc-800 rounded-[2rem] shadow-xl"
              style={{ top: '35%', right: '0%' }}
            >
               {/* Finger Detail */}
               <div className="absolute top-2 left-2 w-1 h-8 bg-black/10 rounded-full" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SIUUU Text bubble when not hiding */}
      {!isHiding && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          className="absolute -top-4 -right-4 bg-white text-black text-[10px] font-black px-2 py-1 rounded-lg border-2 border-black rotate-12"
        >
          SIUUU!
        </motion.div>
      )}
    </div>
  );
};

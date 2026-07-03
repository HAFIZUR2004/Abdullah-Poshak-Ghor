import Image from "next/image";

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#faf8f5] flex flex-col items-center justify-center select-none">
      <div className="relative flex flex-col items-center">
        
        {/* 1. Logo Area with Smooth Cinematic Drift */}
        <div className="relative w-24 h-24 mb-2 flex items-center justify-center animate-[logoDrift_3s_ease-in-out_infinite]">
          <Image
            src="/images/logo.webp"
            alt="Sareng Furniture Loading..."
            width={96}
            height={96}
            className="object-contain filter drop-shadow-[0_4px_12px_rgba(58,71,57,0.08)]"
            priority
          />
        </div>

        {/* 2. Brand Typography with Elegant Text Reveal */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-[0.15em] text-[#3a4739] uppercase font-sans mix-blend-multiply animate-[textReveal_2.5s_ease-in-out_infinite] leading-none">
            Sareng
          </h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#d69a45] font-semibold font-sans mt-1 ml-[0.3em] animate-[textReveal_2.5s_ease-in-out_infinite_0.2s] leading-none">
            Furniture
          </p>
        </div>

        {/* 3. Premium Glaze Loading Line */}
        <div className="mt-8 w-40 h-[2px] bg-[#3a4739]/10 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-[#d69a45] to-transparent animate-[shimmerLine_1.6s_infinite_linear]"></div>
        </div>

      </div>
      
      {/* Required Optimized Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes logoDrift {
          0%, 100% { transform: translateY(0px) scale(0.98); opacity: 0.85; }
          50% { transform: translateY(-5px) scale(1.02); opacity: 1; }
        }
        @keyframes textReveal {
          0%, 100% { opacity: 0.5; letter-spacing: 0.12em; filter: blur(0.5px); }
          50% { opacity: 1; letter-spacing: 0.18em; filter: blur(0px); }
        }
        @keyframes shimmerLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
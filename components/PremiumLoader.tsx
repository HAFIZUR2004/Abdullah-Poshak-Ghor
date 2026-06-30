import Image from "next/image";

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#faf8f5] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Pulsating Logo Container */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-[#3a4739] rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-white rounded-full p-2 flex items-center justify-center shadow-lg overflow-hidden border border-[#d69a45]/20">
            <Image
              src="/images/logo.webp"
              alt="Sareng Furniture Loading..."
              width={80}
              height={80}
              className="object-contain animate-pulse"
              priority
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col items-center text-center animate-pulse">
          <span className="text-2xl font-black tracking-wider text-[#3a4739] uppercase font-sans">
            Sareng
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[#d69a45] font-sans mt-1">
            Furniture
          </span>
        </div>

        {/* Elegant Loading Bar */}
        <div className="mt-8 w-48 h-[2px] bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#d69a45] w-full animate-[loading_1.5s_ease-in-out_infinite] origin-left"></div>
        </div>
      </div>
      
      {/* Required keyframes for custom animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          50.1% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}} />
    </div>
  );
}

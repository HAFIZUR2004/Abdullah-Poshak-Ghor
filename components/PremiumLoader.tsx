import Image from "next/image";

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#faf8f5] flex flex-col items-center justify-center select-none">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="w-20 h-20 mb-4 flex items-center justify-center">
          <Image
            src="https://i.ibb.co.com/chYMQcpM/Whats-App-Image-2026-11-06-at-9-40-51-PM.jpg"
            alt="Abdullah Poshak Ghor
"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-lg font-extrabold tracking-[0.2em] text-[#3a4739] uppercase leading-none">
          Abdullah 

        </h1>
        <p className="text-[9px] uppercase tracking-[0.35em] text-[#d69a45] font-semibold mt-1.5">
     Poshak Ghor

        </p>

        {/* Simple Loading Line */}
        <div className="mt-6 w-32 h-[2px] bg-[#3a4739]/10 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-[#d69a45] rounded-full animate-[loading_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes loading {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
          `,
        }}
      />
    </div>
  );
}
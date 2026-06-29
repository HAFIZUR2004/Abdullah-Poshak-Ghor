"use client";

import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function CartIcon() {
  const { getCartCount, isLoading } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative">
        <FiShoppingCart size={22} className="text-gray-600" />
      </div>
    );
  }

  const cartCount = getCartCount();

  if (isLoading) {
    return (
      <div className="relative">
        <FiShoppingCart size={22} className="text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      <FiShoppingCart
        size={22}
        className="text-gray-600 hover:text-primary-gold transition cursor-pointer"
      />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {cartCount}
        </span>
      )}
    </div>
  );
}

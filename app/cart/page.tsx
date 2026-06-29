"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiShoppingBag, FiChevronLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import CartSkeleton from "@/components/skeletons/CartSkeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    getCartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveItem = (itemId: number | string, itemName: string) => {
    Swal.fire({
      title: "Remove Item?",
      text: `Are you sure you want to remove "${itemName}" from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D98A2B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(itemId);
        toast.success(`${itemName} removed from cart`);
      }
    });
  };

  const handleCheckout = () => {
    // কার্ট ডাটা localStorage এ সেভ করুন
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    localStorage.setItem('checkoutTotal', String(getCartTotal()));

    // Checkout Page এ যান
    router.push('/checkout');
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;

    Swal.fire({
      title: "Clear Entire Cart?",
      text: `You have ${cart.length} items in your cart. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D98A2B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear all!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        toast.success("Cart cleared successfully");
      }
    });
  };

  // Loading state
  if (isLoading || !mounted) {
    return <CartSkeleton variant="page" count={3} />;
  }

  // Empty Cart State
  if (cart.length === 0) {
    return (
     <>
     <Navbar/>
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-gold transition mb-4 text-sm"
          >
            <FiChevronLeft size={18} />
            Back
          </button>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="text-gray-400" size={48} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Start shopping to add products!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-primary-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-gold/90 transition text-sm"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
     <Footer/>
     </>
    );
  }

  // Cart with Items
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-gold transition mb-3 md:mb-4 text-sm"
        >
          <FiChevronLeft size={18} />
          Back
        </button>

        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
          Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 space-y-3 md:space-y-4">
            {cart.map((item) => {
              const productId = (item._id ?? item.id) as string | number;
              return (
              <div
                key={productId}
                className="bg-white rounded-lg shadow-sm p-3 md:p-4 flex gap-3 md:gap-4 transition hover:shadow-md"
              >

                <div className="flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                      unoptimized // Cloudinary ইমেজের জন্য
                    />
                  ) : item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      📦
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                        <span className="text-primary-gold font-bold text-sm md:text-base">
                          ৳{item.price}
                        </span>
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-gray-400 text-xs md:text-sm line-through">
                              ৳{item.originalPrice}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(productId, parseInt(e.target.value))
                        }
                        className="border text-gray-500 border-gray-300 rounded-md px-1.5 py-1 md:px-2 md:py-1 text-xs md:text-sm focus:outline-none focus:border-primary-gold"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleRemoveItem(productId, item.name)}
                        className="text-red-500 hover:text-red-700 transition p-1"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-800 text-sm md:text-base">
                    ৳{item.price * item.quantity}
                  </p>
                </div>
              </div>
            );
            })}

            {/* Clear Cart Button */}
            <div className="text-right">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 text-xs md:text-sm font-medium transition"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-20">
              <h2 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>৳{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 md:pt-3">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span className="text-sm md:text-base">Total</span>
                    <span className="text-primary-gold text-lg md:text-xl">
                      ৳{getCartTotal()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-gold text-white py-2.5 md:py-3 rounded-lg font-semibold hover:bg-primary-gold/90 transition mb-3 text-sm md:text-base"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="block text-center text-xs md:text-sm text-gray-500 hover:text-primary-gold transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
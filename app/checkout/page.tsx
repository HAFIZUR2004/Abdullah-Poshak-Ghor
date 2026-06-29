"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  StickyNote,
  Wallet,
  Smartphone,
  Banknote,
  CreditCard,
  ShoppingBag,
  Percent,
  MessageCircle,
  Trash2,
  Shield,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

// Types
interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
  category?: string;
}

interface Thana {
  id: number;
  name: string;
  bn_name: string;
}

interface District {
  id: number;
  name: string;
  bn_name: string;
  thanas: Thana[] | string[];
}

interface Division {
  _id?: string;
  id: number;
  name: string;
  bn_name: string;
  districts: District[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Locations state
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableThanas, setAvailableThanas] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    division: "",
    district: "",
    thana: "",
    address: "",
    note: "",
  });

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load divisions from API
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await fetch("/api/divisions");
        if (res.ok) {
          const data = await res.json();
          setDivisions(data);
        } else {
          console.error("Failed to fetch divisions");
          toast.error("Failed to load location data");
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
        toast.error("Failed to load location data");
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchDivisions();
  }, []);

  // Load cart data
  useEffect(() => {
    const storedCart = localStorage.getItem("checkoutCart");
    const storedTotal = localStorage.getItem("checkoutTotal");

    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);

      if (storedTotal) {
        setSubtotal(Number(storedTotal));
      } else {
        const total = parsedCart.reduce(
          (sum: number, item: CartItem) => sum + item.price * item.quantity,
          0
        );
        setSubtotal(total);
      }
    } else {
      const mainCart = localStorage.getItem("cart");
      if (mainCart) {
        const parsedCart = JSON.parse(mainCart);
        setCartItems(parsedCart);
        const total = parsedCart.reduce(
          (sum: number, item: CartItem) => sum + item.price * item.quantity,
          0
        );
        setSubtotal(total);
      } else {
        router.push("/shop");
      }
    }
  }, [router]);

  // Auto-fill user data
  useEffect(() => {
    if (user && divisions.length > 0) {
      const savedData = localStorage.getItem("checkoutData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({
          ...prev,
          name: parsedData.formData?.name || user.displayName || "",
          phone: parsedData.formData?.phone || user.phoneNumber || "",
          division: parsedData.formData?.division || "",
          district: parsedData.formData?.district || "",
          thana: parsedData.formData?.thana || "",
          address: parsedData.formData?.address || "",
          note: parsedData.formData?.note || "",
        }));

        if (parsedData.formData?.division) {
          const selectedDivision = divisions.find(
            (div) => div.name === parsedData.formData.division
          );
          if (selectedDivision) {
            setAvailableDistricts(selectedDivision.districts);

            if (parsedData.formData?.district) {
              const selectedDistrict = selectedDivision.districts.find(
                (dist) => dist.name === parsedData.formData.district
              );
              if (selectedDistrict && selectedDistrict.thanas) {
                const thanasList = selectedDistrict.thanas.map((t: any) =>
                  typeof t === "string" ? t : t.name
                );
                setAvailableThanas(thanasList);
              }
            }
          }
        }

        localStorage.removeItem("checkoutData");
      } else {
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || prev.name,
          phone: user.phoneNumber || prev.phone,
        }));
      }
    }
  }, [user, divisions]);

  // Handle division change
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divisionName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      division: divisionName,
      district: "",
      thana: "",
    }));
    setAvailableDistricts([]);
    setAvailableThanas([]);

    if (divisionName.toLowerCase() === "dhaka") {
      setDeliveryCharge(60);
    } else if (divisionName) {
      setDeliveryCharge(120);
    } else {
      setDeliveryCharge(60);
    }

    const selectedDivision = divisions.find((div) => div.name === divisionName);
    if (selectedDivision) {
      setAvailableDistricts(selectedDivision.districts);
    }
  };

  // Handle district change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    setFormData((prev) => ({ ...prev, district: districtName, thana: "" }));

    if (formData.division) {
      const selectedDivision = divisions.find(
        (div) => div.name === formData.division
      );
      if (selectedDivision) {
        const selectedDistrict = selectedDivision.districts.find(
          (dist) => dist.name === districtName
        );
        if (selectedDistrict && selectedDistrict.thanas) {
          const thanasList = selectedDistrict.thanas.map((t: any) =>
            typeof t === "string" ? t : t.name
          );
          setAvailableThanas(thanasList);
        } else {
          setAvailableThanas([]);
        }
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyPromoCode = () => {
    if (promoCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo code applied! 10% discount added.");
    } else if (promoCode === "FREESHIP") {
      setDiscount(deliveryCharge);
      toast.success("Free shipping applied!");
    } else if (promoCode) {
      toast.error("Invalid promo code!");
    }
  };

  // Save order to database
  const saveOrderToDatabase = async (orderData: any) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        console.log("Order saved to database:", savedOrder);
        return savedOrder;
      } else {
        console.error("Failed to save order");
        return null;
      }
    } catch (error) {
      console.error("Error saving order:", error);
      return null;
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!user) {
      const checkoutData = {
        cartItems,
        formData,
        subtotal,
        deliveryCharge,
        paymentMethod,
        discount,
        promoCode,
      };
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      router.push("/login?redirect=/checkout");
      return;
    }

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.division ||
      !formData.district
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    setIsPlacingOrder(true);

    const totalAmount = subtotal + deliveryCharge - discount;

    const orderData = {
      cartItems,
      formData,
      subtotal,
      deliveryCharge,
      discount,
      totalAmount,
      paymentMethod,
      promoCode: promoCode || null,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || formData.name,
      status: "pending",
      createdAt: new Date().toISOString(),
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Save to database
    const savedOrder = await saveOrderToDatabase(orderData);

    if (savedOrder) {
      orderData.orderId = savedOrder.orderId || orderData.orderId;
      toast.success("Order placed successfully!");
    } else {
      // Still save locally even if database save fails
      toast.warning(
        "Order placed but could not save to database. We will contact you shortly."
      );
    }

    // Save to localStorage for confirmation page
    localStorage.setItem("orderData", JSON.stringify(orderData));

    // Clear cart
    localStorage.removeItem("checkoutCart");
    localStorage.removeItem("checkoutTotal");
    localStorage.removeItem("cart");

    setIsPlacingOrder(false);

    // Redirect based on payment method
    if (paymentMethod === "cash") {
      router.push("/order-confirmation");
    } else {
      router.push(
        `/payment?amount=${totalAmount}&method=online&orderId=${orderData.orderId}`
      );
    }
  };

  const removeItem = (id: number | string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("checkoutCart", JSON.stringify(updatedCart));

    const newTotal = updatedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(newTotal);
    localStorage.setItem("checkoutTotal", String(newTotal));

    toast.success("Item removed from cart");
  };

  const getItemImage = (item: CartItem) => {
    return item.image || (item.images && item.images[0]) || null;
  };

  if (isLoading || loadingLocations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-sm">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 mb-6">
                Please add products to your cart before checkout.
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="bg-primary-gold text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-gold/90 transition"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const totalAmount = subtotal + deliveryCharge - discount;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-700 mb-4">
                  Your Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-gray-700">
                    Delivery Address
                  </h2>
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Division Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Division *
                    </label>
                    <select
                      name="division"
                      value={formData.division}
                      onChange={handleDivisionChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition bg-white"
                      required
                    >
                      <option value="">Select Division</option>
                      {divisions.map((division) => (
                        <option key={division.id} value={division.name}>
                          {division.bn_name} ({division.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleDistrictChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition bg-white"
                      disabled={!formData.division || availableDistricts.length === 0}
                      required
                    >
                      <option value="">Select District</option>
                      {availableDistricts.map((district) => (
                        <option key={district.id} value={district.name}>
                          {district.bn_name} ({district.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thana Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Thana / Upazila
                    </label>
                    <select
                      name="thana"
                      value={formData.thana}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition bg-white"
                      disabled={!formData.district || availableThanas.length === 0}
                    >
                      <option value="">Select Thana</option>
                      {availableThanas.map((thana, index) => (
                        <option key={index} value={thana}>
                          {thana}
                        </option>
                      ))}
                    </select>
                    {formData.district && availableThanas.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ No thanas found for {formData.district}
                      </p>
                    )}
                  </div>

                  {/* Detailed Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Detailed Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Village / Post Office / House No. / Road"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Order Note */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <StickyNote className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-700">
                    Order Note (Optional)
                  </h2>
                </div>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Special instructions, delivery time, etc..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition resize-none"
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-700 mb-3">
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      paymentMethod === "cash"
                        ? "border-primary-gold bg-primary-gold/10"
                        : "border-gray-200 hover:border-primary-gold"
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="w-5 h-5 accent-primary-gold"
                      />
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary-gold" />
                        <label className="font-medium cursor-pointer text-gray-700">
                          Cash on Delivery
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-7">
                      Pay when you receive
                    </p>
                  </div>

                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      paymentMethod === "online"
                        ? "border-primary-gold bg-primary-gold/10"
                        : "border-gray-200 hover:border-primary-gold"
                    }`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="w-5 h-5 accent-primary-gold"
                      />
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary-gold" />
                        <label className="font-medium cursor-pointer text-gray-700">
                          Online Payment
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-7 mt-2">
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        <Smartphone className="w-3 h-3" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                        <Banknote className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-gray-500">
                        bKash, Nagad, Rocket
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm sticky top-4">
                <h2 className="text-lg font-bold text-gray-700 mb-4">
                  Order Summary
                </h2>

                {/* Dynamic Products from Cart */}
                <div className="max-h-[400px] overflow-y-auto mb-4 space-y-3">
                  {cartItems.map((item, index) => {
                    const imageSrc = getItemImage(item);
                    // ✅ Fixed: unique key using both id and index to avoid duplicates
                    const uniqueKey = item.id
                      ? `${item.id}-${index}`
                      : `item-${index}`;

                    return (
                      <div
                        key={uniqueKey}
                        className="flex items-start justify-between border-b border-gray-100 pb-3"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                            {imageSrc ? (
                              <Image
                                src={imageSrc}
                                alt={item.name}
                                width={56}
                                height={56}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <ShoppingBag className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>x {item.quantity}</span>
                              <span className="text-gray-400">|</span>
                              <span>৳{item.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="font-semibold text-gray-700 text-sm">
                            ৳{item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon */}
                <div className="flex items-center border border-gray-300 rounded-lg mb-4 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Promo Code (SAVE10 / FREESHIP)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-3 outline-none text-sm"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-3 text-gray-500 hover:text-primary-gold transition flex items-center gap-1 text-sm font-medium border-l border-gray-300"
                  >
                    <Percent className="w-4 h-4" /> Apply
                  </button>
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charge</span>
                    <span>৳{deliveryCharge.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-৳{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200 mt-3">
                    <span>Total</span>
                    <span className="text-primary-gold">
                      ৳{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-primary-gold hover:bg-primary-gold/90 text-white font-bold py-4 rounded-xl transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : user ? (
                    paymentMethod === "cash"
                      ? "Place Order (Cash on Delivery)"
                      : "Place Order (Online Payment)"
                  ) : (
                    "Login to Place Order"
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  You will receive a confirmation call after placing your order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/8801XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-full flex items-center gap-2 shadow-lg transition z-50"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Chat with us</span>
      </a>
      <Footer />
    </>
  );
}
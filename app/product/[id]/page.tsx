"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RefreshCw, 
  ChevronLeft,
  Minus,
  Plus,
  Share2,
  ThumbsUp,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  CreditCard 
} from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import ProductDetailsSkeleton from "@/components/skeletons/ProductDetailsSkeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Review Type
interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// FAQ Type
interface FAQ {
  question: string;
  answer: string;
}

const sampleFAQs: FAQ[] = [
  {
    question: "Are products original?",
    answer: "Yes, we provide 100% original and premium quality products sourced from authentic suppliers.",
  },
  {
    question: "How long is delivery?",
    answer: "Delivery takes 1-2 business days inside Dhaka and 2-4 business days outside Dhaka.",
  },
  {
    question: "Is Cash on Delivery available?",
    answer: "Yes, Cash on Delivery is available for all orders across Bangladesh.",
  },
  {
    question: "What if I don't like the product?",
    answer: "We offer return or replacement within 7 days of delivery if you're not satisfied with the product.",
  },
  {
    question: "How do I track my order?",
    answer: "You can track your order using your order number on our 'Track Order' page.",
  },
];

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "faq">("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const productId = params.id as string;

  // Fetch product from MongoDB
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const numericId = Number(productId);
          const foundProduct = data.find((p: Product) => 
            p._id === productId || (p.id !== undefined && p.id === numericId)
          );
          
          if (foundProduct) {
            setProduct(foundProduct);
            setActiveImage(0);
            
            // Related products (same category)
            const related = data.filter((p: Product) => 
              p.category === foundProduct.category && 
              p._id !== productId && 
              !(p.id !== undefined && p.id === numericId)
            ).slice(0, 4);
            setRelatedProducts(related);
            
            // Recently viewed
            const saved = localStorage.getItem("recentlyViewed");
            let recent: string[] = saved ? JSON.parse(saved) : [];
            recent = [productId, ...recent.filter(id => id !== productId)].slice(0, 6);
            localStorage.setItem("recentlyViewed", JSON.stringify(recent));
            
            const recentProducts = recent
              .map(id => {
                const nId = Number(id);
                return data.find((p: Product) => p._id === id || (p.id !== undefined && p.id === nId));
              })
              .filter(Boolean) as Product[];
            setRecentlyViewed(recentProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity(prev => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (product) {
      // Ensure we're using the correct ID format
      const productToAdd = {
        ...product,
        // keep numeric id if present; don't assign string _id to numeric id
        id: product.id ?? undefined,
      };
      
      // Add product with quantity
      addToCart(productToAdd, quantity);
      
      setShowSuccess(true);
      toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Ensure we're using the correct ID format
      const productToAdd = {
        ...product,
        id: product.id ?? undefined,
      };
      
      // Add product with quantity
      addToCart(productToAdd, quantity);
      
      // Save cart data to localStorage for checkout
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        // Calculate total
        const total = parsedCart.reduce((sum: number, item: any) => 
          sum + (item.price * item.quantity), 0
        );
        localStorage.setItem('checkoutCart', JSON.stringify(parsedCart));
        localStorage.setItem('checkoutTotal', String(total));
      }
      
      // Navigate to checkout
      router.push("/checkout");
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Loading state
  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/shop" 
            className="bg-primary-gold text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-gold/90 transition"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-20 right-5 z-50 bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg animate-bounce text-sm md:text-base">
            Added to cart! 🛒
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-gold transition mb-3 md:mb-6 text-xs md:text-sm"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
          {/* LEFT - Image Gallery */}
          <div className="space-y-3 md:space-y-4">
            <div className="bg-white rounded-xl md:rounded-2xl h-[300px] md:h-[500px] flex items-center justify-center relative overflow-hidden group shadow-md border border-gray-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center text-gray-400 text-4xl">
                  📦
                </div>
              )}
            </div>
            
            {/* Thumbnail - if multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 md:gap-3">
                {product.images.slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-primary-gold shadow-lg"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - Product Info */}
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-primary-gold/10 text-primary-gold text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold">
                    {product.category}
                  </span>
                  {product.stock && product.stock > 0 ? (
                    <span className="bg-green-100 text-green-700 text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold">
                      Stock Out
                    </span>
                  )}
                  {product.status === 'Trending' && (
                    <span className="bg-orange-100 text-orange-600 text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold">
                      🔥 Trending
                    </span>
                  )}
                  {product.status === 'Featured' && (
                    <span className="bg-purple-100 text-purple-600 text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  {product.name}
                </h1>
                {product.description && (
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-1">
                    {product.description}
                  </p>
                )}
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`text-[10px] md:text-sm ${
                            i < Math.floor(product.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] md:text-sm text-gray-500">
                      {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className="border-2 border-gray-200 rounded-full w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-all hover:shadow-md hover:scale-105 bg-white"
              >
                <Heart
                  className={`text-sm md:text-xl transition-all ${
                    liked ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <span className="text-2xl md:text-4xl font-bold text-primary-gold">
                  ৳{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="line-through text-gray-400 text-sm md:text-lg">
                      ৳{product.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-semibold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 md:space-y-3">
              <p className="font-semibold text-gray-700 text-sm md:text-base">Quantity:</p>
              <div className="flex items-center border-2 border-gray-200 rounded-full w-[120px] md:w-[140px] h-[40px] md:h-[48px] overflow-hidden bg-white">
                <button
                  onClick={() => handleQuantity("dec")}
                  className="w-[35px] md:w-[45px] h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="text-gray-600 text-xs md:text-sm" />
                </button>
                <div className="flex-1 text-center font-semibold text-base md:text-lg">{quantity}</div>
                <button
                  onClick={() => handleQuantity("inc")}
                  className="w-[35px] md:w-[45px] h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="text-gray-600 text-xs md:text-sm" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-2 md:gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
                className="flex-1 bg-primary-gold hover:bg-primary-gold/90 text-white h-[40px] md:h-[48px] rounded-xl font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base disabled:opacity-50"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.stock || product.stock === 0}
                className="flex-1 border border-primary-gold/20 text-gray-700 hover:bg-primary-gold/20 hover:text-gray-700 h-[40px] md:h-[48px] rounded-xl font-semibold transition-all text-sm md:text-base disabled:opacity-50"
              >
                Order Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="space-y-2 md:space-y-3 pt-2">
              <div className="bg-primary-gold/20 border border-gray-100 rounded-xl px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3">
                <Truck className="text-primary-gold text-base md:text-xl" />
                <div>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm">
                    Delivery: Dhaka ৳60 (2-3 days) | Outside Dhaka ৳120 (3-5 days)
                  </p>
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3 bg-green-300/20">
                <div className="text-base md:text-xl">💵</div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm">
                    Cash on Delivery available
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 pt-2">
              <div className="bg-white rounded-md py-2 md:py-3 px-2 text-center border border-primary-gold/20 transition group h-full flex flex-col items-center justify-center">
                <div className="text-xl md:text-2xl mb-1 group-hover:scale-110 transition">
                  <Shield className="text-primary-gold mx-auto" size={20} />
                </div>
                <p className="text-[9px] md:text-[10px] font-semibold text-gray-700 text-center">100% Original</p>
              </div>
              <div className="bg-white rounded-md py-2 md:py-3 px-2 text-center border border-primary-gold/20 transition group h-full flex flex-col items-center justify-center">
                <div className="text-xl md:text-2xl mb-1 group-hover:scale-110 transition">
                  <RefreshCw className="text-primary-gold mx-auto" size={20} />
                </div>
                <p className="text-[9px] md:text-[10px] font-semibold text-gray-700 text-center">7-day Replacement</p>
              </div>
              <div className="bg-white rounded-md py-2 md:py-3 px-2 text-center border border-primary-gold/20 transition group h-full flex flex-col items-center justify-center">
                <div className="text-xl md:text-2xl mb-1 group-hover:scale-110 transition">
                  <CreditCard className="text-primary-gold mx-auto" size={20} />
                </div>
                <p className="text-[9px] md:text-[10px] font-semibold text-gray-700 text-center">Secure Payment</p>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-2 md:gap-3 pt-2 border-t border-gray-100">
              <span className="text-gray-500 text-xs md:text-sm">Share:</span>
              <button className="flex text-gray-800 items-center gap-1 md:gap-2 border border-gray-200 rounded-full px-2 py-1 md:px-4 md:py-1.5 text-[10px] md:text-sm hover:bg-green-50 hover:border-green-300 transition-all">
                <Share2 size={12} className="text-green-600" />
                WhatsApp
              </button>
              <button className="flex text-gray-800 items-center gap-1 md:gap-2 border border-gray-200 rounded-full px-2 py-1 md:px-4 md:py-1.5 text-[10px] md:text-sm hover:bg-blue-50 hover:border-blue-300 transition-all">
                <Share2 size={12} className="text-blue-600" />
                Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Tabs: FAQ and Reviews */}
        <div className="mt-10 md:mt-16">
          <div className="flex gap-4 md:gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("faq")}
              className={`pb-2 md:pb-3 text-sm md:text-base font-semibold transition ${
                activeTab === "faq"
                  ? "text-primary-gold border-b-2 border-primary-gold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 md:pb-3 text-sm md:text-base font-semibold transition ${
                activeTab === "reviews"
                  ? "text-primary-gold border-b-2 border-primary-gold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews ({product.reviewCount || 0})
            </button>
          </div>

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
              {sampleFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg md:rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-800 text-sm md:text-base">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="text-gray-400 text-sm md:text-base" />
                    ) : (
                      <ChevronDown className="text-gray-400 text-sm md:text-base" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-3 md:px-4 pb-3 md:pb-4">
                      <p className="text-gray-600 text-xs md:text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="mt-6 md:mt-8">
              {reviews.length === 0 && (!product.reviewCount || product.reviewCount === 0) ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-gold/10 rounded-full flex items-center justify-center">
                          <User className="text-primary-gold" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`text-xs ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-gold">
                          <ThumbsUp size={12} />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="mt-10 md:mt-16">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Clock className="text-primary-gold text-lg md:text-xl" />
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {recentlyViewed.map((item) => (
                <Link
                  key={item._id || item.id}
                  href={`/product/${item._id || item.id}`}
                  className="group bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="bg-gray-50 h-[120px] md:h-[150px] flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="w-[80px] md:w-[100px] object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2 md:p-3">
                    <h3 className="font-semibold text-gray-800 text-[10px] md:text-xs line-clamp-2 group-hover:text-primary-gold transition">
                      {item.name}
                    </h3>
                    <p className="text-primary-gold font-bold text-xs md:text-sm mt-1">
                      ৳{item.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 md:mt-16">
            <div className="text-left mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">Related Products</h2>
              <div className="w-12 h-0.5 bg-primary-gold mt-1"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id || item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
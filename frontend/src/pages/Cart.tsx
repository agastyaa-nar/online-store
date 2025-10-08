import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/formatPrice";

const Cart = () => {
  const { cartItems, cartCount, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link to="/">Start Shopping</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-24 w-24 rounded-lg object-cover"
                        loading="lazy"
                      />
                      {item.quantity > 1 && (
                        <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs">
                          {item.quantity}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Category: {item.category_name || 'General'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-primary">
                            ${formatPrice(item.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "FREE" : `$${formatPrice(shipping)}`}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Add ${formatPrice(100 - subtotal)} more for free shipping
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full mt-6 h-12 text-base"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </Card>

              {/* Features */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Why shop with us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Easy returns within 30 days</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
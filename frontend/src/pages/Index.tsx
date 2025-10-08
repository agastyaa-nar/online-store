import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { api, Product } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";


const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cartCount, addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await api.getProducts();
        setProducts(productsData);
        
        if (productsData.length > 0) {
          setFeaturedProduct(productsData[0]);
          setRelatedProducts(productsData.slice(1, 8));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Using demo data.",
          variant: "destructive",
        });
        // Fallback to mock data
        setFeaturedProduct({
          id: "1",
          name: "Premium Wireless Headphones",
          price: 299.99,
          image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          description: "Experience crystal-clear sound with our flagship headphones",
          category_id: "1",
          stock_quantity: 50,
          is_active: true
        });
        setRelatedProducts([
          {
            id: "2",
            name: "Smart Watch Pro",
            price: 399.99,
            image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
            description: "Advanced fitness tracking and smart notifications",
            category_id: "1",
            stock_quantity: 30,
            is_active: true
          },
          {
            id: "3",
            name: "Portable Speaker",
            price: 149.99,
            image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
            description: "High-quality wireless speaker for any occasion",
            category_id: "1",
            stock_quantity: 75,
            is_active: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={cartCount} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Neon Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
        
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* New Collection Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 neon-border">
                  <Zap className="h-4 w-4 text-primary neon-text" />
                  <span className="text-sm font-medium text-primary neon-text">New Collection</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  <span className="text-foreground">Discover Amazing</span>
                  <br />
                  <span className="text-primary neon-text">
                    Products
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Shop the latest trends in electronics, fashion, home & garden, sports, and books. 
                  Quality products at unbeatable prices.
                </p>
              </div>
              
              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2 gradient-neon neon-glow hover:neon-glow-purple transition-all duration-300 text-white font-semibold">
                  <Link to="/collection">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="neon-border hover:neon-glow-blue transition-all duration-300">
                  <Link to="/collection">Browse Categories</Link>
                </Button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded-lg bg-card/50 neon-border hover:neon-glow transition-all duration-300">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-primary neon-text shrink-0" />
                  <span className="font-medium truncate">Free Shipping</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded-lg bg-card/50 neon-border hover:neon-glow transition-all duration-300">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary neon-text shrink-0" />
                  <span className="font-medium truncate">Secure Payment</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded-lg bg-card/50 neon-border hover:neon-glow transition-all duration-300">
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-primary neon-text shrink-0" />
                  <span className="font-medium truncate">Easy Returns</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 rounded-lg bg-card/50 neon-border hover:neon-glow transition-all duration-300">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-primary neon-text shrink-0" />
                  <span className="font-medium truncate">5-Star Rating</span>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Product */}
            <div className="relative">
              {featuredProduct ? (
                <div className="relative group">
                  {/* Main Product Card */}
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 neon-border hover:neon-glow-purple">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={featuredProduct.image_url}
                        alt={featuredProduct.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Product Info Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold mb-2 neon-text">{featuredProduct.name}</h3>
                        <p className="text-sm opacity-90 mb-3 line-clamp-2">{featuredProduct.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary neon-text">
                            ${formatPrice(featuredProduct.price)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(featuredProduct)}
                            className="gradient-neon neon-glow hover:neon-glow-purple transition-all duration-300 text-white font-semibold"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full neon-glow animate-float" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/20 rounded-full neon-glow-blue animate-float" style={{ animationDelay: '1s' }} />
                </div>
              ) : (
                /* Fallback Product Showcase */
                <div className="relative group">
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 neon-border hover:neon-glow-purple">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Zap className="h-16 w-16 text-primary/50 mx-auto mb-4 animate-pulse" />
                          <h3 className="text-xl font-bold text-foreground/70">Featured Product</h3>
                          <p className="text-sm text-muted-foreground">Coming Soon</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground">
                Discover our handpicked selection of premium products
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/category/electronics">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url}
                category={product.category_name}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of products across all categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.slice(0, 20).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url}
                category={product.category_name}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>

          {products.length > 20 && (
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/collection">
                  View All Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
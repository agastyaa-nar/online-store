import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { api, Product } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const { cartCount, addToCart } = useCart();
  const { toast } = useToast();

  // Load related products
  const loadRelatedProducts = async (categoryId?: string) => {
    try {
      setRelatedLoading(true);
      let products: Product[] = [];
      
      if (categoryId && categoryId !== "unknown") {
        // Load products from same category
        products = await api.getProductsByCategory(categoryId);
      } else {
        // Load all products as fallback
        products = await api.getProducts();
      }
      
      // Filter out current product and limit to 4 items
      const filteredProducts = products
        .filter(p => p.id !== id)
        .slice(0, 4);
      
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error('Error loading related products:', error);
      // Use fallback mock data if API fails
      setRelatedProducts([
        {
          id: "2",
          name: "Smart Watch Pro",
          price: 399.99,
          image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
          description: "Advanced smartwatch with health monitoring",
          category_id: "electronics",
          stock_quantity: 10,
          is_active: true
        },
        {
          id: "3",
          name: "Portable Speaker",
          price: 149.99,
          image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
          description: "High-quality portable speaker for any occasion",
          category_id: "electronics",
          stock_quantity: 15,
          is_active: true
        }
      ]);
    } finally {
      setRelatedLoading(false);
    }
  };

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const productData = await api.getProduct(id);
          if (productData) {
            setProduct(productData);
            // Load related products after main product is loaded
            loadRelatedProducts(productData.category_id);
          } else {
            // Fallback to mock data if API fails
            console.warn('Product not found in API, using fallback data');
            const fallbackProduct = {
              id: id,
              name: "Product Not Found",
              price: 0,
              image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
              description: "This product is currently unavailable.",
              category_id: "unknown",
              stock_quantity: 0,
              is_active: false
            };
            setProduct(fallbackProduct);
            // Load related products even for fallback
            loadRelatedProducts("unknown");
          }
        } catch (error) {
          console.error('Error loading product:', error);
          // Show fallback product when API fails
          const fallbackProduct = {
            id: id,
            name: "Product Unavailable",
            price: 0,
            image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
            description: "This product is currently unavailable. Please try again later.",
            category_id: "unknown",
            stock_quantity: 0,
            is_active: false
          };
          setProduct(fallbackProduct);
          // Load related products even for fallback
          loadRelatedProducts("unknown");
        }
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={cartCount} />
        <div className="container flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={cartCount} />
        <div className="container flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button>Back to Home</Button>
              </Link>
              <Link to="/collection">
                <Button variant="outline">Browse Products</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle unavailable products
  if (!product.is_active || product.stock_quantity === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={cartCount} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h3 className="font-semibold text-destructive mb-2">Product Unavailable</h3>
                  <p className="text-sm text-destructive/80">
                    This product is currently out of stock or no longer available.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Link to="/collection">
                    <Button variant="outline">Browse Other Products</Button>
                  </Link>
                  <Link to="/">
                    <Button>Back to Home</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} />

      <div className="container px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              {product.stock_quantity > 0 ? (
                <Badge variant="default">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <div className="text-3xl font-bold text-price">
              ${formatPrice(product.price)}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Color</h3>
              <div className="flex gap-2">
                {["Black", "Silver", "Blue"].map((color: string) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Chart */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Size</h3>
              <Button variant="outline">One Size</Button>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="details" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Premium build quality with attention to every detail. Features
                  advanced technology and materials for the best experience.
                </p>
              </TabsContent>
              <TabsContent value="shipping" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Free standard shipping on orders over $50. Express shipping available.
                  30-day return policy.
                </p>
              </TabsContent>
              <TabsContent value="reviews" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  4.8/5 stars based on 127 reviews. Customers love the quality and
                  performance.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
          {relatedLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image_url}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No related products found.</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;

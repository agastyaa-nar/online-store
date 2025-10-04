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

// Mock product data
const productData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80",
    ],
    description: "Experience crystal-clear sound with our flagship headphones. Featuring advanced noise cancellation and premium comfort.",
    colors: ["Black", "Silver", "Blue"],
    sizes: ["One Size"],
    inStock: true,
  },
};

const relatedProducts = [
  {
    id: "2",
    name: "Smart Watch Pro",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    id: "3",
    name: "Portable Speaker",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const { cartCount, addToCart } = useCart();
  const { toast } = useToast();

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const productData = await api.getProduct(id);
          if (productData) {
            setProduct(productData);
          }
        } catch (error) {
          console.error('Error loading product:', error);
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
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;

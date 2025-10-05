import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Sparkles,
  Zap,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { api, Product } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";

const categories = [
  { id: "all", name: "All Products", icon: Sparkles, color: "gradient-neon" },
  { id: "cat-1", name: "Electronics", icon: Zap, color: "gradient-neon-blue" },
  { id: "cat-2", name: "Fashion", icon: Shirt, color: "gradient-neon-purple" },
  { id: "cat-3", name: "Home & Garden", icon: Home, color: "gradient-neon" },
  { id: "cat-4", name: "Sports", icon: Dumbbell, color: "gradient-neon-blue" },
  { id: "cat-5", name: "Books", icon: BookOpen, color: "gradient-neon-purple" },
];

const sortOptions = [
  { value: "name-asc", label: "Name A-Z", icon: SortAsc },
  { value: "name-desc", label: "Name Z-A", icon: SortDesc },
  { value: "price-asc", label: "Price Low to High", icon: SortAsc },
  { value: "price-desc", label: "Price High to Low", icon: SortDesc },
];

const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const { cartCount, addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await api.getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  // Handle URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      const categoryMap: Record<string, string> = {
        electronics: "cat-1",
        clothing: "cat-2",
        "home-garden": "cat-3",
        sports: "cat-4",
        books: "cat-5",
      };
      setSelectedCategory(categoryMap[categoryParam] || "all");
    }
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  // Filter + Sort
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "all")
      filtered = filtered.filter((p) => p.category_id === selectedCategory);

    if (searchQuery)
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered.slice(0, productsPerPage));
    setCurrentPage(1);
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, productsPerPage]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const map: Record<string, string> = {
      all: "all",
      "cat-1": "electronics",
      "cat-2": "clothing",
      "cat-3": "home-garden",
      "cat-4": "sports",
      "cat-5": "books",
    };
    const slug = map[categoryId] || "all";
    if (categoryId === "all") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const newProducts = filteredProducts.slice(0, nextPage * productsPerPage);
    setDisplayedProducts(newProducts);
    setCurrentPage(nextPage);
  };

  // Function to get filtered products count for each category
  const getCategoryCount = (categoryId: string) => {
    let filtered = [...products];
    
    // Apply search filter if any
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryId !== "all") {
      filtered = filtered.filter((p) => p.category_id === categoryId);
    }
    
    // Apply price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );
    
    return filtered.length;
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange({ min: 0, max: 999999 });
    setSortBy("name-asc");
    setSearchParams({});
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={cartCount} />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4 neon-glow"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} />

      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-neon flex items-center justify-center neon-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Product Collection
                </h1>
                <p className="text-muted-foreground">
                  Discover amazing products with our advanced filters
                </p>
              </div>
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 neon-border focus:neon-glow transition-all duration-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-md bg-background border border-border neon-border focus:neon-glow transition-all duration-300"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex border border-border rounded-md neon-border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          <Card className="p-6 neon-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary neon-text" />
                Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Categories
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      selectedCategory === cat.id
                        ? `${cat.color} neon-glow`
                        : "hover:bg-secondary/50"
                    }`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <cat.icon className="h-5 w-5 text-white" />
                    <span>{cat.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {getCategoryCount(cat.id)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="font-medium text-sm text-muted-foreground">
                Price Range
              </h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((p) => ({
                        ...p,
                        min: Number(e.target.value) || 0,
                      }))
                    }
                    className="neon-border focus:neon-glow transition-all duration-300"
                  />
                  <Input
                    type="number"
                    placeholder="Max (∞)"
                    value={priceRange.max === 999999 ? "" : priceRange.max}
                    onChange={(e) =>
                      setPriceRange((p) => ({
                        ...p,
                        max: Number(e.target.value) || 999999,
                      }))
                    }
                    className="neon-border focus:neon-glow transition-all duration-300"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  ${priceRange.min} - {priceRange.max === 999999 ? "∞" : `$${priceRange.max}`}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {filteredProducts.length} products found
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedCategory !== "all" &&
                  `in ${
                    categories.find((c) => c.id === selectedCategory)?.name
                  }`}
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full gradient-neon flex items-center justify-center neon-glow">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearFilters} className="gradient-neon neon-glow">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url}
                    onAddToCart={() => handleAddToCart(product)}
                    category={product.category_name || "Uncategorized"}
                    rating={4.5}
                    discount={0}
                  />
                ))}
              </div>

              {displayedProducts.length < filteredProducts.length && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    className="gradient-neon neon-glow hover:neon-glow-purple transition-all duration-300 text-white font-semibold px-8 py-3"
                  >
                    Load More Products
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="text-center mt-6 text-muted-foreground">
                Showing {displayedProducts.length} of{" "}
                {filteredProducts.length} products
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionPage;

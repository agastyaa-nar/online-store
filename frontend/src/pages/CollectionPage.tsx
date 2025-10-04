import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  Star,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { api, Product } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";

const categories = [
  { id: "all", name: "All Products", icon: "🌟", color: "gradient-neon" },
  { id: "1", name: "Electronics", icon: "⚡", color: "gradient-neon-blue" },
  { id: "2", name: "Clothing", icon: "👗", color: "gradient-neon-purple" },
  { id: "3", name: "Home & Garden", icon: "🏡", color: "gradient-neon" },
  { id: "4", name: "Sports", icon: "🏃", color: "gradient-neon-blue" },
  { id: "5", name: "Books", icon: "📖", color: "gradient-neon-purple" },
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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
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
        console.error('Error loading products:', error);
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

  // Handle URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      // Map slug to category ID
      const categoryMap: { [key: string]: string } = {
        'electronics': '1',
        'clothing': '2', 
        'home-garden': '3',
        'sports': '4',
        'books': '5'
      };
      
      const categoryId = categoryMap[categoryParam] || 'all';
      setSelectedCategory(categoryId);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => {
        // Convert both to string for comparison
        const productCategoryId = String(product.category_id);
        const selectedCategoryId = String(selectedCategory);
        return productCategoryId === selectedCategoryId;
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
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
    
    // Reset pagination when filters change
    setCurrentPage(1);
    setDisplayedProducts(filtered.slice(0, productsPerPage));
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, productsPerPage]);

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
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Map category ID back to slug for URL
    const categorySlugMap: { [key: string]: string } = {
      'all': 'all',
      '1': 'electronics',
      '2': 'clothing',
      '3': 'home-garden',
      '4': 'sports',
      '5': 'books'
    };
    
    const slug = categorySlugMap[categoryId] || 'all';
    
    if (categoryId === 'all') {
      // Remove category parameter if "all" is selected
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * productsPerPage;
    const newProducts = filteredProducts.slice(startIndex, endIndex);
    
    setDisplayedProducts(newProducts);
    setCurrentPage(nextPage);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange({ min: 0, max: 1000 });
    setSortBy("name-asc");
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemsCount={cartCount} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4 neon-glow"></div>
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

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 neon-border focus:neon-glow transition-all duration-300"
                />
              </div>
            </div>

            {/* Sort and View */}
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
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
                <h4 className="font-medium text-sm text-muted-foreground">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        selectedCategory === category.id 
                          ? `${category.color} neon-glow` 
                          : "hover:bg-secondary/50"
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {category.id === "all" 
                          ? products.length 
                          : products.filter(p => String(p.category_id) === String(category.id)).length
                        }
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                      className="neon-border focus:neon-glow transition-all duration-300"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000 }))}
                      className="neon-border focus:neon-glow transition-all duration-300"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${priceRange.min} - ${priceRange.max}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredProducts.length} products found
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory !== "all" && `in ${categories.find(c => c.id === selectedCategory)?.name}`}
                </p>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full gradient-neon flex items-center justify-center neon-glow">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
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
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                }`}>
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
                
                {/* Load More Button */}
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
                
                {/* Results Info */}
                <div className="text-center mt-6 text-muted-foreground">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionPage;

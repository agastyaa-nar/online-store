import { useState } from "react";
import { ShoppingCart, Search, Menu, X, User, LogOut, Home, Package, Zap, Sparkles, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: "Electronics", slug: "electronics", icon: "⚡" },
  { name: "Clothing", slug: "clothing", icon: "👗" },
  { name: "Home & Garden", slug: "home-garden", icon: "🏡" },
  { name: "Sports", slug: "sports", icon: "🏃" },
  { name: "Books", slug: "books", icon: "📖" },
];

interface NavbarProps {
  cartItemsCount?: number;
}

const Navbar = ({ cartItemsCount = 0 }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center neon-glow group-hover:animate-float">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary neon-text">
              NeonStore
            </span>
            <span className="text-xs text-muted-foreground -mt-1">Powered by Tech</span>
          </div>
        </Link>

        {/* Center - Filter by & Search (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-secondary/50 neon-border hover:neon-glow transition-all duration-300">
                <Sparkles className="h-5 w-5 text-primary neon-text" />
                <span className="hidden lg:inline">Filter by</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="py-6">
                <h2 className="mb-6 text-xl font-semibold">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/collection?category=${category.slug}`}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-secondary/50 group"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="group-hover:text-primary transition-colors">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search */}
          <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4"
                />
              </div>
              <Button type="submit" size="sm" className="ml-2 gradient-neon neon-glow hover:neon-glow-purple transition-all duration-300">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>

        {/* Right - User Menu & Cart */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Filter by Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="py-6">
                <h2 className="mb-6 text-xl font-semibold">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/collection?category=${category.slug}`}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-secondary/50 group"
                      onClick={() => setSearchOpen(false)}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="group-hover:text-primary transition-colors">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full neon-border hover:neon-glow-purple transition-all duration-300">
                  <div className="h-8 w-8 rounded-full gradient-neon-purple flex items-center justify-center neon-glow-purple">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    View Store
                  </Link>
                </DropdownMenuItem>
                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="neon-border hover:neon-glow transition-all duration-300">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="gradient-neon neon-glow hover:neon-glow-purple transition-all duration-300 text-white">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Cart */}
          <Button asChild variant="ghost" size="sm" className="relative neon-border hover:neon-glow-blue transition-all duration-300">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5 text-primary neon-text" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs neon-glow-purple animate-pulse"
                >
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              <Button type="submit" size="sm">
                Search
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
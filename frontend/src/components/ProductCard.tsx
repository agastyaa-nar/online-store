import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatPrice } from "@/utils/formatPrice";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  onAddToCart?: () => void;
  category?: string;
  rating?: number;
  discount?: number;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  onAddToCart, 
  category,
  rating = 4.5,
  discount = 0
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      setIsAddingToCart(true);
      try {
        await onAddToCart();
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:neon-glow hover:-translate-y-1 bg-card neon-border hover:neon-border-purple">
      {/* Discount Badge */}
      {discount > 0 && (
        <Badge className="absolute top-3 left-3 z-10 gradient-neon-purple neon-glow-purple animate-pulse">
          -{discount}%
        </Badge>
      )}

      <div className="relative aspect-square overflow-hidden bg-muted/20">
        <Link to={`/product/${id}`} className="block h-full">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background neon-border hover:neon-glow-purple transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart
              className={`h-4 w-4 transition-colors neon-text ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
            />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background neon-border hover:neon-glow-blue transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${id}`);
            }}
          >
            <Eye className="h-4 w-4 text-muted-foreground hover:text-primary neon-text" />
          </Button>
        </div>

        {/* Quick Add to Cart - Mobile */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden">
          <Button
            size="sm"
            className="w-full gradient-neon neon-glow hover:neon-glow-purple transition-all duration-300"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Category */}
        {category && (
          <Badge variant="secondary" className="text-xs shrink-0">
            {category}
          </Badge>
        )}

        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors break-words">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({rating})
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-primary neon-text">
                ${formatPrice(discountedPrice)}
              </span>
              {discount > 0 && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  ${formatPrice(price)}
                </span>
              )}
            </div>
          </div>
          
          {/* Desktop Add to Cart */}
          <Button
            size="sm"
            className="gap-1 sm:gap-2 hidden md:flex gradient-neon neon-glow hover:neon-glow-purple transition-all duration-300 shrink-0"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{isAddingToCart ? "Adding..." : "Add"}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
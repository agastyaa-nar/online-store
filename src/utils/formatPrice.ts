// Utility function to safely format price
export const formatPrice = (price: any): string => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  
  if (typeof price === 'string') {
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice)) {
      return numPrice.toFixed(2);
    }
  }
  
  return '0.00';
};

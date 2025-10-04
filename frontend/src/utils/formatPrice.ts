// Utility function to safely format price
export const formatPrice = (price: any): string => {
  let numPrice: number;
  
  if (typeof price === 'number') {
    numPrice = price;
  } else if (typeof price === 'string') {
    numPrice = parseFloat(price);
  } else {
    return '0.00';
  }
  
  if (isNaN(numPrice)) {
    return '0.00';
  }
  
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

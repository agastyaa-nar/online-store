import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  LogOut, 
  Users, 
  Package, 
  BarChart3, 
  ShoppingCart,
  TrendingUp,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  UserPlus,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api, Category } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category_name: string;
  description: string;
  image_url: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  // Mock stats data
  const stats = [
    { title: "Total Products", value: products.length, icon: Package, color: "text-blue-600" },
    { title: "Total Users", value: users.length, icon: Users, color: "text-green-600" },
    { title: "Total Orders", value: "24", icon: ShoppingCart, color: "text-purple-600" },
    { title: "Revenue", value: "$12,345", icon: TrendingUp, color: "text-orange-600" },
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authLoading, navigate, user?.role]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products and categories
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      
      console.log('Products data:', productsData);
      console.log('First product:', productsData[0]);
      console.log('Categories data:', categoriesData);
      setProducts(productsData);
      setCategories(categoriesData);
      
      // Load users only if superadmin
      if (user?.role === 'superadmin') {
        try {
          const usersData = await api.getAllUsers();
          console.log('Users data:', usersData);
          if (usersData && usersData.success && usersData.users) {
            console.log('Users array:', usersData.users);
            console.log('First user:', usersData.users[0]);
            setUsers(usersData.users);
          } else {
            console.error('Users data format error:', usersData);
            setUsers([]);
          }
        } catch (userError) {
          console.error('Error loading users:', userError);
          toast({
            title: "Warning",
            description: "Failed to load users data",
            variant: "destructive",
          });
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // Helper function to get category_id from category_name
  const getCategoryId = (categoryName: string): string | null => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : null;
  };

  // Helper function to get category_name from category_id
  const getCategoryName = (categoryId: string): string | null => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : null;
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const result = await api.deleteProduct(productId);
      if (result.success) {
        toast({
          title: "Product deleted",
          description: "Product has been removed successfully.",
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await api.deleteUser(userId);
      if (result.success) {
        toast({
          title: "User deleted",
          description: "User has been removed successfully.",
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      // Convert category_name to category_id
      const categoryId = getCategoryId(productData.category_name);
      if (!categoryId) {
        toast({
          title: "Error",
          description: "Invalid category selected",
          variant: "destructive",
        });
        return;
      }

      // Prepare data with category_id instead of category_name
      const dataToSave = {
        ...productData,
        category_id: categoryId
      };
      // Remove category_name as it's not needed for API
      delete dataToSave.category_name;

      let result;
      if (editingProduct) {
        const updateData = { ...dataToSave, id: editingProduct.id };
        result = await api.updateProduct(updateData);
      } else {
        result = await api.createProduct(dataToSave);
      }
      
      if (result.success) {
        toast({
          title: editingProduct ? "Product updated" : "Product added",
          description: "Product information has been saved.",
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Save product error:', error);
      toast({
        title: "Error", 
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
      setEditingProduct(null);
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      const result = await api.createUser(userData);
      if (result.success) {
        toast({
          title: "User created",
          description: "User account has been created successfully.",
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Save user error:', error);
      toast({
        title: "Error", 
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
      setEditingUser(null);
    }
  };

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    const query = searchQuery?.toLowerCase() || '';
    return (
      (product.name || '').toLowerCase().includes(query) ||
      (product.category_name || '').toLowerCase().includes(query)
    );
  });

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!user) return false;
    const query = searchQuery?.toLowerCase() || '';
    return (
      (user.username || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query)
    );
  }) : [];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.username} ({user?.role})
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user?.role === 'superadmin' && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              {user?.role === 'superadmin' && (
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setEditingUser(null);
                  setIsDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add {user?.role === 'superadmin' ? 'Item' : 'Product'}
              </Button>
            </div>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Product Management</h2>
                  <Badge variant="secondary">
                    {filteredProducts.length} products
                  </Badge>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-12 w-12 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category_name}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${formatPrice(product.price)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={product.stock_quantity > 10 ? "default" : "destructive"}
                            >
                              {product.stock_quantity} in stock
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab (Superadmin only) */}
          {user?.role === 'superadmin' && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">User Management</h2>
                    <Badge variant="secondary">
                      {filteredUsers.length} users
                    </Badge>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium">{user.username}</p>
                                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.role === 'superadmin' ? 'default' : 'secondary'}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive hover:text-destructive"
                                disabled={user.role === 'superadmin'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Product/User Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : editingUser ? "Add New User" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? "Update the product information below." 
                  : editingUser
                    ? "Fill in the details to add a new user to the system."
                    : "Fill in the details to add a new product to the store."
                }
              </DialogDescription>
            </DialogHeader>
            
            {editingUser ? (
              <UserForm
                user={editingUser}
                onSave={handleSaveUser}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingUser(null);
                }}
              />
            ) : (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingProduct(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ product, categories, onSave, onCancel }: { 
  product: Product | null; 
  categories: Category[];
  onSave: (data: any) => void; 
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock_quantity: product?.stock_quantity || 0,
    category_name: product?.category_name || "",
    image_url: product?.image_url || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category_name">Category *</Label>
          <Select
            value={formData.category_name}
            onValueChange={(value) => setFormData({ ...formData, category_name: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock Quantity *</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL *</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

// User Form Component
const UserForm = ({ user, onSave, onCancel }: { 
  user: User | null; 
  onSave: (data: any) => void; 
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add User
        </Button>
      </div>
    </form>
  );
};

export default AdminDashboard;
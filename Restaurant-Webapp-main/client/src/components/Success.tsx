import { IndianRupee, Trash2, RefreshCw, CreditCard, Plus, ShoppingCart, PlusCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react"; 
import { CartItem } from "@/types/cartType";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { MenuItem } from "@/types/restaurantType";

const Success = () => {
  const { orders, getOrderDetails, deleteOrder } = useOrderStore();
  const { addOrderItem, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [addingItem, setAddingItem] = useState<{[key: string]: boolean}>({});
  const [addingAllItems, setAddingAllItems] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();

  useEffect(() => {
    getOrderDetails();
  }, []);

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setIsLoading(prev => ({ ...prev, [orderId]: true }));
      try {
        await deleteOrder(orderId);
        toast.success("Order deleted successfully");
      } catch (error) {
        toast.error("Failed to delete order");
      } finally {
        setIsLoading(prev => ({ ...prev, [orderId]: false }));
      }
    }
  };

  const handleAddItemToCart = (item: CartItem, order: any) => {
    // Get restaurant ID from order
    const restaurantId = order.restaurantId || (order.restaurant && order.restaurant._id);
    
    if (!restaurantId) {
      toast.error("Restaurant information is missing. Cannot add to cart.");
      return;
    }
    
    // Set loading state for this item
    const itemKey = `${item._id}-${order._id}`;
    setAddingItem(prev => ({ ...prev, [itemKey]: true }));
    
    try {
      // Create a MenuItem from CartItem
      const menuItem: MenuItem = {
        _id: item._id,
        name: item.name,
        description: item.description || "",
        price: Number(item.price),
        image: item.image,
        category: item.category || "",
        isAvailable: true,
        restaurantId: restaurantId,
        quantity: item.quantity
      };
      
      // Try to add to cart
      const success = addOrderItem(menuItem, restaurantId);
      
      if (success) {
        toast.success(`Added ${item.name} to cart`);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      // Clear loading state
      setTimeout(() => {
        setAddingItem(prev => ({ ...prev, [itemKey]: false }));
      }, 500);
    }
  };

  const handleAddAllItemsToCart = (order: any) => {
    // Get restaurant ID from order
    const restaurantId = order.restaurantId || (order.restaurant && order.restaurant._id);
    
    if (!restaurantId) {
      toast.error("Restaurant information is missing. Cannot add to cart.");
      return;
    }
    
    // Set loading state for this order
    setAddingAllItems(prev => ({ ...prev, [order._id]: true }));
    
    try {
      // Convert cart items to MenuItem format
      const menuItems: MenuItem[] = order.cartItems.map((item: CartItem) => ({
        _id: item._id,
        name: item.name,
        description: item.description || "",
        price: Number(item.price),
        image: item.image,
        category: item.category || "",
        isAvailable: true,
        restaurantId: restaurantId,
        quantity: item.quantity // Pass the quantity directly
      }));
      
      // Add all items at once
      const success = addOrderItem(menuItems, restaurantId);
      
      if (success) {
        toast.success(`Added all items to cart`);
      }
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast.error("Failed to add items to cart");
    } finally {
      // Clear loading state
      setTimeout(() => {
        setAddingAllItems(prev => ({ ...prev, [order._id]: false }));
      }, 500);
    }
  };

  const handleReorder = (order: any) => {
    clearCart(); // Clear the current cart
    
    // Make sure we have a valid restaurantId
    let restaurantId = order.restaurantId;
    if (!restaurantId && order.restaurant && order.restaurant._id) {
      restaurantId = order.restaurant._id;
    }
    
    // Check if we have a valid restaurantId
    if (!restaurantId) {
      toast.error("Restaurant information is missing. Cannot reorder.");
      return;
    }
    
    // Convert cart items to MenuItem format
    const menuItems: MenuItem[] = order.cartItems.map((item: CartItem) => ({
      _id: item._id,
      name: item.name,
      description: item.description || "",
      price: Number(item.price),
      image: item.image,
      category: item.category || "",
      isAvailable: true,
      restaurantId: restaurantId,
      quantity: item.quantity // Pass the quantity directly
    }));
    
    // Add all items at once
    addOrderItem(menuItems, restaurantId);
    
    // Navigate to cart
    navigate('/cart');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (orders.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300 mb-4">
            No orders found!
          </h1>
          <Link to="/">
            <Button className="bg-[var(--button)] hover:bg-[var(--hoverButtonColor)] text-white">
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Your Orders
        </h1>
        <Link to="/cart">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            View Cart
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-4xl">
        {orders.map((order: any, index: number) => (
          <Card key={index} className="mb-8 overflow-hidden">
            <div className="bg-[var(--button)]/10 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Order #{order._id.substring(0, 8)}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.createdAt ? formatDate(order.createdAt) : "Date not available"}
                </p>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "confirmed" ? "bg-green-100 text-green-800" :
                    order.status === "delivered" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status ? order.status.toUpperCase() : "PROCESSING"}
                  </span>
                </div>
                {/* Show restaurant name if available */}
                {(order.restaurant?.restaurantName || order.restaurantName) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Restaurant: {order.restaurant?.restaurantName || order.restaurantName}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddAllItemsToCart(order)}
                  disabled={addingAllItems[order._id]}
                  className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {addingAllItems[order._id] ? "Adding..." : "Add All"}
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReorder(order)}
                  className="flex items-center gap-1 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reorder</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteOrder(order._id)}
                  disabled={isLoading[order._id]}
                  className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isLoading[order._id] ? "Deleting..." : "Delete"}
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                Order Items
              </h3>
              
              {order.cartItems.map((item: CartItem, itemIndex: number) => {
                const itemKey = `${item._id}-${order._id}`;
                return (
                  <div key={itemIndex} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-md object-cover"
                        />
                        <div className="ml-4">
                          <h3 className="text-gray-800 dark:text-gray-200 font-medium">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-gray-800 dark:text-gray-200 flex items-center">
                            <IndianRupee className="h-4 w-4" />
                            <span className="text-lg font-medium">{item.price}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={addingItem[itemKey]}
                          onClick={() => handleAddItemToCart(item, order)}
                          className="rounded-full h-8 w-8 p-0 bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900/20 dark:hover:bg-green-800/30 dark:text-green-400"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {itemIndex < order.cartItems.length - 1 && <Separator className="my-4" />}
                  </div>
                );
              })}
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Total Amount
                </h3>
                <div className="text-gray-800 dark:text-gray-200 flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-lg font-bold">
                    {order.totalAmount || 
                      order.cartItems.reduce((sum: number, item: CartItem) => 
                        sum + (Number(item.price) * item.quantity), 0)
                    }
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 hover:bg-[var(--button)]/10"
                    >
                      <CreditCard className="h-4 w-4" />
                      Payment Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Payment Information</DialogTitle>
                      <DialogDescription>
                        Details about your payment for this order.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
                        <span className="font-medium">{order.paymentId || "Not available"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                        <span className={`font-medium ${
                          order.paymentId ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {order.paymentId ? "Paid" : "Pending"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                        <span className="font-medium">Razorpay</span>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-4">
        <Link to="/">
          <Button className="bg-[var(--button)] hover:bg-[var(--hoverButtonColor)] text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;

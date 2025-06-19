import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingCart } from "lucide-react";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const AvailableMenu = ({ menus, restaurantId }: { menus: MenuItem[], restaurantId?: string }) => {
  const { addToCart } = useCartStore();
  const { singleRestaurant } = useRestaurantStore();
  const navigate = useNavigate();
  
  // Use passed restaurantId or get it from singleRestaurant
  const currentRestaurantId = restaurantId || singleRestaurant?._id;
  
  if (!currentRestaurantId) {
    console.error("Restaurant ID is missing");
  }
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu: MenuItem, index) => (
          <Card 
            key={menu._id || index} 
            className="card-modern overflow-hidden card-hover group"
          >
            <div className="relative">
              <img 
                src={menu.image} 
                alt={menu.name} 
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 right-3">
                <Button 
                  onClick={() => {
                    if (currentRestaurantId) {
                      addToCart(menu, currentRestaurantId);
                      navigate("/cart");
                    } else {
                      console.error("Cannot add to cart: Restaurant ID is missing");
                    }
                  }}
                  size="icon"
                  className="rounded-full bg-white text-[var(--button)] hover:bg-[var(--button)] hover:text-white transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold line-clamp-1">
                  {menu.name}
                </h2>
                <span className="font-bold text-lg text-[var(--button)]">₹{menu.price}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 h-10 mb-3">
                {menu.description}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="px-2 py-1 bg-[var(--button)]/10 text-[var(--button)] rounded-md font-medium">
                  {menu.category || "Main Course"}
                </span>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => {
                  if (currentRestaurantId) {
                    addToCart(menu, currentRestaurantId);
                    navigate("/cart");
                  } else {
                    console.error("Cannot add to cart: Restaurant ID is missing");
                  }
                }}
                className="w-full btn-primary"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;

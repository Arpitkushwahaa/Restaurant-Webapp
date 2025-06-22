import { Link, useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  HandPlatter,
  Loader2,
  Menu,
  Moon,
  PackageCheck,
  ShoppingCart,
  SquareMenu,
  Sun,
  User,
  UtensilsCrossed,
  LogOut,
  Utensils,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

// Popular cuisines for quick access
const popularCuisines = [
  "Italian", 
  "Chinese", 
  "Indian", 
  "Mexican", 
  "Japanese", 
  "Thai", 
  "Mediterranean"
];

const Navbar = () => {
  const { user, loading, logout } = useUserStore();
  const { cart } = useCartStore();
  const { setTheme } = useThemeStore();
  const { setAppliedFilter, resetAppliedFilter } = useRestaurantStore();
  const navigate = useNavigate();

  // Function to get user initials from fullname
  const getUserInitials = () => {
    if (!user?.fullname) return "U";
    
    const nameParts = user.fullname.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const handleCuisineClick = (cuisine: string) => {
    resetAppliedFilter();
    setAppliedFilter(cuisine);
    navigate('/search');
  };

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="font-bold md:font-extrabold text-2xl bg-gradient-to-r from-[var(--button)] to-[var(--accent-color)] bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 hover:drop-shadow-md">EatsHub</h1>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="font-medium hover:text-[var(--button)] transition-colors hover:scale-105 duration-200">Home</Link>
              <Link to="/profile" className="font-medium hover:text-[var(--button)] transition-colors hover:scale-105 duration-200">Profile</Link>
              <Link to="/order/status" className="font-medium hover:text-[var(--button)] transition-colors hover:scale-105 duration-200">Order</Link>

              {/* Popular Cuisines Menu */}
              <Menubar className="border-none">
                <MenubarMenu>
                  <MenubarTrigger className="font-medium hover:text-[var(--button)] transition-colors hover:scale-105 duration-200 flex items-center gap-1">
                    <Utensils className="w-4 h-4" />
                    Cuisines
                  </MenubarTrigger>
                  <MenubarContent className="rounded-xl shadow-lg animate-in fade-in slide-up">
                    {popularCuisines.map((cuisine) => (
                      <MenubarItem 
                        key={cuisine} 
                        className="cursor-pointer hover:text-[var(--button)] hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => handleCuisineClick(cuisine)}
                      >
                        {cuisine}
                      </MenubarItem>
                    ))}
                    <Separator className="my-1" />
                    <MenubarItem onClick={() => navigate('/search')} className="font-medium text-[var(--button)] hover:bg-gray-50 dark:hover:bg-gray-800">
                      All Restaurants
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>

              {user?.admin && (
                <Menubar className="border-none">
                  <MenubarMenu>
                    <MenubarTrigger className="font-medium hover:text-[var(--button)] transition-colors hover:scale-105 duration-200">Dashboard</MenubarTrigger>
                    <MenubarContent className="rounded-xl shadow-lg animate-in fade-in slide-up">
                      <Link to="/admin/restaurant">
                        <MenubarItem className="cursor-pointer hover:text-[var(--button)] hover:bg-gray-50 dark:hover:bg-gray-800">Restaurant</MenubarItem>
                      </Link>
                      <Link to="/admin/menu">
                        <MenubarItem className="cursor-pointer hover:text-[var(--button)] hover:bg-gray-50 dark:hover:bg-gray-800">Menu</MenubarItem>
                      </Link>
                      <Link to="/admin/orders">
                        <MenubarItem className="cursor-pointer hover:text-[var(--button)] hover:bg-gray-50 dark:hover:bg-gray-800">Orders</MenubarItem>
                      </Link>
                      <Link to="/admin/users">
                        <MenubarItem className="cursor-pointer hover:text-[var(--button)] hover:bg-gray-50 dark:hover:bg-gray-800">User Management</MenubarItem>
                      </Link>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl shadow-lg animate-in fade-in slide-up">
                    <DropdownMenuItem onClick={()=> setTheme('light')} className="hover:text-[var(--button)]">Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setTheme('dark')} className="hover:text-[var(--button)]">Dark</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link to="/cart" className="relative cursor-pointer group">
                <ShoppingCart className="h-5 w-5 hover:text-[var(--button)] transition-colors group-hover:scale-110 duration-200" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[var(--button)] rounded-full group-hover:scale-110 duration-200">
                    {cart.length}
                  </span>
                )}
              </Link>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-transparent hover:border-[var(--button)] transition-all hover:scale-110 duration-200">
                      <AvatarImage src={user?.profilePicture} alt="profile" />
                      <AvatarFallback className="bg-gradient-to-r from-[var(--button)] to-[var(--accent-color)] text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl shadow-lg animate-in fade-in slide-up">
                    <DropdownMenuItem className="flex items-center gap-2 hover:text-[var(--button)]" asChild>
                      <Link to="/profile">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 hover:text-[var(--button)]" asChild>
                      <Link to="/order/status">
                        <HandPlatter className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <Separator className="my-1" />
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-red-500 focus:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" 
                      onClick={logout}
                      disabled={loading}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{loading ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="md:hidden lg:hidden">
            {/* Mobile responsive  */}
            <MobileNavbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user, logout, loading } = useUserStore();
  const { cart } = useCartStore();
  const { setTheme } = useThemeStore();
  const { setAppliedFilter, resetAppliedFilter } = useRestaurantStore();
  const navigate = useNavigate();
  
  // Function to get user initials from fullname
  const getUserInitials = () => {
    if (!user?.fullname) return "U";
    
    const nameParts = user.fullname.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const handleCuisineClick = (cuisine: string) => {
    resetAppliedFilter();
    setAppliedFilter(cuisine);
    navigate('/search');
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200"
          variant="outline"
        >
          <Menu size={"18"} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col rounded-l-2xl border-l-0">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="bg-gradient-to-r from-[var(--button)] to-[var(--accent-color)] bg-clip-text text-transparent font-bold text-xl hover:scale-105 transition-transform duration-200">EatsHub</SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-none">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>
        <Separator className="my-2" />
        <SheetDescription className="flex-1">
          <Link
            to="/profile"
            className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-lg cursor-pointer hover:text-[var(--button)] font-medium transition-colors"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link
            to="/order/status"
            className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-lg cursor-pointer hover:text-[var(--button)] font-medium transition-colors"
          >
            <HandPlatter className="h-5 w-5" />
            <span>Order</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-lg cursor-pointer hover:text-[var(--button)] font-medium transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[var(--button)] rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>

          {/* Popular Cuisines Section for Mobile */}
          <div className="mt-4 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-3">Popular Cuisines</h3>
            <div className="mt-2 flex flex-wrap gap-2 px-3">
              {popularCuisines.map((cuisine) => (
                <SheetClose key={cuisine} asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCuisineClick(cuisine)}
                    className="rounded-full text-sm"
                  >
                    {cuisine}
                  </Button>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/search')}
                  className="rounded-full text-sm mt-2 w-full"
                >
                  All Restaurants
                </Button>
              </SheetClose>
            </div>
          </div>
          <Separator className="my-2" />

          {user?.admin && (
            <>
              <Link
                to="/admin/menu"
                className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-lg cursor-pointer hover:text-[var(--button)] font-medium transition-colors"
              >
                <SquareMenu className="h-5 w-5" />
                <span>Menu</span>
              </Link>
              
              <Link
                to="/admin/restaurant"
                className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-lg cursor-pointer hover:text-[var(--button)] font-medium transition-colors"
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span>Restaurant</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-lg cursor-pointer hover:text-[var(--button)] font-medium transition-colors"
              >
                <PackageCheck className="h-5 w-5" />
                <span>Restaurant Orders</span>
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-lg cursor-pointer hover:text-[var(--button)] font-medium transition-colors"
              >
                <User className="h-5 w-5" />
                <span>User Management</span>
              </Link>
            </>
          )}
        </SheetDescription>
        <SheetFooter className="flex flex-col gap-4 mt-4 border-t dark:border-gray-800 pt-4">
          <div className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="bg-gradient-to-r from-[var(--button)] to-[var(--accent-color)] text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-bold">{user?.fullname || 'User'}</h1>
          </div>
          <SheetClose asChild>
            {loading ? (
              <Button className="btn-primary">
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={logout}
                className="btn-primary"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

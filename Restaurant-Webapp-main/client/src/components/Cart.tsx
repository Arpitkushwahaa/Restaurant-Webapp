import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/types/cartType";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { cart, decrementQuantity, incrementQuantity, removeFromTheCart, clearCart } = useCartStore();

  let totalAmount = cart.reduce((acc, ele) => {
    return acc + ele.price * ele.quantity;
  }, 0);
  
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto section-padding flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 rounded-full bg-[var(--button)]/10 flex items-center justify-center mb-6">
          <ShoppingCart className="h-12 w-12 text-[var(--button)]" />
        </div>
        <h2 className="heading-lg mb-2 text-center">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button 
          onClick={() => window.history.back()}
          className="btn-primary px-8 py-6 text-lg"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col max-w-7xl mx-auto section-padding fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-lg">Your Cart</h1>
        <Button 
          variant="outline" 
          className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
          onClick={clearCart}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>
      
      <div className="bg-white dark:bg-[var(--neutral-bg)] rounded-xl shadow-lg overflow-hidden mb-8">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-medium">Items</TableHead>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Price</TableHead>
              <TableHead className="font-medium">Quantity</TableHead>
              <TableHead className="font-medium">Total</TableHead>
              <TableHead className="text-right font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item: CartItem) => (
              <TableRow key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                <TableCell>
                  <Avatar className="h-14 w-14 rounded-md">
                    <AvatarImage src={item.image} alt={item.name} className="object-cover" />
                    <AvatarFallback className="rounded-md bg-[var(--button)]/10 text-[var(--button)]">
                      {item.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium"> {item.name}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">₹{item.price}</TableCell>
                <TableCell>
                  <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Button
                      onClick={() => decrementQuantity(item._id)}
                      size={"icon"}
                      variant={"outline"}
                      className="rounded-full border-none bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      size={"icon"}
                      className="font-bold border-none h-8 w-8"
                      disabled
                      variant={"outline"}
                    >
                      {item.quantity}
                    </Button>
                    <Button
                      onClick={() => incrementQuantity(item._id)}
                      size={"icon"}
                      className="rounded-full border-none bg-[var(--button)] hover:bg-[var(--hoverButtonColor)] text-white h-8 w-8"
                      variant={"outline"}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">₹{item.price * item.quantity}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    size={"sm"} 
                    variant="ghost"
                    onClick={() => removeFromTheCart(item._id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-gray-50/80 dark:bg-gray-800/30">
              <TableCell colSpan={4} className="text-xl font-bold">Total Amount</TableCell>
              <TableCell colSpan={2} className="text-right text-xl font-bold text-[var(--button)]">
                ₹{totalAmount}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="btn-primary px-8 py-6 text-lg rounded-xl"
        >
          Proceed To Checkout
        </Button>
      </div>
      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;

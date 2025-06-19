import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { CheckoutSessionRequest } from "@/types/orderType";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CheckoutConfirmPage = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUserStore();
  const [input, setInput] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    contact: user?.contact?.toString() || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const { cart } = useCartStore();
  const { restaurant } = useRestaurantStore();
  const { createCheckoutSession, loading } = useOrderStore();
  
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  
  const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!input.name || !input.email || !input.contact || !input.address || !input.city || !input.country) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Validate contact number
    if (!/^\d{10}$/.test(input.contact)) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }
    
    // api implementation start from here
    try {
      const checkoutData: CheckoutSessionRequest = {
        cartItems: cart.map((cartItem) => ({
          menuId: cartItem._id,
          name: cartItem.name,
          image: cartItem.image,
          price: cartItem.price.toString(),
          quantity: cartItem.quantity.toString(),
        })),
        deliveryDetails: input,
        restaurantId: restaurant?._id as string,
      };
      await createCheckoutSession(checkoutData);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
        <DialogDescription className="text-xs">
          Double-check your delivery details and ensure everything is in order.
          When you are ready, hit confirm button to finalize your order
        </DialogDescription>
        <form
          onSubmit={checkoutHandler}
          className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
        >
          <div>
            <Label>Fullname <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input
              disabled
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Contact <span className="text-red-500">*</span></Label>
            <Input
              type="tel"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
              placeholder="10-digit phone number"
              pattern="[0-9]{10}"
              required
            />
          </div>
          <div>
            <Label>Address <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="address"
              value={input.address}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>City <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="city"
              value={input.city}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Country <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="country"
              value={input.country}
              onChange={changeEventHandler}
              required
            />
          </div>
          <DialogFooter className="col-span-2 pt-5">
            {loading ? (
              <Button disabled className="bg-orange hover:bg-hoverOrange">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-orange hover:bg-hoverOrange">
                Continue To Payment
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;

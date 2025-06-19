import { useRestaurantStore } from "@/store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Clock, MapPin, Star, Timer, Utensils } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetail = () => {
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant } = useRestaurantStore();

  useEffect(() => {
    getSingleRestaurant(params.id!); 
  }, [params.id]);

  return (
    <div className="max-w-6xl mx-auto section-padding">
      <div className="w-full fade-in">
        <div className="relative w-full h-48 md:h-72 lg:h-96 mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-2xl z-10"></div>
          <img
            src={singleRestaurant?.imageUrl || "Loading..."}
            alt={singleRestaurant?.restaurantName || "Restaurant"}
            className="object-cover w-full h-full rounded-2xl shadow-xl"
          />
          <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-bold text-2xl md:text-4xl text-white mb-2">
                  {singleRestaurant?.restaurantName || "Loading..."}
                </h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {singleRestaurant?.cuisines.map((cuisine: string, idx: number) => (
                    <Badge key={idx} className="bg-[var(--button)]/90 hover:bg-[var(--button)] text-white border-none">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-lg">4.8</span>
                <span className="text-sm opacity-80">(120+ reviews)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[var(--neutral-bg)] rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-[var(--button)]/10 flex items-center justify-center text-[var(--button)]">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Time</p>
                <p className="font-semibold">{singleRestaurant?.deliveryTime || "NA"} mins</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-semibold">{singleRestaurant?.city || "City"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cuisine Type</p>
                <p className="font-semibold">{singleRestaurant?.cuisines?.[0] || "Various"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="heading-md mb-4 flex items-center">
            <span className="mr-2">Menu</span>
            <div className="h-1 w-16 bg-[var(--button)]"></div>
          </h2>
          {singleRestaurant?.menus && <AvailableMenu menus={singleRestaurant?.menus!} />}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;


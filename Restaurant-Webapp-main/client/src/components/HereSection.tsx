import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Search, Building2, Users } from "lucide-react";
import { Button } from "./ui/button";
import HereImage from "@/assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Restaurant } from "@/types/restaurantType";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const { searchRestaurant, searchedRestaurant, loading } = useRestaurantStore();

  useEffect(() => {
    searchRestaurant("", "", []);
  }, [searchRestaurant]);

  return (
    <>
      <div className="section-padding">
        <div className="flex flex-col-reverse md:flex-row max-w-7xl mx-auto rounded-2xl items-center justify-between gap-8 md:gap-12 bg-gradient-to-br from-white to-[#F9F9F9] dark:from-[#1E1E2E] dark:to-[#2D2D3F] p-6 md:p-10 shadow-lg">
          <div className="flex flex-col gap-8 md:w-[50%] fade-in slide-up">
            <div className="flex flex-col gap-4">
              <span className="bg-[var(--button)]/10 text-[var(--button)] px-4 py-1 rounded-full text-sm font-medium w-fit">
                Hungry? We got you covered
              </span>
              <h1 className="heading-xl leading-tight">
                Order <span className="text-[var(--button)]">Delicious Food</span> Anytime & Anywhere
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Your favorite restaurants and meals delivered to your doorstep with just a few clicks.
              </p>
            </div>

            <div className="relative flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full">
                <Input
                  type="text"
                  value={searchText}
                  placeholder="Search restaurant by name, city & country"
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 py-6 rounded-xl shadow-md border-gray-200 dark:border-gray-700 w-full"
                />
                <Search className="text-gray-500 absolute top-3 left-3" />
              </div>
              <Button
                onClick={() => navigate(`/search/${searchText}`)}
                className="btn-primary py-6 px-8 rounded-xl w-full md:w-auto"
                disabled={!searchText.trim()}
              >
                Search Now
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Button
                onClick={() => navigate("/search")}
                className="bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white py-4 px-6 rounded-xl text-lg font-medium"
              >
                Browse All Restaurants
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 flex-wrap mt-6">
              {/* Restaurants */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center text-white font-bold shadow-md text-lg">
                  🍽️
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base">1K+</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Restaurants</span>
                </div>
              </div>

              {/* Happy Customers */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Users size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base">5K+</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</span>
                </div>
              </div>

              {/* Cities */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white shadow-md">
                  <Building2 size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base">20+</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="md:w-[45%] relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--button)]/20 to-[var(--accent-color)]/20 rounded-full blur-3xl opacity-70"></div>
            <img
              src={HereImage}
              alt="Delicious Food"
              className="object-cover w-full max-h-[500px] rounded-2xl shadow-xl relative z-10 card-hover"
            />
          </div>
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <div className="section-padding max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="heading-lg mb-4">Featured Restaurants</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our selection of the finest restaurants offering delicious cuisines from around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <FeaturedSkeleton />
          ) : searchedRestaurant?.data?.length > 0 ? (
            searchedRestaurant.data.slice(0, 3).map((restaurant: Restaurant) => (
              <Card
                key={restaurant._id}
                className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.restaurantName}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {restaurant.restaurantName}
                  </h3>
                  <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400 gap-2">
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      {restaurant.city}
                    </span>
                    ,<span>{restaurant.country}</span>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {restaurant.cuisines.slice(0, 2).map((cuisine, idx) => (
                      <Badge key={idx} className="font-medium px-2 py-1 rounded-full shadow-sm">
                        {cuisine}
                      </Badge>
                    ))}
                    {restaurant.cuisines.length > 2 && (
                      <Badge variant="outline">+{restaurant.cuisines.length - 2} more</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 flex justify-end">
                  <Button
                    onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                    className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200"
                  >
                    View Menus
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                No restaurants available at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>

        {searchedRestaurant?.data?.length > 3 && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/search")}
              className="bg-[var(--button)] hover:bg-[var(--button)]/90 text-white px-6 py-3 rounded-lg"
            >
              View All Restaurants
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default HereSection;

const FeaturedSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 mt-4 flex-wrap">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
          <CardFooter className="p-4 flex justify-end">
            <Skeleton className="h-10 w-24 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

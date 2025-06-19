import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import HereImage from "@/assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  
  return (
    <div className="section-padding">
      <div className="flex flex-col-reverse md:flex-row max-w-7xl mx-auto rounded-2xl items-center justify-between gap-8 md:gap-12 bg-gradient-to-br from-white to-[#F9F9F9] dark:from-[#1E1E2E] dark:to-[#2D2D3F] p-6 md:p-10 shadow-lg">
        <div className="flex flex-col gap-8 md:w-[50%] fade-in slide-up">
          <div className="flex flex-col gap-4">
            <div className="inline-block">
              <span className="bg-[var(--button)]/10 text-[var(--button)] px-4 py-1 rounded-full text-sm font-medium">
                Hungry? We got you covered
              </span>
            </div>
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
          
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white font-bold">
                1K+
              </div>
              <span className="text-sm font-medium">Restaurants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--button)] flex items-center justify-center text-white font-bold">
                5K+
              </div>
              <span className="text-sm font-medium">Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/80 flex items-center justify-center text-white font-bold">
                20+
              </div>
              <span className="text-sm font-medium">Cities</span>
            </div>
          </div>
        </div>
        
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
  );
};

export default HereSection;

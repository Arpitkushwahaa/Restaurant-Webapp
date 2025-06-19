import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

export type FilterOptionsState = {
  id: string;
  label: string;
};

// Expanded list of cuisine options including popular cuisines
const allFilterOptions: FilterOptionsState[] = [
  { id: "burger", label: "Burger" },
  { id: "thali", label: "Thali" },
  { id: "biryani", label: "Biryani" },
  { id: "momos", label: "Momos" },
  { id: "pizza", label: "Pizza" },
  { id: "chinese", label: "Chinese" },
  { id: "italian", label: "Italian" },
  { id: "indian", label: "Indian" },
  { id: "mexican", label: "Mexican" },
  { id: "japanese", label: "Japanese" },
  { id: "thai", label: "Thai" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "dessert", label: "Dessert" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
];

const FilterPage = () => {
  const { setAppliedFilter, appliedFilter, resetAppliedFilter } = useRestaurantStore();
  const [searchFilter, setSearchFilter] = useState("");

  const appliedFilterHandler = (value: string) => {
    setAppliedFilter(value);
  };

  // Filter the options based on search input
  const filteredOptions = searchFilter
    ? allFilterOptions.filter(option => 
        option.label.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : allFilterOptions;

  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-medium text-lg">Filter by cuisines</h1>
        <Button variant={"link"} onClick={resetAppliedFilter}>Reset</Button>
      </div>

      {/* Search filter for cuisines */}
      <div className="relative mb-4">
        <Input
          type="text"
          value={searchFilter}
          placeholder="Search cuisines"
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-8"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2">
        {filteredOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 my-3">
            <Checkbox
              id={option.id}
              checked={appliedFilter.includes(option.label)}
              onClick={() => appliedFilterHandler(option.label)}
            />
            <Label 
              htmlFor={option.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
        
        {filteredOptions.length === 0 && (
          <p className="text-sm text-gray-500 my-2">No cuisines found</p>
        )}
      </div>
    </div>
  );
};

export default FilterPage;

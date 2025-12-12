"use client";

import {Search, Filter} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;

  showFilters: boolean;
  setShowFilters: (v: boolean) => void;

  selectedEvent: string;
  setSelectedEvent: (v: string) => void;

  selectedCategory: string;
  setSelectedCategory: (v: string) => void;

  selectedUniversity: string;
  setSelectedUniversity: (v: string) => void;

  events: string[];
  categories: string[];
  universities: string[];
}

export default function GalleryFilters(
  {
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    selectedEvent,
    setSelectedEvent,
    selectedCategory,
    setSelectedCategory,
    selectedUniversity,
    setSelectedUniversity,
    events,
    categories,
    universities,
  }: Props) {
  const selectConfig = [
    {
      value: selectedEvent,
      setter: setSelectedEvent,
      placeholder: "Select event",
      options: events,
    },
    {
      value: selectedCategory,
      setter: setSelectedCategory,
      placeholder: "Select category",
      options: categories,
    },
    {
      value: selectedUniversity,
      setter: setSelectedUniversity,
      placeholder: "Select university",
      options: universities,
    },
  ];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border mb-8">
      <div className="flex flex-row justify-between gap-4 items-center">

        <div className="flex items-center w-full  px-4 border">
          <Search className="w-4 h-4"/>
          <Input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 transition"
          >
            <Filter className="w-5 h-5"/>
            Filters
          </Button>
        </div>
      </div>

      {/* Select dropdowns */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {selectConfig.map((cfg, index) => (
            <Select
              key={index}
              value={cfg.value}
              onValueChange={(v) => cfg.setter(v)}
            >
              <SelectTrigger className="w-full border p-4 shadow-md">
                <SelectValue placeholder={cfg.placeholder}/>
              </SelectTrigger>

              <SelectContent className="w-full border">
                {cfg.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </div>
  );
}

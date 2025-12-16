import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  query: string;
  setQuery: (query: string) => void;
}
const SearchBar = (
  {
    placeholder = "Search for item here..",
    query,
    setQuery
  }: SearchBarProps
) => {
  return (
    <div className="relative w-full border rounded-card">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
      <Input
        placeholder={placeholder}
        className="pl-8 py-5"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
export default SearchBar
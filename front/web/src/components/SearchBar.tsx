import { useEffect } from "react";
import Input from "./Input";
import _ from "lodash";
import "./SearchBar.css";

type SearchBarProps = {
  style?: React.CSSProperties;
  setSearchInput: (e: string) => void;
  searchInput: string;
  items: any[];
  setItems: (item: any[]) => void;
  name: string[];
};

export default function SearchBar({ style, setSearchInput, searchInput, items, setItems, name }: SearchBarProps) {
  useEffect(() => {
    const sortedItems = [...items].sort((a, b) => {
      let distanceA = 0;
      let distanceB = 0;
      for (let i = 0; i < name.length; i++) {
        const valueA = _.get(a, name[i], "").toLowerCase();
        const valueB = _.get(b, name[i], "").toLowerCase();
        distanceA += valueA.indexOf(searchInput.toLowerCase());
        distanceB += valueB.indexOf(searchInput.toLowerCase());
      }
      return distanceB - distanceA;
    });
    setItems(sortedItems);
  }, [searchInput]);

  return (
    <div className="applets-searchbar-holder" style={style}>
      <Input
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search"
        type="searchInput"
        value={searchInput}
        icon={`${process.env.PUBLIC_URL}/search.png`}
      />
    </div>
  );
}

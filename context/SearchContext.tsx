"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  recentSearches: string[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const loadInitialHistory = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error("Failed to load search history:", error);
  }
  return [];
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] =
    useState<string[]>(loadInitialHistory);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  }, [searchHistory]);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const recentSearches = searchHistory.slice(0, 5);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchHistory,
        addToHistory,
        clearHistory,
        recentSearches,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};

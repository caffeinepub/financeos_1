import type React from "react";
import { createContext, useContext, useState } from "react";

interface CountryInfo {
  country: string;
  code: string;
  symbol: string;
  flag: string;
}

const COUNTRIES: CountryInfo[] = [
  { country: "India", code: "INR", symbol: "₹", flag: "🇮🇳" },
  { country: "United States", code: "USD", symbol: "$", flag: "🇺🇸" },
  { country: "European Union", code: "EUR", symbol: "€", flag: "🇪🇺" },
  { country: "United Kingdom", code: "GBP", symbol: "£", flag: "🇬🇧" },
  { country: "Japan", code: "JPY", symbol: "¥", flag: "🇯🇵" },
  { country: "Canada", code: "CAD", symbol: "CA$", flag: "🇨🇦" },
  { country: "Australia", code: "AUD", symbol: "A$", flag: "🇦🇺" },
];

interface CurrencyContextType {
  country: CountryInfo;
  setCountry: (c: CountryInfo) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  country: COUNTRIES[0],
  setCountry: () => {},
  formatCurrency: (n) => `₹${n.toLocaleString("en-IN")}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<CountryInfo>(COUNTRIES[0]);

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: country.code,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${country.symbol}${amount.toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ country, setCountry, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

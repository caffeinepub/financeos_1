import type React from "react";
import { createContext, useContext, useState } from "react";

export interface CountryInfo {
  country: string;
  code: string;
  symbol: string;
  flag: string;
}

export const COUNTRIES: CountryInfo[] = [
  { country: "India", code: "INR", symbol: "₹", flag: "🇮🇳" },
  { country: "United States", code: "USD", symbol: "$", flag: "🇺🇸" },
  { country: "European Union", code: "EUR", symbol: "€", flag: "🇪🇺" },
  { country: "United Kingdom", code: "GBP", symbol: "£", flag: "🇬🇧" },
  { country: "Japan", code: "JPY", symbol: "¥", flag: "🇯🇵" },
  { country: "China", code: "CNY", symbol: "¥", flag: "🇨🇳" },
  { country: "Canada", code: "CAD", symbol: "CA$", flag: "🇨🇦" },
  { country: "Australia", code: "AUD", symbol: "A$", flag: "🇦🇺" },
  { country: "Switzerland", code: "CHF", symbol: "Fr", flag: "🇨🇭" },
  { country: "South Korea", code: "KRW", symbol: "₩", flag: "🇰🇷" },
  { country: "Singapore", code: "SGD", symbol: "S$", flag: "🇸🇬" },
  { country: "Hong Kong", code: "HKD", symbol: "HK$", flag: "🇭🇰" },
  { country: "Sweden", code: "SEK", symbol: "kr", flag: "🇸🇪" },
  { country: "Norway", code: "NOK", symbol: "kr", flag: "🇳🇴" },
  { country: "Brazil", code: "BRL", symbol: "R$", flag: "🇧🇷" },
  { country: "Mexico", code: "MXN", symbol: "MX$", flag: "🇲🇽" },
  { country: "UAE", code: "AED", symbol: "د.إ", flag: "🇦🇪" },
  { country: "Saudi Arabia", code: "SAR", symbol: "﷼", flag: "🇸🇦" },
  { country: "South Africa", code: "ZAR", symbol: "R", flag: "🇿🇦" },
  { country: "Russia", code: "RUB", symbol: "₽", flag: "🇷🇺" },
];

export const SUPPORTED_CURRENCIES = COUNTRIES;

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

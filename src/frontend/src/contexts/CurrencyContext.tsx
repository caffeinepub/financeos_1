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

const STORAGE_KEY = "financeOS_currency";

function loadPersistedCountry(): CountryInfo {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CountryInfo;
      const valid = COUNTRIES.find((c) => c.code === parsed.code);
      if (valid) return valid;
    }
  } catch {
    // ignore parse errors
  }
  return COUNTRIES[0];
}

interface CurrencyContextType {
  country: CountryInfo;
  setCountry: (c: CountryInfo) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  country: COUNTRIES[0],
  setCountry: () => {},
  formatCurrency: (n) => n.toFixed(2),
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] =
    useState<CountryInfo>(loadPersistedCountry);

  const setCountry = (c: CountryInfo) => {
    setCountryState(c);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      // ignore storage errors
    }
  };

  const formatCurrency = (amount: number): string => {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    const sym = country.symbol;
    const isINR = country.code === "INR";
    if (isINR) {
      if (absAmount >= 10000000)
        return `${sign}${sym}${(absAmount / 10000000).toFixed(2)} Cr`;
      if (absAmount >= 100000)
        return `${sign}${sym}${(absAmount / 100000).toFixed(2)} L`;
      if (absAmount >= 1000)
        return `${sign}${sym}${(absAmount / 1000).toFixed(2)} K`;
      return `${sign}${sym}${absAmount.toFixed(2)}`;
    }
    if (absAmount >= 1_000_000_000)
      return `${sign}${sym}${(absAmount / 1_000_000_000).toFixed(2)} B`;
    if (absAmount >= 1_000_000)
      return `${sign}${sym}${(absAmount / 1_000_000).toFixed(2)} M`;
    if (absAmount >= 1000)
      return `${sign}${sym}${(absAmount / 1000).toFixed(2)} K`;
    return `${sign}${sym}${absAmount.toFixed(2)}`;
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

export function formatCurrencyWithSymbol(
  amount: number,
  symbol: string,
  currencyCode = "INR",
): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  const isINR = currencyCode === "INR";
  if (isINR) {
    if (absAmount >= 10000000)
      return `${sign}${symbol}${(absAmount / 10000000).toFixed(2)} Cr`;
    if (absAmount >= 100000)
      return `${sign}${symbol}${(absAmount / 100000).toFixed(2)} L`;
    if (absAmount >= 1000)
      return `${sign}${symbol}${(absAmount / 1000).toFixed(2)} K`;
    return `${sign}${symbol}${absAmount.toFixed(2)}`;
  }
  if (absAmount >= 1_000_000_000)
    return `${sign}${symbol}${(absAmount / 1_000_000_000).toFixed(2)} B`;
  if (absAmount >= 1_000_000)
    return `${sign}${symbol}${(absAmount / 1_000_000).toFixed(2)} M`;
  if (absAmount >= 1000)
    return `${sign}${symbol}${(absAmount / 1000).toFixed(2)} K`;
  return `${sign}${symbol}${absAmount.toFixed(2)}`;
}

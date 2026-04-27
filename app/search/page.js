"use client";
import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Please enter a search term info.");
      return;
    }

    setLoading(true);
    setResults([]);
    setSearched(false);
    setError("");
    {/* Call the backend API to perform the search */}
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
     {/* Mark that we've performed a search, so we can show "No results" if needed */}
      setSearched(true);
      if (res.ok && data.success) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 py-10">
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 animate-[fadeInUp_0.6s_ease-out]">

        <h1 className="text-2xl font-bold text-center">Search Appliance</h1>
        <p className="text-sm text-center text-gray-600">Search by anything</p>

        {/* Search input */}
        <input
          className="input input-default input-focus w-full"
          placeholder="Anything about the appliance"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
        />
       {/* error message */}
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
       {/* Search button */}
        <button
          className={`btn btn-primary w-full ${loading ? "btn-disabled opacity-60 cursor-not-allowed" : ""}`}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/*if no results found */}
        {searched && results.length === 0 && (
          <div className="rounded-xl border border-red-300 bg-red-100/60 px-4 py-5 text-center space-y-3 animate-[fadeInUp_0.5s]">
            <p className="text-red-700 font-semibold">No matching appliance found!</p>
            <a
              href="/"
              className="inline-block text-sm text-green-700 font-medium underline underline-offset-2 hover:text-green-900"
            >
              ← Back to Homepage
            </a>
          </div>
        )}

        {/*Results list*/}
        {results.length > 0 && (
          <div className="space-y-3 animate-[fadeInUp_0.5s]">
            <p className="text-xs text-gray-500 font-medium">
              {results.length} result{results.length > 1 ? "s" : ""} found
            </p>

            {results.map((item) => (
              <div
                key={item.ApplianceID}
                className="bg-white/50 p-4 rounded-xl border border-white/40 space-y-1"
              >
                <Section title="Appliance Information">
                  <Row label="Appliance Type" value={item.ApplianceType} />
                  <Row label="Brand"          value={item.Brand} />
                  <Row label="Model Number"   value={item.ModelNumber} />
                  <Row label="Serial Number"  value={item.SerialNumber} />
                  <Row label="Purchase Date"  value={item.PurchaseDate?.split("T")[0]} />
                  <Row label="Warranty Date"  value={item.WarrantyDate?.split("T")[0]} />
                  <Row label="Cost"           value={`€${Number(item.CostOfAppliance).toFixed(2)}`} />
                </Section>
              </div>
            ))}

            <div className="pt-1 text-center">
              <a
                href="/"
                className="inline-block text-sm text-green-700 font-medium underline underline-offset-2 hover:text-green-900"
              >
                ← Back to Homepage
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-2">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800 font-semibold text-right max-w-[60%]">{value ?? "—"}</span>
    </div>
  );
}


"use client";
import { useState } from "react";

export default function Search() {
  const [serial, setSerial] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/search?q=${query}`);
    const result = await res.json();
    setData(result.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-green-100 to-green-200">

      <div className="backdrop-blur-xl bg-white/30 border border-white/40 
      p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4">
   {/*sreach anything about the appliance can find out */}
        <input
          className="input input-default input-focus"
          placeholder="Anything about the appliance"
          onChange={e => setQuery(e.target.value)}
        />
        {/*button design */}
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>

        {data && (
          <div className="bg-white/40 p-4 rounded-xl border border-white/30 animate-[fadeInUp_0.5s]">
            <p><b>Brand:</b> {data.Brand}</p>
            <p><b>Type:</b> {data.ApplianceType}</p>
            <p><b>Owner:</b> {data.FirstName} {data.LastName}</p>
          </div>
        )}
      </div>
    </div>
  );
}


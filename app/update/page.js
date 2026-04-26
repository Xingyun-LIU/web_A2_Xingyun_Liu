"use client";
import { useState } from "react";

export default function Update() {
  const [form, setForm] = useState({});

  const handleSearch = async () => {
    const res = await fetch(`/api/search?serial=${form.serialNumber}`);
    const result = await res.json();
    if (result.success) setForm(result.data);
  };

  const handleUpdate = async () => {
    await fetch("/api/update", {
      method: "PUT",
      body: JSON.stringify(form),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 page-enter">
      <div className="bg-white p-8 rounded-2xl shadow-xl space-y-4 w-full max-w-md">

        <input
          className="input input-default input-focus"
          placeholder="Serial"
          onChange={e => setForm({...form, serialNumber: e.target.value})}
        />

        <button className="btn btn-primary" onClick={handleSearch}>
          Load
        </button>

        <input
          className="input input-default input-focus"
          value={form.Brand || ""}
          onChange={e => setForm({...form, Brand: e.target.value})}
        />

        <button className="btn btn-primary" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}


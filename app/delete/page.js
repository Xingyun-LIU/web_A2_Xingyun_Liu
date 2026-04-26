"use client";
import { useState } from "react";

export default function Delete() {
  const [serial, setSerial] = useState("");
{/*double check that make sure you really want to delete */}
  const handleDelete = async () => {
    if (!confirm("⚠️ Are you sure you want to delete this appliance?")) return;
    {/*delete */}
    await fetch("/api/delete", {
      method: "DELETE",
      body: JSON.stringify({ serialNumber: serial }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-red-100 to-red-200">

      <div className="backdrop-blur-xl bg-white/30 border border-white/40 
      p-8 rounded-2xl shadow-xl space-y-4 w-full max-w-md">
       {/*need user input serial number to delete */}
        <input
          className="input input-default input-focus"
          placeholder="Serial Number"
          onChange={e => setSerial(e.target.value)}
        />
       {/*button design */}
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete Appliance
        </button>
      </div>
    </div>
  );
}


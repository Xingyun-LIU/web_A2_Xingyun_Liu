"use client";
import { useState } from "react";

export default function Add() {
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/appliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        alert("connect successed");
    }
    {/*connect with database(add to the database)*/}

    const data = await res.json();
    setLoading(false);
    {/*validation */}

    if (data.success) {
      showToast("Appliance Added!", "success");
    } else {
      showToast(data.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-green-100 to-green-200">

      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.msg}
        </div>
      )}
      {/*submition CSS */}
      <form onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/30 border border-white/40 
        p-8 rounded-2xl shadow-xl space-y-4 w-full max-w-md
        animate-[fadeInUp_0.6s_ease-out]">

        <h1 className="text-2xl font-bold text-center">Add Appliance</h1>
        {/*users info*/}
        <input
        className="input input-default input-focus"
        placeholder="First Name"
        onChange={e=> setForm({...form,firstName:e.target.value})}
        />
        <input
        className="input input-default input-focus"
        placeholder="Last Name"
        onChange={e=> setForm({...form,lastName:e.target.value})}
        />

        <input
        className="input input-default input-focus"
        placeholder="Address"
        onChange={e=> setForm({...form,address:e.target.value})}
        />

        <input
        className="input input-default input-focus"
        placeholder="Mobile"
        onChange={e=> setForm({...form,mobile:e.target.value})}
        />

        <input
          className="input input-default input-focus"
          placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})}
        />

        <input
          className="input input-default input-focus"
          placeholder="Eircode"
          onChange={e => setForm({...form, eircode: e.target.value.toUpperCase()})}
        />

        <input
          className="input input-default input-focus"
          placeholder="UserID"
          onChange={e => setForm({...form, userID: e.target.value})}
        />
        {/*Appliance */}

        <input
          className="input input-default input-focus"
          placeholder="Appliance Type"
          onChange={e => setForm({...form, applianceType: e.target.value})}
        />

        <input
          className="input input-default input-focus"
          placeholder="Brand"
          onChange={e => setForm({...form, serialNumber: e.target.value})}
        />

        <input
          className="input input-default input-focus"
          placeholder="Model Number"
          onChange={e => setForm({...form, modelNumber: e.target.value})}
        />

        <input
          className="input input-default input-focus"
          placeholder="Serial Number"
          onChange={e => setForm({...form, serialNumber: e.target.value})}
        />

        <input
           className="input input-default input-focus"
           type="date"
           value={purchaseDate}
           onChange={e => setPurchaseDate(e.target.value)}
        />


        <input
            className="input input-default input-focus"
            type="date"
            value={warrantyDate}
            onChange={e => setWarrantyDate(e.target.value)}
        />


        <input
          className="input input-default input-focus"
          placeholder="Cost of Appliance"
          onChange={e => setForm({...form, costOfAppliance: e.target.value})}
        />

        <input
          className="input input-default input-focus"
          placeholder="ApplianceID"
          onChange={e => setForm({...form, ApplianceID: e.target.value})}
        />

       {/*submit button design */}
        <button
          className={`btn btn-primary ${loading && "btn-disabled"}`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Appliance"}
        </button>
      </form>
    </div>
  );
}



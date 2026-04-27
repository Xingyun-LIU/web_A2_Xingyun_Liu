"use client";
import { useState } from "react";

export default function Delete() {
  const [serial, setSerial]       = useState("");
  const [appliance, setAppliance] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [deleted, setDeleted]     = useState(false);

    {/* Step 1: Search by serial number and load appliance details */}
  const handleSearch = async () => {
    const trimmed = serial.trim();
    if (!trimmed) {
      setLoadError("Please enter a serial number.");
      return;
    }

    setSearching(true);
    setLoadError("");
    setAppliance(null);
    setGlobalError("");
{/* Perform search API call to load appliance details by serial number */}
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && data.success && data.data.length > 0) {
        const match = data.data.find((item) => item.SerialNumber === trimmed);
        if (match) {
          setAppliance(match);
        } else {
          setLoadError("No appliance found with that exact serial number.");
        }
      } else {
        setLoadError("No matching appliance found!");
      }
    } catch (err) {
      console.error("Search error:", err);
      setLoadError("A network error occurred. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  {/* Step 2: Confirm details and perform delete action */}
  const handleDelete = async () => {
    setDeleting(true);
    setGlobalError("");
  {/* Perform delete API call with the appliance's serial number */}
    try {
      const res  = await fetch("/api/delete", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ serialNumber: appliance.SerialNumber }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDeleted(true);
      } else {
        setGlobalError(data.message || "Delete failed. Please try again.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setGlobalError("A network error occurred. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  {/* Deleted state (after successful deletion) */}
  if (deleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 p-10 rounded-2xl shadow-xl text-center space-y-6 w-full max-w-md animate-[fadeInUp_0.6s_ease-out]">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-500/20 border-2 border-red-400">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800">Deleted</h2>
          <p className="text-red-900 font-medium">Appliance Deleted.</p>
          <a
            href="/"
            className="inline-block w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    );
  }

  {/* Main UI */}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 py-10">
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 animate-[fadeInUp_0.6s_ease-out]">

        <h1 className="text-2xl font-bold text-center">Delete Appliance</h1>

        {/* ── Step 1: Serial number lookup ── */}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-1">
          Step 1 — Find Appliance
        </p>

        <input
          className="input input-default input-focus w-full"
          placeholder="Serial Number (e.g. 1234-5678-9012)"
          value={serial}
          onChange={(e) => {
            setSerial(e.target.value);
            setLoadError("");
            setAppliance(null);
          }}
          onKeyDown={handleKeyDown}
        />

        {loadError && (
          <p className="text-xs text-red-600 font-medium">{loadError}</p>
        )}

        <button
          className={`btn btn-primary w-full ${searching ? "btn-disabled opacity-60 cursor-not-allowed" : ""}`}
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? "Searching..." : "Load Appliance"}
        </button>

        {/* ── Step 2: Confirm details before deletion ── */}
        {appliance && (
          <div className="space-y-4 animate-[fadeInUp_0.5s]">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-2">
              Step 2 — Confirm Deletion
            </p>

            {/* Appliance details card */}
            <div className="bg-white/50 p-4 rounded-xl border border-white/40 space-y-1">
              <Section title="Appliance Information">
                <Row label="Appliance Type" value={appliance.ApplianceType} />
                <Row label="Brand"          value={appliance.Brand} />
                <Row label="Model Number"   value={appliance.ModelNumber} />
                <Row label="Serial Number"  value={appliance.SerialNumber} />
                <Row label="Purchase Date"  value={appliance.PurchaseDate?.split("T")[0]} />
                <Row label="Warranty Date"  value={appliance.WarrantyDate?.split("T")[0]} />
                <Row label="Cost"           value={`€${Number(appliance.CostOfAppliance).toFixed(2)}`} />
              </Section>

              <Section title="Customer Information">
                <Row label="Name"    value={`${appliance.FirstName} ${appliance.LastName}`} />
                <Row label="Email"   value={appliance.Email} />
                <Row label="Mobile"  value={appliance.Mobile} />
                <Row label="Address" value={appliance.Address} />
                <Row label="Eircode" value={appliance.Eircode} />
              </Section>
            </div>

            {/* Warning notice */}
            <div className="rounded-xl border border-red-300 bg-red-100/60 px-4 py-3 text-sm text-red-700">
              ⚠️ This action is permanent and cannot be undone.
            </div>

            {globalError && (
              <p className="text-xs text-red-600 font-medium">{globalError}</p>
            )}

            {/* Confirm delete button */}
            <button
              className={`btn btn-danger w-full ${deleting ? "btn-disabled opacity-60 cursor-not-allowed" : ""}`}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>

            {/* Cancel */}
            <button
              className="btn w-full bg-white/40 hover:bg-white/60 text-gray-700 border border-gray-300"
              onClick={() => { setAppliance(null); setSerial(""); setGlobalError(""); }}
            >
              Cancel
            </button>
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


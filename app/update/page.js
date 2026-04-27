"use client";
import { useState } from "react";

export default function Update() {
  const [serial, setSerial] = useState("");
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState(false);

  {/* Step 1: Search by serial number and load form */}
  const handleSearch = async () => {
    const trimmed = serial.trim();
    if (!trimmed) {
      setLoadError("Please enter a serial number.");
      return;
    }

    setSearching(true);
    setLoadError("");
    setForm(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && data.success && data.data.length > 0) {
        // Find exact serial match from results
        const match = data.data.find(
          (item) => item.SerialNumber === trimmed
        );
        if (match) {
          setForm({
            // Read-only identifiers (displayed but not editable)
            ApplianceID:  match.ApplianceID,
            SerialNumber: match.SerialNumber,
            // Editable appliance fields
            ApplianceType: match.ApplianceType  || "",
            Brand:         match.Brand          || "",
            ModelNumber:   match.ModelNumber    || "",
            PurchaseDate:  match.PurchaseDate?.split("T")[0] || "",
            WarrantyDate:  match.WarrantyDate?.split("T")[0] || "",
            CostOfAppliance: match.CostOfAppliance ?? "",
            // Editable user fields
            FirstName: match.FirstName || "",
            LastName:  match.LastName  || "",
            Email:     match.Email     || "",
            Mobile:    match.Mobile    || "",
            Address:   match.Address   || "",
            Eircode:   match.Eircode   || "",
          });
        } else {
          setLoadError("No appliance found with that exact serial number.");
        }
      } else {
        setLoadError("No matching appliance found!");
      }
    } catch (err) {
      console.error("Load error:", err);
      setLoadError("A network error occurred. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setGlobalError("");
  };

  {/* Step 2: Submit updated form data */}
  const handleUpdate = async () => {
    setLoading(true);
    setFieldErrors({});
    setGlobalError("");

    try {
      const res = await fetch("/api/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setGlobalError(data.message || "Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setGlobalError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  {/* Success state (after update) */}
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 p-10 rounded-2xl shadow-xl text-center space-y-6 w-full max-w-md animate-[fadeInUp_0.6s_ease-out]">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-500">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Success!</h2>
          <p className="text-green-900 font-medium">Appliance has been updated.</p>
          <a
            href="/"
            className="inline-block w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    );
  }

  {/* Main UI */}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 py-10">
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 animate-[fadeInUp_0.6s_ease-out]">

        <h1 className="text-2xl font-bold text-center">Update Appliance</h1>

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
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`btn btn-primary w-full ${searching ? "btn-disabled opacity-60 cursor-not-allowed" : ""}`}
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? "Searching..." : "Load Appliance"}
        </button>

        {loadError && (
          <p className="text-xs text-red-600 font-medium">{loadError}</p>
        )}

        {/* ── Step 2: Edit form (shown after load) ── */}
        {form && (
          <>
            {/* Read-only identifiers */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-2">
              Step 2 — Edit Details
            </p>

            <div className="rounded-xl bg-white/20 border border-white/30 px-4 py-3 space-y-1 text-sm">
              <p className="text-gray-500">
                <span className="font-medium text-gray-700">Appliance ID: </span>{form.ApplianceID}
              </p>
              <p className="text-gray-500">
                <span className="font-medium text-gray-700">Serial Number: </span>{form.SerialNumber}
              </p>
            </div>

            {globalError && (
              <div className="rounded-xl border border-red-400 bg-red-100/60 px-4 py-3 text-sm text-red-700 font-medium">
                {globalError}
              </div>
            )}

            {/* Appliance fields */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-1">
              Appliance Information
            </p>

            <Field label="Appliance Type" error={fieldErrors.ApplianceType}>
              <input name="ApplianceType" className={inputClass(fieldErrors.ApplianceType)}
                value={form.ApplianceType} onChange={handleChange} />
            </Field>

            <Field label="Brand" error={fieldErrors.Brand}>
              <input name="Brand" className={inputClass(fieldErrors.Brand)}
                value={form.Brand} onChange={handleChange} />
            </Field>

            <Field label="Model Number" error={fieldErrors.ModelNumber} hint="Format: 000-000-0000">
              <input name="ModelNumber" className={inputClass(fieldErrors.ModelNumber)}
                value={form.ModelNumber} onChange={handleChange} />
            </Field>

            <Field label="Purchase Date" error={fieldErrors.PurchaseDate}>
              <input name="PurchaseDate" type="date" className={inputClass(fieldErrors.PurchaseDate)}
                value={form.PurchaseDate} onChange={handleChange} />
            </Field>

            <Field label="Warranty Expiry Date" error={fieldErrors.WarrantyDate}>
              <input name="WarrantyDate" type="date" className={inputClass(fieldErrors.WarrantyDate)}
                value={form.WarrantyDate} onChange={handleChange} />
            </Field>

            <Field label="Cost of Appliance (€)" error={fieldErrors.CostOfAppliance}>
              <input name="CostOfAppliance" className={inputClass(fieldErrors.CostOfAppliance)}
                value={form.CostOfAppliance} onChange={handleChange} />
            </Field>

            {/* User fields */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-1">
              Customer Information
            </p>

            <Field label="First Name" error={fieldErrors.FirstName}>
              <input name="FirstName" className={inputClass(fieldErrors.FirstName)}
                value={form.FirstName} onChange={handleChange} />
            </Field>

            <Field label="Last Name" error={fieldErrors.LastName}>
              <input name="LastName" className={inputClass(fieldErrors.LastName)}
                value={form.LastName} onChange={handleChange} />
            </Field>

            <Field label="Email" error={fieldErrors.Email}>
              <input name="Email" type="email" className={inputClass(fieldErrors.Email)}
                value={form.Email} onChange={handleChange} />
            </Field>

            <Field label="Mobile" error={fieldErrors.Mobile}>
              <input name="Mobile" className={inputClass(fieldErrors.Mobile)}
                value={form.Mobile} onChange={handleChange} />
            </Field>

            <Field label="Address" error={fieldErrors.Address}>
              <input name="Address" className={inputClass(fieldErrors.Address)}
                value={form.Address} onChange={handleChange} />
            </Field>

            <Field label="Eircode" error={fieldErrors.Eircode} hint="Format: D## XXXX">
              <input name="Eircode" className={inputClass(fieldErrors.Eircode)}
                value={form.Eircode} onChange={handleChange} />
            </Field>

            <button
              className={`btn btn-primary w-full ${loading ? "btn-disabled opacity-60 cursor-not-allowed" : ""}`}
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Appliance"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}

function inputClass(error) {
  return `input input-default input-focus w-full${error ? " border-red-400 focus:border-red-500" : ""}`;
}

function Field({ label, error, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}


"use client";
import { useState } from "react";
export default function Add() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
    email: "",
    eircode: "",
    applianceType: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyDate: "",
    cost: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setGlobalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGlobalError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("New appliance added successfully.");
      } else {
        // Handle field-level validation errors from backend
        if (data.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors);
        } else if (data.message === "Appliance already exists") {
          setGlobalError("Appliance already exists.");
        } else {
          setGlobalError(data.message || "Failed to add appliance. Please try again.");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      setGlobalError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 p-10 rounded-2xl shadow-xl text-center space-y-6 w-full max-w-md animate-[fadeInUp_0.6s_ease-out]">
          {/* Tick icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-500">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Success!</h2>
          <p className="text-green-900 font-medium">{successMessage}</p>
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

  // Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 py-10">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/30 border border-white/40 p-8 rounded-2xl shadow-xl space-y-4 w-full max-w-md animate-[fadeInUp_0.6s_ease-out]"
      >
        <h1 className="text-2xl font-bold text-center">Add Appliance</h1>

        {/* Global error banner (e.g. "Appliance already exists") */}
        {globalError && (
          <div className="rounded-xl border border-red-400 bg-red-100/60 px-4 py-3 text-sm text-red-700 font-medium">
            {globalError}
          </div>
        )}

        {/* User Information */}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-2">
          Customer Details
        </p>

        <Field label="First Name" error={fieldErrors.firstName}>
          <input
            name="firstName"
            className={inputClass(fieldErrors.firstName)}
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Last Name" error={fieldErrors.lastName}>
          <input
            name="lastName"
            className={inputClass(fieldErrors.lastName)}
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Address" error={fieldErrors.address}>
          <input
            name="address"
            className={inputClass(fieldErrors.address)}
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Mobile" error={fieldErrors.mobile}>
          <input
            name="mobile"
            className={inputClass(fieldErrors.mobile)}
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Email" error={fieldErrors.email}>
          <input
            name="email"
            type="email"
            className={inputClass(fieldErrors.email)}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Eircode" error={fieldErrors.eircode} hint="Format: D## XXXX">
          <input
            name="eircode"
            className={inputClass(fieldErrors.eircode)}
            placeholder="e.g. D01 AB23"
            value={formData.eircode}
            onChange={handleChange}
            required
          />
        </Field>

        {/*Appliance Information*/}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 pt-2">
          Appliance Details
        </p>

        <Field label="Appliance Type" error={fieldErrors.applianceType}>
          <input
            name="applianceType"
            className={inputClass(fieldErrors.applianceType)}
            placeholder="Appliance Type"
            value={formData.applianceType}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Brand" error={fieldErrors.brand}>
          <input
            name="brand"
            className={inputClass(fieldErrors.brand)}
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Model Number" error={fieldErrors.modelNumber} hint="Format: 000-000-0000">
          <input
            name="modelNumber"
            className={inputClass(fieldErrors.modelNumber)}
            placeholder="e.g. 123-456-7890"
            value={formData.modelNumber}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Serial Number" error={fieldErrors.serialNumber} hint="Format: 0000-0000-0000">
          <input
            name="serialNumber"
            className={inputClass(fieldErrors.serialNumber)}
            placeholder="e.g. 1234-5678-9012"
            value={formData.serialNumber}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Purchase Date" error={fieldErrors.purchaseDate}>
          <input
            name="purchaseDate"
            className={inputClass(fieldErrors.purchaseDate)}
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Warranty Expiry Date" error={fieldErrors.warrantyDate}>
          <input
            name="warrantyDate"
            className={inputClass(fieldErrors.warrantyDate)}
            type="date"
            value={formData.warrantyDate}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Cost of Appliance (€)" error={fieldErrors.cost}>
          <input
            name="cost"
            className={inputClass(fieldErrors.cost)}
            placeholder="e.g. 299.99"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </Field>

        {/*Submit*/}
        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "btn-disabled opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Appliance"}
        </button>
      </form>
    </div>
  );
}

//Helper: returns extra red border class when there's an error
function inputClass(error) {
  return `input input-default input-focus w-full${error ? " border-red-400 focus:border-red-500" : ""}`;
}

//Helper: wraps an input with a label and optional error / hint text
function Field({ label, error, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}




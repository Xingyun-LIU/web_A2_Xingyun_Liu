"use client";
import { useState } from 'react';

export default function PartBC() {
  // State to store all form input values
  const [form, setForm] = useState({
  firstName: '',
  lastName: '',
  address: '',
  mobile: '',
  email: '',
  eircode: '',
  applianceType: '',
  brand: '',
  modelNumber: '',
  serialNumber: '',
  purchaseDate: '',
  warrantyDate: '',
  cost: ''
});


  // State to store validation errors returned from backend
  const [errors, setErrors] = useState({});

  // State to store success message after submission
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page reload

    // Reset previous errors and success message
    setErrors({});
    setSuccess('');

    // Send form data to backend API
    const res = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form), // Convert form object to JSON
    });

    // Parse JSON response from backend
    const result = await res.json();

    if (!result.success) {
      // If backend validation fails:
      // Only update error messages (keep form data unchanged → Sticky Behavior)
      setErrors(result.errors);
    } else {
      // If submission is successful:
      setSuccess("Appliance Registered Successfully!");

      // Optionally reset form fields after success
      // setForm({ eircode: '', applianceType: '', brand: '', ... }); 
    }
  };

  return (
    // Page container
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      
      {/* Form card */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
        
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          House Appliance Inventory
        </h1>
        
        {/* Success message display */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Form layout (responsive grid) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          
          {/* Eircode input (full width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">
              Dublin Eircode (Format: D00 0000)
            </label>
            <input 
              type="text" 
              value={form.eircode}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              // Update eircode field in state
              onChange={e => setForm({...form, eircode: e.target.value})} 
            />
            {/* Display validation error if exists */}
            {errors.eircode && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.eircode}
              </p>
            )}
          </div>

          {/* Appliance Type dropdown */}
          <div>
            <label className="block text-sm font-bold mb-1">Appliance Type</label>
            <select 
              value={form.applianceType}
              className="w-full border p-2 rounded"
              // Update appliance type in state
              onChange={e => setForm({...form, applianceType: e.target.value})}
            >
              <option value="">Select Type...</option>
              <option value="Fridge">Fridge</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Microwave">Microwave</option>
              <option value="Dishwasher">Dishwasher</option>
            </select>
          </div>

          {/* Brand input */}
          <div>
            <label className="block text-sm font-bold mb-1">Brand</label>
            <input 
              type="text" 
              value={form.brand}
              className="w-full border p-2 rounded"
              // Update brand in state
              onChange={e => setForm({...form, brand: e.target.value})} 
            />
          </div>

          {/* Model Number input */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Model Number (000-000-0000)
            </label>
            <input 
              type="text" 
              value={form.modelNumber}
              className="w-full border p-2 rounded"
              // Update model number in state
              onChange={e => setForm({...form, modelNumber: e.target.value})} 
            />
            {/* Display validation error if exists */}
            {errors.modelNumber && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.modelNumber}
              </p>
            )}
          </div>

          {/* Serial Number input */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Serial Number (0000-0000-0000)
            </label>
            <input 
              type="text" 
              value={form.serialNumber}
              className="w-full border p-2 rounded"
              // Update serial number in state
              onChange={e => setForm({...form, serialNumber: e.target.value})} 
            />
            {/* Display validation error if exists */}
            {errors.serialNumber && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.serialNumber}
              </p>
            )}
          </div>

          {/* Purchase Date input */}
          <div>
            <label className="block text-sm font-bold mb-1">Purchase Date</label>
            <input 
              type="date" 
              value={form.purchaseDate}
              className="w-full border p-2 rounded"
              // Update purchase date in state
              onChange={e => setForm({...form, purchaseDate: e.target.value})} 
            />
          </div>

          {/* Warranty Expiration input */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Warranty Expiration
            </label>
            <input 
              type="date" 
              value={form.warrantyDate}
              className="w-full border p-2 rounded"
              // Update warranty date in state
              onChange={e => setForm({...form, warrantyDate: e.target.value})} 
            />
            {/* Display validation error if exists */}
            {errors.warrantyDate && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.warrantyDate}
              </p>
            )}
          </div>

          <input type="text" placeholder="First Name" onChange={e => setForm({...form, firstName: e.target.value})}/>
          <input type="email" placeholder="Email"onChange={e => setForm({...form, email: e.target.value})}/>
          <input type="number" placeholder="Cost"onChange={e => setForm({...form, cost: e.target.value})}/>


          {/* Submit button */}
          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

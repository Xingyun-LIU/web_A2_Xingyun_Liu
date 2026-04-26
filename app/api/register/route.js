import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// XSS Sanitization: escape HTML special characters to prevent script injection
function sanitize(input) {
  // Only sanitize string inputs
  if (typeof input !== 'string') 
    return input;

  // Replace dangerous characters with safe HTML entities
  return input.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    '"': '&quot;', 
    "'": '&#39;'
  })[m]);
}

// Handle POST request from frontend
export async function POST(request) {
  // Parse incoming JSON data from request body
  const data = await request.json();

  // Object to collect validation errors
  const errors = {};

  // 1. Regex Validation for input formats
  const eircodeRegex = /^D\d{2} [A-Z0-9]{4}$/; // Dublin Eircode format
  // Validate Eircode format
  if (!eircodeRegex.test(data.eircode)) {
    errors.eircode = "Invalid Dublin Eircode format (e.g., D01 A1B2).";
  }
  const modelRegex = /^\d{3}-\d{3}-\d{4}$/;              // Model: 000-000-0000
  // Validate model number format
  if (!modelRegex.test(data.modelNumber)) {
    errors.modelNumber = "Invalid format. Expected: 000-000-0000";
  }
  const serialRegex = /^\d{4}-\d{4}-\d{4}$/;             // Serial: 0000-0000-0000
  // Validate serial number format
  if (!serialRegex.test(data.serialNumber)) {
    errors.serialNumber = "Invalid format. Expected: 0000-0000-0000";
  }

  // 2. Date Logic Validation
  const pDate = new Date(data.purchaseDate); // Purchase date
  const wDate = new Date(data.warrantyDate); // Warranty expiration date

  // Ensure warranty date is after purchase date
  if (wDate <= pDate) {
    errors.warrantyDate = "Warranty expiration must be after the purchase date.";
  }

  // If any validation errors exist, return immediately with status 400
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { success: false, errors },
      { status: 400 }
    );
  }

  // 3. XSS Sanitization: clean all input fields before storage
  const sanitizedData = {};
  for (let key in data) {
    sanitizedData[key] = sanitize(data[key]);
  }

  // 4. JSON File Storage (Simple persistence layer)
  try {
    // Define file path (root directory)
    const filePath = path.join(process.cwd(), 'inventory.json');

    let inventory = [];

    // If file already exists, read and parse existing data
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      inventory = JSON.parse(fileData);
    }
    
    // Add new sanitized record to inventory array
    inventory.push(sanitizedData);

    // Write updated data back to file (formatted JSON)
    fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));

    // Return success response with saved data
    return NextResponse.json({ success: true, data: sanitizedData });

  } catch (error) {
    // Handle file system or parsing errors
    return NextResponse.json(
      { success: false, errors: { system: "Failed to save data." } },
      { status: 500 }
    );
  }
}
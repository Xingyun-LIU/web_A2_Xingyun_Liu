import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// XSS Sanitization: escape HTML special characters to prevent script injection
function sanitize(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[m]);
}

export async function POST(req) {
  const data = await req.json();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    //Input Validation
    const errors = {};

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = "Invalid email format.";
    }

    // Eircode – Dublin format: D## XXXX
    const eircodeRegex = /^D\d{2} [A-Z0-9]{4}$/;
    if (!data.eircode || !eircodeRegex.test(data.eircode)) {
      errors.eircode = "Invalid Eircode. Expected format: D## XXXX (e.g. D01 AB23).";
    }

    // Model Number – 000-000-0000
    const modelNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!data.modelNumber || !modelNumberRegex.test(data.modelNumber)) {
      errors.modelNumber = "Invalid model number. Expected format: 000-000-0000.";
    }

    // Serial Number – 0000-0000-0000
    const serialRegex = /^\d{4}-\d{4}-\d{4}$/;
    if (!data.serialNumber || !serialRegex.test(data.serialNumber)) {
      errors.serialNumber = "Invalid serial number. Expected format: 0000-0000-0000.";
    }

    // Cost – must be a positive number
    if (data.cost === null || data.cost === undefined || String(data.cost).trim() === "") {
      errors.cost = "Cost is required.";
    } else {
      const costNumber = Number(data.cost);
      if (Number.isNaN(costNumber) || costNumber < 0) {
        errors.cost = "Cost must be a valid positive number.";
      }
    }

    // Required text fields
    const requiredFields = ["firstName", "lastName", "address", "mobile", "applianceType", "brand"];
    for (const field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === "") {
        errors[field] = "This field is required.";
      }
    }

    // Dates
    let purchaseDate = null;
    let warrantyDate = null;

    if (!data.purchaseDate || isNaN(Date.parse(data.purchaseDate))) {
      errors.purchaseDate = "Invalid purchase date.";
    } else {
      purchaseDate = new Date(data.purchaseDate).toISOString().split("T")[0];
    }

    if (!data.warrantyDate || isNaN(Date.parse(data.warrantyDate))) {
      errors.warrantyDate = "Invalid warranty date.";
    } else {
      warrantyDate = new Date(data.warrantyDate).toISOString().split("T")[0];
    }

    // Warranty must not be before purchase date
    if (purchaseDate && warrantyDate && warrantyDate < purchaseDate) {
      errors.warrantyDate = "Warranty expiry date cannot be before the purchase date.";
    }

    // Return all field-level errors at once so the UI can highlight them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    //XSS Sanitization
    const sanitizedData = {};
    for (const key in data) {
      sanitizedData[key] = sanitize(data[key]);
    }

    //Database Operations

    // Check whether this user already exists (matched by email)
    const [users] = await connection.query(
      "SELECT UserID FROM User WHERE Email = ?",
      [sanitizedData.email]
    );

    let userId;

    if (users.length > 0) {
      // User exists – reuse their ID
      userId = users[0].UserID;
    } else {
      // New user – insert a record
      const [result] = await connection.query(
        `INSERT INTO User (FirstName, LastName, Address, Mobile, Email, Eircode)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          sanitizedData.firstName,
          sanitizedData.lastName,
          sanitizedData.address,
          sanitizedData.mobile,
          sanitizedData.email,
          sanitizedData.eircode,
        ]
      );
      userId = result.insertId;
    }

    // Prevent duplicate appliances (same model + serial + owner)
    const [existing] = await connection.query(
      `SELECT ApplianceID FROM Appliance
       WHERE ModelNumber = ? AND SerialNumber = ? AND UserID = ?`,
      [sanitizedData.modelNumber, sanitizedData.serialNumber, userId]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, message: "Appliance already exists" },
        { status: 409 }
      );
    }

    // Insert the new appliance
    await connection.query(
      `INSERT INTO Appliance
        (ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyDate, CostOfAppliance, UserID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizedData.applianceType,
        sanitizedData.brand,
        sanitizedData.modelNumber,
        sanitizedData.serialNumber,
        purchaseDate,
        warrantyDate,
        Number(data.cost),
        userId,
      ]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "New appliance added successfully.",
    });

  } catch (error) {
    await connection.rollback();
    console.error("Server error:", error);

    return NextResponse.json(
      { success: false, message: "An internal server error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}




  




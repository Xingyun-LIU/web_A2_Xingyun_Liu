import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  const data = await req.json();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    {/* Input validation with detailed field-level errors */}
    const errors = {};

    const requiredFields = [
      "ApplianceType", "Brand", "ModelNumber",
      "FirstName", "LastName", "Email", "Mobile", "Address", "Eircode"
    ];
    for (const field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === "") {
        errors[field] = "This field is required.";
      }
    }
  {/* Additional format validations for specific fields */}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.Email && !emailRegex.test(data.Email)) {
      errors.Email = "Invalid email format.";
    }

    const eircodeRegex = /^D\d{2} [A-Z0-9]{4}$/;
    if (data.Eircode && !eircodeRegex.test(data.Eircode)) {
      errors.Eircode = "Invalid Eircode. Expected format: D## XXXX.";
    }

    const modelNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (data.ModelNumber && !modelNumberRegex.test(data.ModelNumber)) {
      errors.ModelNumber = "Invalid format. Expected: 000-000-0000.";
    }

    if (data.CostOfAppliance === "" || data.CostOfAppliance === null || data.CostOfAppliance === undefined) {
      errors.CostOfAppliance = "Cost is required.";
    } else if (Number.isNaN(Number(data.CostOfAppliance)) || Number(data.CostOfAppliance) < 0) {
      errors.CostOfAppliance = "Cost must be a valid positive number.";
    }

    {/* Validate dates and logical consistency between them */}
    let purchaseDate = null;
    let warrantyDate = null;

    if (!data.PurchaseDate || isNaN(Date.parse(data.PurchaseDate))) {
      errors.PurchaseDate = "Invalid purchase date.";
    } else {
      purchaseDate = new Date(data.PurchaseDate).toISOString().split("T")[0];
    }

    if (!data.WarrantyDate || isNaN(Date.parse(data.WarrantyDate))) {
      errors.WarrantyDate = "Invalid warranty date.";
    } else {
      warrantyDate = new Date(data.WarrantyDate).toISOString().split("T")[0];
    }

    if (purchaseDate && warrantyDate && warrantyDate < purchaseDate) {
      errors.WarrantyDate = "Warranty expiry date cannot be before the purchase date.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    {/* Check appliance exists */}
    const [appliances] = await connection.query(
      `SELECT ApplianceID, UserID FROM Appliance WHERE SerialNumber = ?`,
      [data.SerialNumber]
    );

    if (appliances.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, message: "Appliance not found." },
        { status: 404 }
      );
    }

    const { ApplianceID, UserID } = appliances[0];

   {/*  Update Appliance table */}
    await connection.query(
      `UPDATE Appliance SET
         ApplianceType    = ?,
         Brand            = ?,
         ModelNumber      = ?,
         PurchaseDate     = ?,
         WarrantyDate     = ?,
         CostOfAppliance  = ?
       WHERE ApplianceID = ?`,
      [
        data.ApplianceType,
        data.Brand,
        data.ModelNumber,
        purchaseDate,
        warrantyDate,
        Number(data.CostOfAppliance),
        ApplianceID,
      ]
    );

    {/* Update User table */}
    await connection.query(
      `UPDATE User SET
         FirstName = ?,
         LastName  = ?,
         Mobile    = ?,
         Address   = ?,
         Eircode   = ?
       WHERE UserID = ?`,
      [
        data.FirstName,
        data.LastName,
        data.Mobile,
        data.Address,
        data.Eircode,
        UserID,
      ]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Appliance has been updated.",
    });

  } catch (error) {
    await connection.rollback();
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

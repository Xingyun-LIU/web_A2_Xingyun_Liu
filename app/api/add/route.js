import { db } from '@/lib/db';

export async function POST(req) {
  const data = await req.json();

  try {
    const [users] = await db.query(
      "SELECT * FROM User WHERE Email=?",
      [data.email]
    );

    let userId;
{/*email validation */}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(data.email)) {
  return Response.json(
    { success: false, message: "Invalid email format" },
    { status: 400 }
  );
}
{/*cost must be number */}
if (data.cost === null || data.cost === undefined || String(data.cost).trim() === "") {
  return Response.json(
    { success: false, message: "Cost is required" },
    { status: 400 }
  );
}

const costNumber = Number(data.cost);

if (Number.isNaN(costNumber)) {
  return Response.json(
    { success: false, message: "Cost must be a valid number" },
    { status: 400 }
  );
}

{/*data regex */}
function isValidDate(dateStr) {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}
if (!isValidDate(data.purchaseDate)) {
  return Response.json(
    { success: false, message: "Invalid purchase date" },
    { status: 400 }
  );
}

if (!isValidDate(data.warrantyDate)) {
  return Response.json(
    { success: false, message: "Invalid warranty date" },
    { status: 400 }
  );
}
if (new Date(data.warrantyDate) < new Date(data.purchaseDate)) {
  return Response.json(
    { success: false, message: "Warranty date cannot be before purchase date" },
    { status: 400 }
  );
}
const purchaseDate = new Date(data.purchaseDate).toISOString().split("T")[0];
const warrantyDate = new Date(data.warrantyDate).toISOString().split("T")[0];



    if (users.length > 0) {
      userId = users[0].UserID;
    } else {
      const [result] = await db.query(
        `INSERT INTO User 
        (FirstName, LastName, Address, Mobile, Email, Eircode)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.firstName,
          data.lastName,
          data.address,
          data.mobile,
          data.email,
          data.eircode
        ]
      );
      userId = result.insertId;
    }

    await db.query(
      `INSERT INTO Appliance
      (ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpiration, Cost, UserID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.applianceType,
        data.brand,
        data.modelNumber,
        data.serialNumber,
        data.purchaseDate,
        data.warrantyDate,
        data.cost,
        userId
      ]
    );

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ success: false, message: err.message });
  }


}


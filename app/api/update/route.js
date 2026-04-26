import { db } from '@/lib/db';

export async function PUT(req) {
  const data = await req.json();
{/*connect with database */}
  await db.query(
    `UPDATE Appliance SET 
     Brand=?, 
     ModelNumber=?, 
     WarrantyExpiration=?, 
     Cost=?
     WHERE SerialNumber=?`,
    [
      data.brand,
      data.modelNumber,
      data.warrantyDate,
      data.cost,
      data.serialNumber
    ]
  );

  return Response.json({ success: true });
}

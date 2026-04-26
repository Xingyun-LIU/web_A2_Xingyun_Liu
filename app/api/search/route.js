import { db } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const serial = searchParams.get('query');

  const [rows] = await db.query(
    `SELECT * FROM Appliance 
     JOIN User ON Appliance.UserID = User.UserID
     WHERE 
      ApplianceType LIKE ?
      OR Brand LIKE ?
      OR ModelNumber LIKE ?
      OR SerialNumber LIKE ?
      OR ApplianceID LIKE ?
      OR FirstName LIKE ?
      OR LastName LIKE ?
      OR CostOfAppliance LIKE ?
    `,
    Array(8).fill(`%${query}%`)
  );

  if (rows.length === 0) {
    return Response.json({ success: false });
  }

  return Response.json({ success: true, data: rows[0] });
}

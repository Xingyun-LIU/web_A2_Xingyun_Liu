import { db } from '@/lib/db';

export async function DELETE(req) {
  const { serialNumber } = await req.json();

  await db.query(
    "DELETE FROM Appliance WHERE SerialNumber=?",
    [serialNumber]
  );

  return Response.json({ success: true });
}

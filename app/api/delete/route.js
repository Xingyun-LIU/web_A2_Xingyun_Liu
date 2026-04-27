import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const { serialNumber } = await req.json();

  {/* Validate input */}
  if (!serialNumber || serialNumber.trim() === '') {
    return NextResponse.json(
      { success: false, message: 'Serial number is required.' },
      { status: 400 }
    );
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

      {/* Check if appliance exists */}
    const [rows] = await connection.query(
      'SELECT ApplianceID FROM Appliance WHERE SerialNumber = ?',
      [serialNumber.trim()]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, message: 'No matching appliance found.' },
        { status: 404 }
      );
    }

      {/* Delete appliance */}
    await connection.query(
      'DELETE FROM Appliance WHERE SerialNumber = ?',
      [serialNumber.trim()]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: 'Appliance Deleted.',
    });
{/* Handle errors and rollback transaction if needed */}
  } catch (error) {
    await connection.rollback();
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

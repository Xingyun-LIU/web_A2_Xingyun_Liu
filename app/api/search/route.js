import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  {/* Validate input */}
  if (!query || query.trim() === '') {
    return NextResponse.json(
      { success: false, message: 'Search query is required.' },
      { status: 400 }
    );
  }
  {/* Perform search across multiple fields using SQL LIKE for partial matches */}
  try {
    const keyword = `%${query.trim()}%`;

    const [rows] = await db.query(
      `SELECT
         a.ApplianceID,
         a.ApplianceType,
         a.Brand,
         a.ModelNumber,
         a.SerialNumber,
         a.PurchaseDate,
         a.WarrantyDate,
         a.CostOfAppliance
       FROM Appliance a
       JOIN User u ON a.UserID = u.UserID
       WHERE
         a.ApplianceType     LIKE ? OR
         a.Brand             LIKE ? OR
         a.ModelNumber       LIKE ? OR
         a.SerialNumber      LIKE ? OR
         a.ApplianceID       LIKE ? OR
         u.FirstName         LIKE ? OR
         u.LastName          LIKE ? OR
         a.CostOfAppliance   LIKE ?`,
      Array(8).fill(keyword)
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No matching appliance found!' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows,          // return all matches, not just the first
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

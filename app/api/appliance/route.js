import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();{/*start */}

        {/*check whether have users */}
        const [users] = await connection.execute(
            'SELECT UserID FROM User WHERE Email = ?',
            [data.email]
        );

        let currentUserId;

        if (users.length > 0) {
            currentUserId = users[0].UserID;
        } else {
            {/*add new user */}
            const [userResult] = await connection.execute(
                'INSERT INTO User (FirstName, LastName, Address, Mobile, Email, Eircode) VALUES (?, ?, ?, ?, ?, ?)',
                [data.firstName, data.lastName, data.address, data.mobile, data.email, data.eircode]
            );
            currentUserId = userResult.insertId; // 获取新生成的 UserID
        }

        {/*add new inventory */}
        await connection.execute(
            `INSERT INTO Appliance 
            (ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpirationDate, CostOfAppliance, UserID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.applianceType, 
                data.brand, 
                data.model, 
                data.serialNumber, 
                data.purchaseDate || null, 
                data.warrantyDate || null, 
                data.cost || 0,
                currentUserId
            ]
        );

        await connection.commit(); 
        return NextResponse.json({ message: "数据关联保存成功！" });
{/*delete it if error */}
    } catch (error) {
        await connection.rollback(); 
        console.error(error);
        return NextResponse.json({ error: "保存失败" }, { status: 500 });
    } finally {
        connection.release(); 
    }
}
import { NextResponse } from "next/server";
import { db } from "../../../../../firebase/firebase-admin";

interface Params {
    params: { userId: string };
}

// Fetch all the echoes where the signed-in user has resonated
export async function GET(request: Request, { params }: Params) {
  try {
    const userId = params.userId;

    // Define the query
    const query = db
      .collection("echoes")
      .where("resonated_by", "array-contains", userId);

    // Execute the query
    const echoesSnapshot = await query.get();
    const echoes = echoesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(echoes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { db } from "../../../../../firebase/firebase-admin";

interface Params {
    params: { userId: string };
}

// Fetch all the echoes collected by the signed-in user
export async function GET(request: Request, { params }: Params) {
  try {
    const userId = params.userId;

    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    // Define the query
    let query = db.collection("echoes").where("visibility", "==", 1);
    query = query.where("collected_by", "array-contains", userId);
    if (category && category !== "All") {
      query = query.where("category", "==", category);
    }

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
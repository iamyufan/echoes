import { NextResponse } from "next/server";
import { admin, db } from "../../../firebase/firebase-admin";

// Fetch all public echoes
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    // Define the query
    let query = db.collection("echoes").where("visibility", "==", 1);
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

// Create a new echo
export async function POST(request: Request) {
  try {
    const { anonymized_author, author_UID, title, content, category, visibility } = await request.json();

    if (!anonymized_author || !title || !content || !category)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const newEcho = {
      anonymized_author,
      author_UID,
      title,
      content,
      post_date: admin.firestore.Timestamp.now(),
      category,
      visibility,
      collected_by: [],
      resonated_by: [],
      resonances: [],
    };

    const echoRef = await db.collection("echoes").add(newEcho);
    return NextResponse.json({ id: echoRef.id, ...newEcho }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

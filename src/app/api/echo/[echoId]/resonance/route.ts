// app/api/echoes/[echoId]/resonance/route.ts
import { NextResponse } from "next/server";
import { admin, db } from "../../../../../firebase/firebase-admin";

interface EchoResonanceParams {
  params: { echoId: string };
}

// Fetch all resonances for a given echo
export async function GET(request: Request, { params }: EchoResonanceParams) {
  const echoId = params.echoId;

  try {
    const resonanceSnapshot = await db
      .collection("echoes")
      .doc(echoId)
      .collection("resonances")
      .get();

    const resonances = resonanceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(resonances, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add a new resonance
export async function POST(request: Request, { params }: EchoResonanceParams) {
  const echoId = params.echoId;

  try {
    const { anonymized_author, author_UID, content } = await request.json();
    if (!anonymized_author || !content)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const newResonance = {
      anonymized_author,
      author_UID,
      content,
      post_date: admin.firestore.Timestamp.now(),
    };

    const resonanceRef = await db
      .collection("echoes")
      .doc(echoId)
      .collection("resonances")
      .add(newResonance);

    // Add the author_UID to the resonated_by array in the echo document
    const echoRef = db.collection("echoes").doc(echoId);
    await echoRef.update({
      resonated_by: admin.firestore.FieldValue.arrayUnion(author_UID),
    });

    return NextResponse.json({ id: resonanceRef.id, ...newResonance }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

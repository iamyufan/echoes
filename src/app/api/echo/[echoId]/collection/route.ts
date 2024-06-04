// app/api/echoes/[echoId]/resonance/route.ts
import { NextResponse } from "next/server";
import { admin, db } from "../../../../../firebase/firebase-admin";

interface collectionParams {
  params: { echoId: string };
}

// Return true if the echo is collected by the signed-in user or not
export async function GET(request: Request, { params }: collectionParams) {
  const echoId = params.echoId;


  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("uid");
    if (!userId) return NextResponse.json({ error: "User UID not provided" }, { status: 400 });

    const echoRef = db.collection("echoes").doc(echoId);
    
    // Check if uid is in the collected_by array
    const echoDoc = await echoRef.get();

    if (!echoDoc.exists) {
      return NextResponse.json({ error: "Echo not found" }, { status: 404 });
    }

    const echoData: any = echoDoc.data();
    const collectedBy = echoData.collected_by || [];

    const isCollected = collectedBy.includes(userId);

    return NextResponse.json({ isCollected }, { status: 200 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Switch the collection status of the echo for the signed-in user
// i.e. Add or remove the user UID from the collected_by array
export async function PUT(request: Request, { params }: collectionParams) {
  const echoId = params.echoId;

  try {
    const body = await request.json();
    const userId = body.uid;

    if (!userId) return NextResponse.json({ error: "User UID not provided" }, { status: 400 });

    const echoRef = db.collection("echoes").doc(echoId);
    const echoDoc = await echoRef.get();

    if (!echoDoc.exists) {
      return NextResponse.json({ error: "Echo not found" }, { status: 404 });
    }

    const echoData: any = echoDoc.data();
    const collectedBy = echoData.collected_by || [];
    const userIndex = collectedBy.indexOf(userId);

    if (userIndex === -1) {
      // Add user UID to collected_by array
      collectedBy.push(userId);
    } else {
      // Remove user UID from collected_by array
      collectedBy.splice(userIndex, 1);
    }

    // Update the document
    await echoRef.update({ collected_by: collectedBy });
    return NextResponse.json({ success: "Collection status updated", collectedBy }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

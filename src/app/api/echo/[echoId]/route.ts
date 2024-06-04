// app/api/echoes/[echoId]/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../../firebase/firebase-admin";

interface EchoParams {
  params: { echoId: string };
}

// Fetch an individual echo
export async function GET(request: Request, { params }: EchoParams) {
  const echoId = params.echoId;

  try {
    const echoDoc = await db.collection("echoes").doc(echoId).get();
    if (!echoDoc.exists) return NextResponse.json({ error: "Echo not found" }, { status: 404 });

    const echoData: any = echoDoc.data();
    
    return NextResponse.json(echoData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete an echo
export async function DELETE(request: Request, { params }: EchoParams) {
  const echoId = params.echoId;

  try {
    const echoDoc = await db.collection("echoes").doc(echoId).get();
    if (!echoDoc.exists) return NextResponse.json({ error: "Echo not found" }, { status: 404 });

    await db.collection("echoes").doc(echoId).delete();
    return NextResponse.json({ success: "Echo deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update an echo
export async function PUT(request: Request, { params }: EchoParams) {
  const echoId = params.echoId;
  
  try {
    const echoDoc = await db.collection("echoes").doc(echoId).get();
    if (!echoDoc.exists) return NextResponse.json({ error: "Echo not found" }, { status: 404 });

    const updatedData = await request.json();
    await db.collection("echoes").doc(echoId).update(updatedData);

    return NextResponse.json({ success: "Echo updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

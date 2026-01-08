import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();
  const { title, content } = await req.json();
  const updatedNote = await Note.findByIdAndUpdate(
    params.id,
    { title, content },
    { new: true }
  );
  return NextResponse.json(updatedNote);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Note.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

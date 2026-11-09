import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";

// UPDATE: Student edit
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const student = await Student.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!student) return NextResponse.json({ error: "Student পাওয়া যায়নি" }, { status: 404 });
    return NextResponse.json(student);
  } catch (e) {
    const duplicate = e.code === 11000;
    return NextResponse.json(
      { error: duplicate ? "এই Email আগে থেকেই আছে" : e.message },
      { status: duplicate ? 409 : 400 }
    );
  }
}

// DELETE: Student delete
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const student = await Student.findByIdAndDelete(id);
    if (!student) return NextResponse.json({ error: "Student পাওয়া যায়নি" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

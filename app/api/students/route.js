import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Student from "@/models/Student";

// READ: সব Student
export async function GET() {
  try {
    await connectDB();
    const students = await Student.find().sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// CREATE: নতুন Student
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const student = await Student.create(body);
    return NextResponse.json(student, { status: 201 });
  } catch (e) {
    const duplicate = e.code === 11000;
    return NextResponse.json(
      { error: duplicate ? "এই Email আগে থেকেই আছে" : e.message },
      { status: duplicate ? 409 : 400 }
    );
  }
}

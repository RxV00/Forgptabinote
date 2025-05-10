// src/app/api/grade-tracker/route.ts
import { NextResponse } from "next/server";
import * as z from "zod";
import { DiplomaType } from "@prisma/client"; // Import DiplomaType enum directly

import { prisma } from "@/lib/prisma"; // Updated path to prisma client
import { getCurrentUser } from "@/lib/auth"; // Import the getCurrentUser function from auth.ts

const programSchema = z.object({
  name: z.string().min(1, "Program name is required (e.g., Abitur 2025)"),
  diplomaType: z.nativeEnum(DiplomaType), // Use DiplomaType directly
});

// GET User's GradeTracker and its Programs
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    let gradeTracker = await prisma.gradeTracker.findUnique({
      where: { userId: user.id },
      include: {
        programs: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!gradeTracker) {
      // Optionally create one if it doesn't exist
      gradeTracker = await prisma.gradeTracker.create({
        data: {
          userId: user.id,
        },
        include: {
          programs: true,
        },
      });
    }
    return NextResponse.json(gradeTracker, { status: 200 });
  } catch (error) {
    console.error("Error fetching grade tracker:", error);
    return NextResponse.json({ message: "Error fetching grade tracker" }, { status: 500 });
  }
}

// POST to create a new Program (e.g., an Abitur program)
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = programSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ errors: validationResult.error.issues }, { status: 400 });
    }

    const { name, diplomaType } = validationResult.data;

    // Ensure GradeTracker exists for the user
    let tracker = await prisma.gradeTracker.findUnique({
      where: { userId: user.id },
    });
    if (!tracker) {
      tracker = await prisma.gradeTracker.create({
        data: { userId: user.id },
      });
    }

    const newProgram = await prisma.program.create({
      data: {
        name,
        diplomaType,
        trackerId: tracker.id,
      },
    });
    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json({ message: "Error creating program" }, { status: 500 });
  }
}
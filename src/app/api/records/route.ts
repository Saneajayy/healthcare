import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");

    const records = await prisma.record.findMany({
      where: {
        userId: session.user.id,
        ...(category ? { category } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { doctor: { contains: query } },
              ],
            }
          : {}),
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error("Fetch records error:", error);
    return NextResponse.json(
      { error: "Error fetching records" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, fileUrl, date, doctor, notes, summary } = body;

    if (!title || !category || !fileUrl || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const record = await prisma.record.create({
      data: {
        title,
        category,
        fileUrl,
        date: new Date(date),
        doctor,
        notes,
        summary,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error("Create record error:", error);
    return NextResponse.json(
      { error: "Error creating record" },
      { status: 500 }
    );
  }
}

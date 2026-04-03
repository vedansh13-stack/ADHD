import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { subtasks: { orderBy: { id: "asc" } } },
    });

    if (!task || task.user_id !== session.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(task.subtasks);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { subtask_name } = await req.json();

    if (!subtask_name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task || task.user_id !== session.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const subtask = await prisma.subtask.create({
      data: {
        task_id: Number(id),
        subtask_name,
      },
    });

    // Automatically mark the parent task as Pending if we add a new subtask while it was Completed
    if (task.status === "Completed") {
        await prisma.task.update({
            where: { id: task.id },
            data: { status: "Pending" }
        });
    }

    return NextResponse.json(subtask);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

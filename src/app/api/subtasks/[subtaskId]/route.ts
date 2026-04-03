import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isYesterday(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function isToday(date: Date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export async function PUT(req: Request, { params }: { params: Promise<{ subtaskId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { subtaskId } = await params;
    const { status } = await req.json();

    const subtask = await prisma.subtask.findUnique({
      where: { id: Number(subtaskId) },
      include: { task: true },
    });

    if (!subtask || subtask.task.user_id !== session.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update subtask
    const updatedSubtask = await prisma.subtask.update({
      where: { id: Number(subtaskId) },
      data: { status },
    });

    // Auto Task Completion Logic
    const allSubtasks = await prisma.subtask.findMany({
      where: { task_id: subtask.task_id },
    });

    const allCompleted = allSubtasks.every((s) => s.status === "Completed");
    
    let taskStatusChanged = false;
    let newStreak = 0;
    let streakUpdated = false;

    if (allCompleted && subtask.task.status !== "Completed") {
      // Mark parent task as completed explicitly
      const completed_at = new Date();
      await prisma.task.update({
        where: { id: subtask.task_id },
        data: { status: "Completed", completed_at },
      });
      taskStatusChanged = true;

      // Duplicate streak logic for robust tracking
      const user = await prisma.user.findUnique({ where: { id: session.userId } });
      if (user) {
        newStreak = user.streak;
        if (!user.last_active_date) {
            newStreak = 1;
            streakUpdated = true;
        } else {
            if (isYesterday(user.last_active_date)) {
                newStreak += 1;
                streakUpdated = true;
            } else if (!isToday(user.last_active_date)) {
                newStreak = 1;
                streakUpdated = true;
            }
        }
        if (streakUpdated) {
            await prisma.user.update({
                where: { id: session.userId },
                data: { streak: newStreak, last_active_date: new Date() }
            });
        }
      }
    } else if (!allCompleted && subtask.task.status === "Completed") {
      // If a subtask is unchecked, revert parent task to pending (do not revert streaks to prevent complexity)
      await prisma.task.update({
        where: { id: subtask.task_id },
        data: { status: "Pending", completed_at: null },
      });
      taskStatusChanged = true;
    }

    return NextResponse.json({ 
        subtask: updatedSubtask, 
        taskStatusChanged, 
        allCompleted, 
        streakUpdated, 
        newStreak 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

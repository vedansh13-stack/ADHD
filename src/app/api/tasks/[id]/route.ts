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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task || task.user_id !== session.userId) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    let completed_at = task.completed_at;
    let streakUpdated = false;
    let newStreak = 0;

    if (status === "Completed" && task.status !== "Completed") {
      const subtasks = await prisma.subtask.findMany({
        where: { task_id: task.id },
      });

      if (subtasks.length > 0) {
        const completed_subtasks = subtasks.filter((s: any) => s.status === "Completed").length;
        if (completed_subtasks !== subtasks.length) {
          return NextResponse.json(
            { error: "⚠️ Please complete all steps before finishing the task." },
            { status: 400 }
          );
        }
      }

      completed_at = new Date();

      // Implement streak logic
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });

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
                newStreak = 1; // missed a day, reset.
                streakUpdated = true;
            }
        }

        if (streakUpdated) {
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    streak: newStreak,
                    last_active_date: new Date()
                }
            });
        } else {
          // just update last_active_date to today if it wasn't
          if (!user.last_active_date || !isToday(user.last_active_date)) {
            await prisma.user.update({
              where: { id: session.userId },
              data: { last_active_date: new Date() }
            });
          }
          newStreak = user.streak;
        }
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        status,
        completed_at,
      },
    });

    return NextResponse.json({ task: updatedTask, streak: newStreak, streakUpdated });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

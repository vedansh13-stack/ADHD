import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });

    if (!task || task.user_id !== session.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Existing subtasks check - if exists, don't overwrite, just optionally append
    // But for AI split, let's just generate the 4-6 steps.

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mocked AI output based on task.task_name
    let generatedSteps: string[] = [];
    const taskNameLower = task.task_name.toLowerCase();

    if (taskNameLower.includes("study") || taskNameLower.includes("read")) {
      generatedSteps = [
        "Open notes or textbook",
        "Read one small section",
        "Highlight key concepts",
        "Take a 5-minute break",
        "Summarize what you read"
      ];
    } else if (taskNameLower.includes("gym") || taskNameLower.includes("workout")) {
      generatedSteps = [
        "Pack gym bag",
        "Fill water bottle",
        "Drive to gym",
        "Warm up for 5 mins",
        "Complete workout routine"
      ];
    } else if (taskNameLower.includes("clean") || taskNameLower.includes("wash")) {
      generatedSteps = [
        "Gather cleaning supplies",
        "Clear surface clutter",
        "Wipe down surfaces",
        "Sweep or vacuum",
        "Put away supplies"
      ];
    } else {
      // Generic breakdown
      generatedSteps = [
        "Gather everything needed to start",
        "Complete the easiest 10% first",
        "Work for exactly 15 minutes",
        "Take a short break",
        "Finish the final steps"
      ];
    }

    // Save outputs to db
    const createdSubtasks = await Promise.all(
      generatedSteps.map((stepName) =>
        prisma.subtask.create({
          data: {
            task_id: Number(id),
            subtask_name: stepName,
          },
        })
      )
    );

    // Revert parent task to pending if it was completed because we just added pending subtasks
    if (task.status === "Completed") {
        await prisma.task.update({ where: { id: task.id }, data: { status: "Pending" } });
    }

    return NextResponse.json({ subtasks: createdSubtasks });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

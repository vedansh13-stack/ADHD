import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import TaskDetailClient from "./TaskDetailClient";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  
  const task = await prisma.task.findUnique({
    where: { id: Number(id) }
  });

  if (!task || task.user_id !== session.userId) redirect("/");

  return <TaskDetailClient task={task} />;
}

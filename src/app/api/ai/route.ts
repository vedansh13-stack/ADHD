import { NextResponse } from "next/server";

const adhdTips = [
  "Break tasks into smaller steps",
  "Use the 25-minute Pomodoro technique",
  "Start with the easiest task",
  "Avoid phone distractions",
  "Take short breaks between tasks"
];

export async function GET() {
  // Simulate network delay for AI generation feel
  await new Promise(resolve => setTimeout(resolve, 800));

  const randomTip = adhdTips[Math.floor(Math.random() * adhdTips.length)];
  return NextResponse.json({ suggestion: randomTip });
}

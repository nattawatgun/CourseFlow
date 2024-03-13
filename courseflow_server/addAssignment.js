import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function insertAssignments() {
  const assignments = [
    { title: "What is your name?", duration: 1, sublessonId: 2 },
    { title: "Where are you from?", sublessonId: 3 }
  ];

  // Your code below the cursor
  await prisma.assignment.createMany({ data: assignments })
}

await insertAssignments();
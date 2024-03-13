import { prisma } from "../app.js";

async function getAssignment(req, res) {
  const keywords = req.query.keywords;
  const query = {};

  if (keywords) {
    query.title = { contains: keywords.toLowerCase(), mode: 'insensitive' };
  }

  try {
    const assignments = await prisma.assignment.findMany({
      where: query,
      include: {
        sublesson: {
          include: {
            lesson: {
              include: { course: true }
            }
          }
        }
      }
    });

    return res.json(assignments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAssignmentById(req, res) {
  const assignmentId = Number(req.params.assignmentId);

  try {
    const assignmentById = await prisma.assignment.findUnique({
      where: {
        id: assignmentId
      },
      include: {
        sublesson: {
          include: {
            lesson: {
              include: { course: true }
            }
          }
        }
      }
    });

    return res.json(assignmentById);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function postAssignment(req, res) {
  try {
    const { assignment, duration, subLessonId } = req.body;
    const createAssignment = await prisma.assignment.create({
      data: {
        title: assignment,
        duration: Number(duration),
        sublesson: {
          connect: {
            id: Number(subLessonId)
          }
        },
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Assignment created successfully",
      data: createAssignment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function editAssignment(req, res) {
  const assignmentId = Number(req.params.assignmentId);
  const { assignment, duration, subLessonId } = req.body;
  try {
    const editAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title: assignment,
        duration: Number(duration),
        sublesson: {
          connect: {
            id: Number(subLessonId)
          }
        },
      },
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

async function deleteAssignment(req, res) {
  const assignmentId = Number(req.params.assignmentId);
  try {
    const deleteAssignment = await prisma.assignment.delete({
      where: { id: assignmentId }
    });

    return res.json(deleteAssignment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }

}

export { getAssignment, getAssignmentById, postAssignment, editAssignment, deleteAssignment };
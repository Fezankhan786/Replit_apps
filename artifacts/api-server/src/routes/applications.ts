import { Router } from "express";
import { db, applicationsTable, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import {
  ListApplicationsQueryParams,
  SubmitApplicationBody,
  UpdateApplicationStatusBody,
  UpdateApplicationStatusParams,
  GetApplicationParams,
} from "@workspace/api-zod";

const router = Router();

function formatApp(app: typeof applicationsTable.$inferSelect, courseName?: string | null) {
  return {
    ...app,
    courseName: courseName ?? null,
    createdAt: app.createdAt.toISOString(),
  };
}

router.get("/applications", async (req, res) => {
  try {
    const query = ListApplicationsQueryParams.safeParse(req.query);
    const { status, courseId } = query.success ? query.data : {};

    let apps = await db.select().from(applicationsTable).orderBy(applicationsTable.createdAt);

    if (status) {
      apps = apps.filter(a => a.status === status);
    }
    if (courseId) {
      apps = apps.filter(a => a.courseId === courseId);
    }

    const courses = await db.select().from(coursesTable);
    const courseMap = new Map(courses.map(c => [c.id, c.name]));

    res.json(apps.map(a => formatApp(a, courseMap.get(a.courseId))));
  } catch (err) {
    req.log.error({ err }, "Failed to list applications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/applications", async (req, res) => {
  try {
    const body = SubmitApplicationBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { userId } = getAuth(req);

    const [app] = await db.insert(applicationsTable)
      .values({ ...body.data, userId: userId ?? null, status: "pending" })
      .returning();

    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, app.courseId));

    res.status(201).json(formatApp(app, course?.name));
  } catch (err) {
    req.log.error({ err }, "Failed to submit application");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/applications/my", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const apps = await db.select().from(applicationsTable)
      .where(eq(applicationsTable.userId, userId))
      .orderBy(applicationsTable.createdAt);

    const courses = await db.select().from(coursesTable);
    const courseMap = new Map(courses.map(c => [c.id, c.name]));

    res.json(apps.map(a => formatApp(a, courseMap.get(a.courseId))));
  } catch (err) {
    req.log.error({ err }, "Failed to get my applications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/applications/:id", async (req, res) => {
  try {
    const params = GetApplicationParams.safeParse({ id: parseInt(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [app] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, params.data.id));
    if (!app) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, app.courseId));
    res.json(formatApp(app, course?.name));
  } catch (err) {
    req.log.error({ err }, "Failed to get application");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/applications/:id/status", async (req, res) => {
  try {
    const params = UpdateApplicationStatusParams.safeParse({ id: parseInt(req.params.id) });
    const body = UpdateApplicationStatusBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const [updated] = await db.update(applicationsTable)
      .set({ status: body.data.status, notes: body.data.notes ?? null })
      .where(eq(applicationsTable.id, params.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, updated.courseId));
    res.json(formatApp(updated, course?.name));
  } catch (err) {
    req.log.error({ err }, "Failed to update application status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

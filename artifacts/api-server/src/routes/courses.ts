import { Router } from "express";
import { db, coursesTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import {
  ListCoursesQueryParams,
  CreateCourseBody,
  UpdateCourseBody,
  UpdateCourseParams,
  DeleteCourseParams,
  GetCourseParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/courses", async (req, res) => {
  try {
    const query = ListCoursesQueryParams.safeParse(req.query);
    const { category, search } = query.success ? query.data : {};

    let courses = await db.select().from(coursesTable).orderBy(coursesTable.createdAt);

    if (category) {
      courses = courses.filter(c => c.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      courses = courses.filter(c =>
        c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
      );
    }

    const formatted = courses.map(c => ({
      ...c,
      fees: parseFloat(c.fees as unknown as string),
      createdAt: c.createdAt.toISOString(),
    }));

    res.json(formatted);
  } catch (err) {
    req.log.error({ err }, "Failed to list courses");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const body = CreateCourseBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [course] = await db.insert(coursesTable).values({ ...body.data, fees: String(body.data.fees) }).returning();
    res.status(201).json({ ...course, fees: parseFloat(course.fees as unknown as string), createdAt: course.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create course");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/courses/:id", async (req, res) => {
  try {
    const params = GetCourseParams.safeParse({ id: parseInt(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, params.data.id));
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    res.json({ ...course, fees: parseFloat(course.fees as unknown as string), createdAt: course.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get course");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/courses/:id", async (req, res) => {
  try {
    const params = UpdateCourseParams.safeParse({ id: parseInt(req.params.id) });
    const body = UpdateCourseBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const { fees: feesRaw, ...restUpdate } = body.data;
    const updateData: typeof restUpdate & { fees?: string } = {
      ...restUpdate,
      ...(feesRaw !== undefined ? { fees: String(feesRaw) } : {}),
    };
    const [updated] = await db.update(coursesTable)
      .set(updateData)
      .where(eq(coursesTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    res.json({ ...updated, fees: parseFloat(updated.fees as unknown as string), createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update course");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const params = DeleteCourseParams.safeParse({ id: parseInt(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(coursesTable).where(eq(coursesTable.id, params.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete course");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

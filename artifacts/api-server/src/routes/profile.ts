import { Router } from "express";
import { db, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { UpdateProfileBody } from "@workspace/api-zod";

const router = Router();

router.get("/profile", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json({ ...profile, createdAt: profile.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/profile", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const body = UpdateProfileBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    let [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    const [updated] = await db.update(profilesTable)
      .set(body.data)
      .where(eq(profilesTable.userId, userId))
      .returning();

    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

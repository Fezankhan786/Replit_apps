import { Router } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const body = SubmitContactBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const [contact] = await db.insert(contactsTable).values(body.data).returning();
    res.status(201).json({ ...contact, createdAt: contact.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to submit contact");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router } from "express";
import { db, applicationsTable, coursesTable, profilesTable } from "@workspace/db";

const router = Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const [applications, courses, profiles] = await Promise.all([
      db.select().from(applicationsTable),
      db.select().from(coursesTable),
      db.select().from(profilesTable),
    ]);

    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === "pending").length,
      acceptedApplications: applications.filter(a => a.status === "accepted").length,
      rejectedApplications: applications.filter(a => a.status === "rejected").length,
      totalCourses: courses.length,
      totalStudents: profiles.length,
    };

    res.json(stats);
  } catch (err) {
    req.log.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/reports", async (req, res) => {
  try {
    const [applications, courses] = await Promise.all([
      db.select().from(applicationsTable),
      db.select().from(coursesTable),
    ]);

    const reports = courses.map(course => {
      const courseApps = applications.filter(a => a.courseId === course.id);
      return {
        courseId: course.id,
        courseName: course.name,
        totalApplications: courseApps.length,
        accepted: courseApps.filter(a => a.status === "accepted").length,
        rejected: courseApps.filter(a => a.status === "rejected").length,
        pending: courseApps.filter(a => a.status === "pending").length,
      };
    });

    res.json(reports);
  } catch (err) {
    req.log.error({ err }, "Failed to get admin reports");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

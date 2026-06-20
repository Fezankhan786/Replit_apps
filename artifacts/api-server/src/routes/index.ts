import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import applicationsRouter from "./applications";
import adminRouter from "./admin";
import contactRouter from "./contact";
import profileRouter from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(applicationsRouter);
router.use(adminRouter);
router.use(contactRouter);
router.use(profileRouter);

export default router;

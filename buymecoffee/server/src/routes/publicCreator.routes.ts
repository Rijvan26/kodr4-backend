import { Router } from "express";
import { getPublicCreator } from "../controller/creator.controller.js";

const router = Router();

router.get("/:username", getPublicCreator);

export default router;
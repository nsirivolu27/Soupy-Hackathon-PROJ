import { Router } from "express";
import { z } from "zod";
import { prisma } from "./db.js";
import { generateSupportiveReply } from "./services/aiService.js";
import { getResourcesByCategories, getResourcesForNeeds } from "./services/resourceService.js";
import { crisisReply, detectCrisis } from "./utils/crisisDetection.js";
import { classifyNeeds } from "./utils/needClassifier.js";
import type { NeedCategory } from "@soupy/shared";

export const router = Router();

const chatRequestSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().trim().min(1).max(2000)
});

router.post("/chat", async (req, res, next) => {
  try {
    const { sessionId, message } = chatRequestSchema.parse(req.body);
    const session = sessionId
      ? await prisma.session.upsert({
          where: { id: sessionId },
          create: { id: sessionId },
          update: {}
        })
      : await prisma.session.create({ data: {} });

    await prisma.message.create({
      data: { sessionId: session.id, role: "user", content: message }
    });

    const crisis = detectCrisis(message);
    const detectedNeeds = classifyNeeds(message, crisis.isCrisis);
    const previousNeeds = JSON.parse(session.needsJson || "[]") as NeedCategory[];
    const needs = Array.from(new Set([...previousNeeds, ...detectedNeeds]));

    if (crisis.isCrisis) {
      const reply = crisisReply(crisis.reasons);
      await prisma.session.update({
        where: { id: session.id },
        data: { isCrisis: true, needsJson: JSON.stringify(needs) }
      });
      await prisma.message.create({
        data: { sessionId: session.id, role: "assistant", content: reply }
      });

      res.json({ sessionId: session.id, reply, needs, resources: [], crisis });
      return;
    }

    const resources = await getResourcesForNeeds(needs);
    const reply = await generateSupportiveReply({ message, needs, resources });

    await prisma.session.update({
      where: { id: session.id },
      data: { needsJson: JSON.stringify(needs), isCrisis: false }
    });
    await prisma.message.create({
      data: { sessionId: session.id, role: "assistant", content: reply }
    });

    res.json({ sessionId: session.id, reply, needs, resources, crisis });
  } catch (error) {
    next(error);
  }
});

router.get("/resources", async (req, res, next) => {
  try {
    const categories = String(req.query.categories || "")
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean) as NeedCategory[];

    const resources = await getResourcesByCategories(categories);
    res.json({ resources });
  } catch (error) {
    next(error);
  }
});

router.post("/sessions/reset", async (_req, res, next) => {
  try {
    const session = await prisma.session.create({ data: {} });
    res.json({ sessionId: session.id });
  } catch (error) {
    next(error);
  }
});

router.delete("/sessions/:id", async (req, res, next) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } }).catch(() => null);
    const session = await prisma.session.create({ data: {} });
    res.json({ sessionId: session.id });
  } catch (error) {
    next(error);
  }
});

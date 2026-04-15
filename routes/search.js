import express from "express";
import { fetchPubMed } from "../services/pubmed.js";
import { fetchOpenAlex } from "../services/openalex.js";
import { fetchTrials } from "../services/trials.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { disease, query } = req.body;

    const finalQuery = `${query} AND ${disease}`;

    const pubmed = await fetchPubMed(finalQuery);
    const openalex = await fetchOpenAlex(finalQuery);
    const trials = await fetchTrials(disease);

    res.json({
      pubmed,
      openalex,
      trials
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
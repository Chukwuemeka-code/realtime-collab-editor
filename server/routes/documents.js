const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Every route below needs a valid token
router.use(requireAuth);

// CREATE a document (the creator becomes the owner)
router.post("/", async (req, res) => {
  try {
    const { title, type, language } = req.body;

    if (!title || !["code", "whiteboard"].includes(type)) {
      return res.status(400).json({ message: "Title and a valid type are required" });
    }

    const doc = await pool.query(
      "INSERT INTO documents (title, type, language, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, type, language || "javascript", req.userId]
    );

    // Record the creator as owner
    await pool.query(
      "INSERT INTO document_members (document_id, user_id, role) VALUES ($1, $2, 'owner')",
      [doc.rows[0].id, req.userId]
    );

    res.status(201).json({ document: doc.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LIST every document I own or that was shared with me
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.id, d.title, d.type, d.language, d.updated_at, m.role
       FROM documents d
       JOIN document_members m ON m.document_id = d.id
       WHERE m.user_id = $1
       ORDER BY d.updated_at DESC`,
      [req.userId]
    );
    res.json({ documents: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// RENAME a document (owner only)
router.patch("/:id", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const result = await pool.query(
      "UPDATE documents SET title = $1, updated_at = NOW() WHERE id = $2 AND owner_id = $3 RETURNING *",
      [title, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Only the owner can rename" });
    }
    res.json({ document: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a document (owner only)
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM documents WHERE id = $1 AND owner_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Only the owner can delete" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


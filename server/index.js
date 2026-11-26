require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const pool = require("./db");
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Socket.IO needs a plain HTTP server underneath Express
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Check the token before allowing a live connection
io.use((socket, next) => {
  try {
    const payload = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {
    next(new Error("Not logged in"));
  }
});

io.on("connection", (socket) => {
  // A user opens a document: check access, then join its room
  socket.on("join-document", async (documentId, callback) => {
    try {
      const result = await pool.query(
        `SELECT m.role, d.content
         FROM document_members m
         JOIN documents d ON d.id = m.document_id
         WHERE m.document_id = $1 AND m.user_id = $2`,
        [documentId, socket.userId]
      );

      if (result.rows.length === 0) {
        return callback({ error: "No access" });
      }

      socket.documentId = documentId;
      socket.role = result.rows[0].role;
      socket.join(`doc:${documentId}`);
      callback({ content: result.rows[0].content || "", role: socket.role });
    } catch (err) {
      console.error(err);
      callback({ error: "Server error" });
    }
  });

  // A user types: viewers are blocked here, on the server
  socket.on("edit", async (content) => {
    if (!socket.documentId || socket.role === "viewer") return;

    // Send to everyone else in the same room
    socket.to(`doc:${socket.documentId}`).emit("edit", content);

    // Save so the text is still there after a refresh
    await pool.query(
      "UPDATE documents SET content = $1, updated_at = NOW() WHERE id = $2",
      [content, socket.documentId]
    );
  });
});

// Add the column that stores the document text (safe to run every time)
pool
  .query("ALTER TABLE documents ADD COLUMN IF NOT EXISTS content TEXT DEFAULT ''")
  .then(() => {
    server.listen(5000, () => {
      console.log("Server started on http://localhost:5000");
    });
  });

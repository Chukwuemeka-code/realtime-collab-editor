import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("code");

  async function loadDocuments() {
    const res = await api.get("/documents");
    setDocuments(res.data.documents);
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function createDocument(e) {
    e.preventDefault();
    if (!title) return;
    await api.post("/documents", { title, type });
    setTitle("");
    loadDocuments();
  }

  async function deleteDocument(id) {
    await api.delete(`/documents/${id}`);
    loadDocuments();
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {user.name}</h2>
        <button onClick={logout}>Log out</button>
      </div>

      <form onSubmit={createDocument} style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="code">Code</option>
          <option value="whiteboard">Whiteboard</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <h3>My documents</h3>
      {documents.length === 0 && <p>No documents yet.</p>}
      <ul>
        {documents.map((d) => (
          <li key={d.id} style={{ marginBottom: 8 }}>
            <Link to={`/doc/${d.id}`}>{d.title}</Link> ({d.type}) - {d.role}{" "}
            {d.role === "owner" && (
              <button onClick={() => deleteDocument(d.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

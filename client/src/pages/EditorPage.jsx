import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io} from "socket.io-client";

export default function EditorPage() {
    const { id } = useParams();
    const [ content, setContent] = useState("");
    const [ role, setRole] = useState("");
    const [ error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);

    useEffect(() => {

        const socket = io("http://localhost:5000", {
            auth: { token: localStorage.getItem("token") },
        });
        socketRef.current = socket;

        socket.on("connect_error", () => setError("Could not connect"));
        setLoading(false);

        socket.emit("join-document", id, (res) => {
            if (res.error) setError(res.error);
            else {
                setContent(res.content);
                setRole(res.role);
            }
            setLoading(false);
        });

        socket.on("edit", (text) => setContent(text));

        return () => socket.disconnect();
    }, [id]);

    function handleChange(e) {
        setContent(e.target.value);
        socketRef.current.emit("edit", e.target.value);
    }
    if (loading) return <p style={{ padding: 40}}>Loading document</p>
    if (error) return <p style={{ padding: 40 }}>{error}</p>;

    return (
        <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "sans-serif" }}>
            <Link to="/">Back to dashboard</Link>
            <h3>Document {id} ({role})</h3>
            <textarea
               value={content}
               onChange={handleChange}
               readOnly={role === "viewer"}
               style={{ width: "100%", height: 400, fontFamily: "monospace", fontSize: 16}}/>
        </div>
    );
}
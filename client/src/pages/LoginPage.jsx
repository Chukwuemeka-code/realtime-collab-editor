import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function LoginPage() {
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName ] = useState("");
    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            if (isRegister) {
                await register(name, email, password);
            }
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif"}}>
            <h2>{isRegister ? "Create account" : "log in"}</h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12}}>
                {isRegister && (
                    <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    />
                )}
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{isRegister ? "Register" : "Log in"}</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>
                {isRegister ? "Already have an account? " : "No account yet? "}
                <button onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "Log in" : "Register"}
                </button>
            </p>
        </div>
    );
}

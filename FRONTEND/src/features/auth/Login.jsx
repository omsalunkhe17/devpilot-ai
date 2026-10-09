
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setUser } from "./authSlice.js";
import api from "../../services/api.js";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await api.post("/auth/login", {
                email,
                password,
            });

            const userResponse = await api.get("/auth/get-me");

            dispatch(setUser(userResponse.data.user));
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        DevPilot <span className="text-violet-400">AI</span>
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        Your AI-powered developer workspace
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 shadow-xl">
                    <h2 className="text-2xl font-semibold">Welcome back</h2>
                    <p className="text-sm text-zinc-400 mt-2 mb-6">
                        Log in to continue to your workspaces.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm text-zinc-300 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm text-zinc-300 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 transition"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-400 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-violet-400 hover:text-violet-300 font-medium"
                        >
                            Create account
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-zinc-600 mt-6">
                    Built for developers, powered by AI.
                </p>
            </div>
        </div>
    );
}

export default Login;

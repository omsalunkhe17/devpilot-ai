
import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
    Outlet,
    useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setUser, logout } from "./features/auth/authSlice.js";
import Login from "./features/auth/Login.jsx";
import Register from "./features/auth/Register.jsx";
import WorkspaceDashboard from "./features/workspaces/WorkspaceDashboard.jsx";
import WorkspacePage from "./features/workspaces/WorkspacePage.jsx";
import api from "./services/api.js";

function ProtectedLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const getMe = async () => {
            try {
                const response = await api.get("/auth/get-me");
                dispatch(setUser(response.data.user));
            } catch {
                dispatch(logout());
            } finally {
                setCheckingAuth(false);
            }
        };

        getMe();
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            dispatch(logout());
            navigate("/login", { replace: true });
        } catch (error) {
            console.error(
                "Logout failed:",
                error.response?.data?.message || error.message
            );
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-zinc-400">Checking your session...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold">
                    DevPilot <span className="text-violet-400">AI</span>
                </Link>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400">
                        {user.username}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route element={<ProtectedLayout />}>
                <Route
                    path="/"
                    element={<WorkspaceDashboard />}
                />

                <Route
                    path="/workspaces/:workspaceId"
                    element={<WorkspacePage />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import CreateWorkspace from "./CreateWorkspace.jsx";

function WorkspaceDashboard() {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await api.get("/workspaces");
                setWorkspaces(response.data.workspaces);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load workspaces"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspaces();
    }, []);

    const handleWorkspaceCreated = (workspace) => {
        setWorkspaces((previous) => [workspace, ...previous]);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-10">

            {/* Dashboard Header */}
            <section className="pt-4">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                    Your developer hub
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Welcome to DevPilot AI
                </h1>

                <p className="mt-3 max-w-2xl text-zinc-400">
                    Organize your projects, explore your documentation,
                    and get ready to build with AI-powered project knowledge.
                </p>
            </section>

            {/* New Workspace Form */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-7">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        New workspace
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                        Create a dedicated space for your project.
                    </p>
                </div>

                <CreateWorkspace
                    onWorkspaceCreated={handleWorkspaceCreated}
                />
            </section>

            {/* My Workspaces */}
            <section>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            My workspaces
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                            Your projects, all in one place.
                        </p>
                    </div>

                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
                        {workspaces.length}{" "}
                        {workspaces.length === 1
                            ? "workspace"
                            : "workspaces"}
                    </span>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                        <p className="text-zinc-400">
                            Loading your workspaces...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                        <p className="text-red-400">{error}</p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 text-sm font-medium text-white underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && workspaces.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-400">
                            +
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-white">
                            No workspaces yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                            Create your first workspace above to start
                            organizing your project knowledge.
                        </p>
                    </div>
                )}

                {/* Workspace Cards */}
                {!loading && !error && workspaces.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {workspaces.map((workspace) => (
                            <Link
                                key={workspace._id}
                                to={`/workspaces/${workspace._id}`}
                                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/60 hover:bg-zinc-800/80"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-lg font-bold text-violet-400">
                                        {workspace.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <span className="text-sm text-zinc-500 transition group-hover:text-violet-400">
                                        ↗
                                    </span>
                                </div>

                                <h3 className="mt-5 truncate text-lg font-semibold text-white">
                                    {workspace.name}
                                </h3>

                                <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-400">
                                    {workspace.description ||
                                        "No description provided."}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
                                    <span className="text-xs text-zinc-500">
                                        Project workspace
                                    </span>

                                    <span className="text-sm font-medium text-violet-400 group-hover:text-violet-300">
                                        Open workspace →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default WorkspaceDashboard;

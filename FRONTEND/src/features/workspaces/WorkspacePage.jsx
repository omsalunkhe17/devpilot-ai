
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api.js";

function WorkspacePage() {
    const { workspaceId } = useParams();

    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/workspaces/${workspaceId}`
                );

                setWorkspace(response.data.workspace);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load workspace"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspace();
    }, [workspaceId]);

    if (loading) {
        return (
            <p className="text-zinc-400">
                Loading workspace...
            </p>
        );
    }

    if (error) {
        return (
            <div>
                <p className="text-red-400">{error}</p>
                <Link to="/" className="text-violet-400">
                    Back to workspaces
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link
                to="/"
                className="text-sm text-violet-400 hover:text-violet-300"
            >
                ← Back to workspaces
            </Link>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                <p className="text-sm text-violet-400 mb-2">
                    WORKSPACE
                </p>

                <h1 className="text-3xl font-bold text-white">
                    {workspace.name}
                </h1>

                <p className="mt-3 text-zinc-400">
                    {workspace.description ||
                        "No description provided."}
                </p>

                <div className="mt-8 border-t border-zinc-800 pt-6">
                    <h2 className="text-lg font-semibold text-white">
                        Project Knowledge
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                        Your workspace is ready. Next, we'll add
                        document uploads and GitHub repository
                        connections here.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WorkspacePage;

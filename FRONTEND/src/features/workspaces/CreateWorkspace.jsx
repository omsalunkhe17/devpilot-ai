
import { useState } from "react";
import api from "../../services/api.js";

function CreateWorkspace({ onWorkspaceCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Please enter a workspace name.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.post("/workspaces", {
                name: name.trim(),
                description: description.trim()
            });

            onWorkspaceCreated(response.data.workspace);

            setName("");
            setDescription("");
            setSuccess("Workspace created successfully!");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create workspace. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Workspace name */}
                <div>
                    <label
                        htmlFor="workspaceName"
                        className="mb-2 block text-sm font-medium text-zinc-200"
                    >
                        Workspace name
                        <span className="ml-1 text-violet-400">*</span>
                    </label>

                    <input
                        id="workspaceName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. My MERN Project"
                        maxLength={100}
                        required
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />

                    <p className="mt-2 text-xs text-zinc-500">
                        Choose a name that's easy to recognize.
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="workspaceDescription"
                        className="mb-2 block text-sm font-medium text-zinc-200"
                    >
                        Description
                        <span className="ml-2 text-xs font-normal text-zinc-500">
                            Optional
                        </span>
                    </label>

                    <textarea
                        id="workspaceDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What are you building?"
                        rows={3}
                        maxLength={500}
                        className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />

                    <p className="mt-2 text-xs text-zinc-500">
                        {description.length}/500 characters
                    </p>
                </div>
            </div>

            {/* Feedback messages */}
            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                    {error}
                </p>
            )}

            {success && (
                <p
                    role="status"
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
                >
                    {success}
                </p>
            )}

            {/* Submit */}
            <div className="flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-5">
                <button
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin">↻</span>
                            Creating...
                        </>
                    ) : (
                        <>
                            <span className="text-lg leading-none">+</span>
                            Create Workspace
                        </>
                    )}
                </button>

                <p className="text-xs text-zinc-500">
                    Your workspace will be saved to your account.
                </p>
            </div>
        </form>
    );
}

export default CreateWorkspace;

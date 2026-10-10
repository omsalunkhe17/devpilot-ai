
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api.js";

function WorkspacePage() {
    const { workspaceId } = useParams();

    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [documents, setDocuments] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [documentsError, setDocumentsError] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");

    // Fetch workspace details
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

    // Fetch documents belonging to this workspace
    const fetchDocuments = async () => {
        try {
            setDocumentsLoading(true);
            setDocumentsError("");

            const response = await api.get(
                `/documents/${workspaceId}`
            );

            setDocuments(response.data.documents);
        } catch (error) {
            setDocumentsError(
                error.response?.data?.message ||
                "Failed to load documents"
            );
        } finally {
            setDocumentsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [workspaceId]);

    // Handle PDF upload
    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setUploadError("Please select a PDF file.");
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            setUploadError("Only PDF files are allowed.");
            return;
        }

        setUploading(true);
        setUploadError("");
        setUploadSuccess("");

        try {
            const formData = new FormData();
            formData.append("document", selectedFile);

            await api.post(
                `/documents/${workspaceId}`,
                formData
            );

            setUploadSuccess("PDF uploaded successfully!");
            setSelectedFile(null);

            // Clear the file input after successful upload
            event.target.reset();

            // Refresh the list to show the newly uploaded document
            await fetchDocuments();
        } catch (error) {
            setUploadError(
                error.response?.data?.message ||
                "Failed to upload PDF. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

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
        <div className="mx-auto max-w-5xl space-y-6">
            <Link
                to="/"
                className="text-sm text-violet-400 hover:text-violet-300"
            >
                ← Back to workspaces
            </Link>

            {/* Workspace details */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                <p className="mb-2 text-sm text-violet-400">
                    WORKSPACE
                </p>

                <h1 className="text-3xl font-bold text-white">
                    {workspace.name}
                </h1>

                <p className="mt-3 text-zinc-400">
                    {workspace.description ||
                        "No description provided."}
                </p>
            </section>

            {/* Upload document */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-xl font-semibold text-white">
                    Upload project documentation
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Upload a PDF containing your project notes or
                    technical documentation. Maximum size: 5 MB.
                </p>

                <form onSubmit={handleUpload} className="mt-5 space-y-4">
                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(event) => {
                            setSelectedFile(
                                event.target.files?.[0] || null
                            );
                            setUploadError("");
                            setUploadSuccess("");
                        }}
                        className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-violet-500"
                    />

                    {selectedFile && (
                        <p className="text-sm text-zinc-400">
                            Selected: {selectedFile.name}
                        </p>
                    )}

                    {uploadError && (
                        <p className="text-sm text-red-400">
                            {uploadError}
                        </p>
                    )}

                    {uploadSuccess && (
                        <p className="text-sm text-green-400">
                            {uploadSuccess}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload PDF"}
                    </button>
                </form>
            </section>

            {/* Uploaded documents */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Project documents
                        </h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            PDFs uploaded to this workspace.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchDocuments}
                        disabled={documentsLoading}
                        className="text-sm text-violet-400 hover:text-violet-300 disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>

                {documentsLoading && (
                    <p className="mt-5 text-sm text-zinc-400">
                        Loading documents...
                    </p>
                )}

                {!documentsLoading && documentsError && (
                    <div className="mt-5">
                        <p className="text-sm text-red-400">
                            {documentsError}
                        </p>
                        <button
                            type="button"
                            onClick={fetchDocuments}
                            className="mt-2 text-sm text-violet-400"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!documentsLoading &&
                    !documentsError &&
                    documents.length === 0 && (
                        <p className="mt-5 rounded-xl border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-400">
                            No documents uploaded yet. Upload your
                            first PDF above.
                        </p>
                    )}

                {!documentsLoading &&
                    !documentsError &&
                    documents.length > 0 && (
                        <div className="mt-5 space-y-3">
                            {documents.map((document) => (
                                <div
                                    key={document._id}
                                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-400">
                                        PDF
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-white">
                                            {document.name}
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Uploaded{" "}
                                            {new Date(
                                                document.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                                        {document.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
            </section>

            {/* Future RAG feature */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-lg font-semibold text-white">
                    AI project assistant
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                    Once we implement chunking and Pinecone embeddings,
                    you'll be able to ask questions about these documents.
                </p>
            </section>
        </div>
    );
}

export default WorkspacePage;

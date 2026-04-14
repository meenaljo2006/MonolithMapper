import React, { useState } from "react";
import { UploadCloud, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProjectIngestion({ project, onIngestionComplete }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, uploading, uploaded, indexing, error
  const [repoPath, setRepoPath] = useState("");
  const [message, setMessage] = useState("");

  // Point this to your live Cloud Run URL
  const API_BASE_URL = "https://monolith-mapper-653442272612.asia-south1.run.app";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUploadAndIndex = async () => {
    if (!file) return;
    const token = localStorage.getItem("access_token");
    let currentRepoPath = repoPath;

    try {
      if (status === "idle" || status === "error") {
        setStatus("uploading");
        
        // ─── STEP 1: GET THE VIP PASS (Signed URL) ───
        setMessage("Requesting secure upload tunnel...");
        const urlRes = await fetch(`${API_BASE_URL}/generate-upload-url?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}` 
          }
        });
        const urlData = await urlRes.json();
        if (!urlRes.ok) throw new Error(urlData.detail || "Failed to generate upload URL");
        
        const { upload_url, bucket_path } = urlData;

        // ─── STEP 2: UPLOAD DIRECTLY TO GOOGLE CLOUD STORAGE ───
        setMessage("Uploading massive file directly to Cloud Storage...");
        const gcsRes = await fetch(upload_url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/zip"
            // CRITICAL: NO Authorization header here!
          },
          body: file, // Send the raw file object
        });
        if (!gcsRes.ok) throw new Error("Google Cloud Storage rejected the upload");

        // ─── STEP 3: TRIGGER BACKEND PROCESSING ───
        setMessage("Upload complete. Server is verifying and extracting...");
        const processRes = await fetch(`${API_BASE_URL}/process-bucket-upload?bucket_path=${encodeURIComponent(bucket_path)}`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}` 
          }
        });
        const processData = await processRes.json();
        if (!processRes.ok) throw new Error(processData.detail || "Failed to process bucket upload");

        currentRepoPath = processData.repo_path;
        setRepoPath(currentRepoPath);
        setStatus("uploaded");
      }

      // ─── STEP 4: INDEXING (Unchanged) ───
      setStatus("indexing");
      setMessage("Extracting AST and generating AI Vector Embeddings. Please wait...");

      const indexRes = await fetch(`${API_BASE_URL}/index`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ repo_path: currentRepoPath, force_reindex: false }),
      });

      const indexData = await indexRes.json();
      if (!indexRes.ok) throw new Error(indexData.detail || "Indexing failed");

      // ─── SUCCESS ───
      setMessage("Indexing complete! Transitioning to AI Workspace...");
      
      setTimeout(() => {
        onIngestionComplete({
          status: "indexed",
          repoPath: currentRepoPath,
          nodeCount: indexData.node_count
        });
      }, 1500);

    } catch (error) {
      console.error("Ingestion Error:", error);
      setStatus("error");
      setMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="ingestion-container">
      <div className="ingestion-card">
        <div className="ingestion-header">
          <h2>Code Ingestion Phase</h2>
          <p>Upload a .zip file of your monolithic codebase to begin AST extraction and vector embedding for <strong>{project.name}</strong>.</p>
        </div>

        {/* Drop Zone */}
        <div className="file-drop-zone">
          <input 
            type="file" 
            accept=".zip" 
            onChange={handleFileChange} 
            disabled={status === "uploading" || status === "indexing"}
            id="file-upload"
            className="hidden-input"
          />
          <label htmlFor="file-upload" className="file-label">
            <UploadCloud size={48} color={file ? "var(--cyan)" : "var(--text-3)"} />
            <span className="file-name">
              {file ? file.name : "Click to browse and upload .zip codebase here"}
            </span>
          </label>
        </div>

        {/* Dynamic Status Display */}
        {message && (
          <div className={`status-alert alert-${status}`}>
            {(status === "uploading" || status === "indexing") && <Loader2 size={16} className="spinning" />}
            {status === "error" && <AlertCircle size={16} />}
            {status === "uploaded" && <CheckCircle2 size={16} />}
            <span>{message}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="ingestion-actions">
          <button 
            className="btn-cyan full-width" 
            onClick={handleUploadAndIndex}
            disabled={!file || status === "uploading" || status === "indexing"}
          >
            {status === "idle" || status === "error" ? "Start Ingestion Process" : 
             status === "uploading" ? "Uploading..." : 
             status === "indexing" ? "Indexing Codebase..." : "Processing..."}
          </button>
        </div>
      </div>
    </div>
  );
}
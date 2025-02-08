"use client";
import { useState, useEffect } from "react";

interface Job {
  id: number;
  title: string;
  company_name: string;
  category: string;
  url: string;
  description: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("Fetching jobs from local API...");
        const response = await fetch("/api/jobs/routes"); // ✅ Correct API path

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Jobs received:", data.jobs.length);

        setJobs(data.jobs);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Remote Jobs for Disabled Individuals
      </h1>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: "16px" }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "600" }}>{job.title}</h2>
            <p style={{ color: "#555" }}>{job.company_name}</p>
            <p style={{ fontSize: "14px", color: "#777" }}>{job.category}</p>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "underline", marginTop: "8px", display: "inline-block" }}
            >
              View Job
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Home.css"; // Ensure your CSS path is correct

function Home({ setAuth }) {
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setCvFile(event.target.files[0]);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      setResult(response.data);
      setError("");
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.error ||
            "An error occurred during form submission."
        );
      } else if (error.request) {
        setError("No response from the server.");
      } else {
        setError("Error: " + error.message);
      }
      setResult(null);
    } finally {
      setIsLoading(false);
      setCvFile(null);
      setJobDescription("");
      event.target.reset(); // Optionally reset the form fields
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h1 style={{ color: "black" }}>Resume Screening Application</h1>
          <label htmlFor="cvUpload">Upload CV (PDF or DOCX):</label>
          <input
            type="file"
            id="cvUpload"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
      {isLoading && <div className="loading-spinner"></div>}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="error"
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="result"
            transition={{ duration: 0.5 }}
          >
            <h2>Score: {result.score}</h2>
            <p>{result.justification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;

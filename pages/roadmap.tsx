import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyAb98plaEB0NohbtAp94_kuJWbB-BuTmGM');

const RoadmapPage = () => {
  const [formData, setFormData] = useState({
    skill: '',
    hoursPerWeek: '',
    language: '',
  });
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRoadmap = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Create a detailed learning roadmap for ${formData.skill} with the following criteria:
      - Learning time available: ${formData.hoursPerWeek} hours per week
      - Preferred language: ${formData.language}
      - Include specific milestones
      - Recommend relevant online resources (like Udemy, W3Schools, etc.)
      - Estimated time to complete each milestone
      Format the response as JSON with the following structure, and ONLY return the JSON object without any additional text or formatting:
      {
        "milestones": [
          {
            "title": "milestone title",
            "description": "milestone description",
            "estimatedTime": "time in weeks",
            "resources": [
              {
                "name": "resource name",
                "url": "resource url",
                "type": "website/course/tutorial"
              }
            ]
          }
        ]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response text to get only the JSON part
      const jsonStr = text.replace(/```json\n|\n```/g, '').trim();
      const jsonResponse = JSON.parse(jsonStr);
      
      let formattedRoadmap = '';
      
      jsonResponse.milestones.forEach((milestone, index) => {
        formattedRoadmap += `## Milestone ${index + 1}: ${milestone.title}\n\n`;
        formattedRoadmap += `${milestone.description}\n\n`;
        formattedRoadmap += `⏱️ Estimated Time: ${milestone.estimatedTime}\n\n`;
        formattedRoadmap += `📚 Resources:\n`;
        milestone.resources.forEach(resource => {
          formattedRoadmap += `- [${resource.name}](${resource.url}) (${resource.type})\n`;
        });
        formattedRoadmap += `\n---\n\n`;
      });

      setRoadmap(formattedRoadmap);
    } catch (error) {
      console.error('Error generating roadmap:', error)  ;
      setRoadmap('Error generating roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(145deg, #050505, #130A2A, #0A1229)",
      minHeight: "100vh",
      padding: "120px 20px 60px",
      color: "#F5F5F5",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
      }}>
        <h1 style={{
          fontSize: "4rem",
          fontWeight: "800",
          textAlign: "center",
          marginBottom: "50px",
          background: "linear-gradient(135deg, #FFFFFF, #BB86FC)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 40px rgba(187, 134, 252, 0.2)",
        }}>
          Generate Your Learning Roadmap
        </h1>
        
        <form onSubmit={generateRoadmap} style={{
          background: "rgba(13, 12, 34, 0.6)",
          borderRadius: "24px",
          padding: "40px",
          border: "1px solid rgba(124, 58, 237, 0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          marginBottom: "40px",
        }}>
          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "500",
              marginBottom: "10px",
              color: "#E0E0E0",
            }}>
              What skill do you want to learn?
            </label>
            <input
              type="text"
              name="skill"
              value={formData.skill}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                background: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                color: "#FFFFFF",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "500",
              marginBottom: "10px",
              color: "#E0E0E0",
            }}>
              Hours available per week
            </label>
            <input
              type="number"
              name="hoursPerWeek"
              value={formData.hoursPerWeek}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                background: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                color: "#FFFFFF",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "500",
              marginBottom: "10px",
              color: "#E0E0E0",
            }}>
              Preferred programming language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                background: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                color: "#FFFFFF",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
              border: "none",
              color: "#FFFFFF",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
            }}
          >
            {loading ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </form>

        {roadmap && (
          <div style={{
            background: "rgba(13, 12, 34, 0.6)",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid rgba(124, 58, 237, 0.15)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          }}>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "30px",
              color: "#FFFFFF",
              background: "linear-gradient(135deg, #FFFFFF, #BB86FC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Your Learning Roadmap
            </h2>
            <div style={{
              color: "#E0E0E0",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
              fontFamily: "'Inter', sans-serif",
            }}>
              {roadmap}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;

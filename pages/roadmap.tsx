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
      Please format the response in markdown.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setRoadmap(text);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setRoadmap('Error generating roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Generate Your Learning Roadmap
        </h1>
        
        <form onSubmit={generateRoadmap} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              What skill do you want to learn?
            </label>
            <input
              type="text"
              name="skill"
              value={formData.skill}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hours available per week
            </label>
            <input
              type="number"
              name="hoursPerWeek"
              value={formData.hoursPerWeek}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred programming language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </form>

        {roadmap && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Learning Roadmap</h2>
            <div className="prose max-w-none">
              {/* You might want to use a markdown parser here */}
              <pre className="whitespace-pre-wrap">{roadmap}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;

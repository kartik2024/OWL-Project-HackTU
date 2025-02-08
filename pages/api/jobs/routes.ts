export const config = {
    runtime: "edge", // Use Edge runtime to avoid Response issues
  };
  
  export default async function handler(req: Request) {
    try {
      const response = await fetch("https://remotive.io/api/remote-jobs");
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  
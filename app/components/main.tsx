"use client"

import { JSX, useState } from "react";
import "../styles/home.css"
import Chart from "./chart";

export default function Scraper(): JSX.Element {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [data, setData] = useState("website data will be displayed here" as any);
  const [error, setError] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState(false);
  const [chatbotWindow, setChatbotWindow] = useState("");
  const [chatbotData, setChatbotData] = useState("" as any);
  const [type, setType] = useState("bar");


  const handleScrape = async (): Promise<void> => {
    setError(null); // Reset error state
    try {
      const response = await fetch(`/api/scrapper?url=${encodeURIComponent(inputUrl)}`);
      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || "Something went wrong.");
        return;
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError("Failed to fetch scraped data.");
    }
  };

  //call chatbot api with data from the scraper
  const handleChatbot = async (): Promise<void> => {
    setError(null); // Reset error state

    //set instructions for chatbot as a combination of chatbot window and data
    const message = {message: chatbotWindow + ": website data :  " + data, type: type};
    try {
      const response = await fetch(`/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( message),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || "Something went wrong.");
        return;
      }

      const result = await response.json();
      setChatbotData(result.completion.choices[0].message.content);
    } catch (err) {
      setError("Failed to fetch chatbot data.");
    }
  }


  return (
    <div className="main-container">
      <div className="web-scrapper-container w-10/12 py-20">
        <h1 className="text-4xl">Web Scraper</h1>
        <div className="flex items-center mt-5 w-full justify-center gap-4">
          <input
            type="text"
            placeholder="Enter URL to scrape"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="rounded text-black w-2/5 h-8"
          />
          <button className="h-8 w-40 mt-0" onClick={handleScrape}>Scrape Website</button>
        </div>
      </div>

      <div className=" container-filters w-10/12 py-10 flex flex-col items-center my-10">
        <h2 className="text-2xl">Prompt AI to manipulate data</h2>
        <div className="llm-prompter">
          <div className="table-container">
            <label>Chart Type: </label>
            <select className="table-type" onChange={(e)=>setType(e.target.value)}>
              <option defaultValue="bar">Bar</option>
              <option value="pie">Pie</option>
              <option value="line">Line</option>
              <option value="scatter">Scatter</option>
            </select>
          </div>
          <div className="user-ai-prompt">
            <input value={chatbotWindow} onChange={(e)=>setChatbotWindow(e.target.value)} className="llm-input h-5 w-1/2 text-black rounded flex justify-start " placeholder="Ex: chart of discount %"></input> 
            <button className="llm-button h-8 w-40 mt-5" onClick={handleChatbot}>Prompt AI</button>
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
     {/*container for button dropdown*/}
      <div className="dropdown-container w-10/12 flex flex-col" >
        <button className="bg-gray-900 dropdown-button text-white text-2xl rounded mt-0" onClick={() => setDropdown(!dropdown)}>Show Scraped Content</button>
        {dropdown && <textarea value={data} onChange={(e)=>setData(e.target.value)} className=" w-full bg-gray-900 overflow-auto" style={{ height: "400px" }}>
        </textarea>}
      </div>

      
      
      <div>
      <Chart chatResponse={chatbotData} inputChartType={type}/>
      {//chatbotData && chatbotData
      }

      </div>
      {/*extra space on bottom*/}
      <div className="my-40"></div>
    </div>
  );
}

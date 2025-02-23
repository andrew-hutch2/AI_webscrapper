



import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, type } = body;
        
        //create system message
        
        let systemMessage = "You are getting website data an want to provide insight on this data" 
                    + "create a json object in the first value will be named insight with any insight you have on the data"
                    + "the chart will be this type " + type + "/n"
                    + "the second value will be a chart.js json component that can be passed directly in a chart.js component of type" + type + "named chart"
                    + "answer any question the user has about the data but in the insight but do not change from this format";
        if (type == "table"){
            systemMessage += "since the type is table still return in a standard chart.js json format outlined above. make labels the first row of the table and datasets[0].data the rest of the rows of the table";
        }
        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }
        

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {type: "json_object"},
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: message }
            ]
        });
        console.log(completion.choices[0].message)

        return NextResponse.json({ completion }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error generating completion" + error }, { status: 500 });
    }
}
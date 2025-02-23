



import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, type } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {type: "json_object"},
            messages: [
                { role: "system", content: "You are getting website data an want to provide insight on this data" 
                    + "create a json object in the first value will be named insight with any insight you can on the data"
                    + "the chart will be this type " + type + "/n"
                    + "the second value will be a chart.js json component that can be passed directly in a chart.js component of type" + type + "named chart"
                    + " give info in this format with nothing extra:  the insight:::chart data" 
                    + "answer any question the user has about the data but in the insight but do not change from this format"
                 },
                { role: "user", content: message }
            ]
        });
        console.log(completion.choices[0].message)

        return NextResponse.json({ completion }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error generating completion" + error }, { status: 500 });
    }
}
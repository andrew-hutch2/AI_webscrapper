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
        
        let systemMessage = "You are getting website data and want to provide insight on this data. ";

        if (type === "table") {
            systemMessage += `Create a JSON object with the following structure:
            {
                "insight": "Your insight here",
                "chart": {
                "type": "table",
                "title": "title goes here",
                "data": {
                    "labels": ["Category", "Details"],
                    "datasets": [
                    {
                        "data": [
                        ["Category1", "Detail1"],
                        ["Category2", "Detail2"],
                        ["Category3", "Detail3"]
                        ]
                    }
                    ]
                }
                }
            }
            Ensure that the data is formatted correctly for a table. Answer any questions the user has about the data in the insight but do not change from this format.`;
        } else {
            systemMessage += `Create a JSON object with the following structure:
            {
                "insight": "Your insight here",
                "chart": {
                "type": "${type}",
                "title": "Title goes here",
                "data": {
                    "labels": ["label1", "label2", "label3", "etc"],
                    "datasets": [
                    {
                        "label": "Instances/Effects",
                        "data": [30, 10, 50, 90],
                        "backgroundColor": [
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 99, 132, 0.6)"
                        ],
                        "borderColor": [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 159, 64, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 99, 132, 1)"
                        ],
                        "borderWidth": 1
                    }
                    ]
                },
            }
            Ensure that the data is formatted correctly for a Chart.js component of type ${type}. Answer any questions the user has about the data in the insight but do not change from this format.`;
        }
            

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {type: "json_object"},
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: message }
            ]
        });

        console.log(completion.choices[0].message);

        return NextResponse.json({ completion }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error generating completion: " + error }, { status: 500 });
    }
}
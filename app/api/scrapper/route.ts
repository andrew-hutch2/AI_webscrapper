import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";



export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing or invalid URL parameter" },
      { status: 400 }
    );
  }

  try {
    const isValidUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Runs in headless mode
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for some hosting environments
    });
    const page = await browser.newPage();

    // Set User-Agent to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );

    // Go to the target URL
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    // Extract the content
    const scrapedData = await page.$eval('*', (el) => {
        const selection = window.getSelection();
        //incase selection is null
        if (selection) {
            const range = document.createRange();
            range.selectNode(el);
            selection.removeAllRanges();
            selection.addRange(range);
            return selection.toString();
        }
        return '';
    });

    // Close the browser
    await browser.close();

    return NextResponse.json({ data: scrapedData });
  } catch (error) {
    console.error("Error scraping with Puppeteer:", error);
    return NextResponse.json(
      { error: "Failed to scrape data" },
      { status: 500 }
    );
  }
}

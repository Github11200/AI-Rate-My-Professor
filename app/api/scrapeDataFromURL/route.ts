import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import chromium from "chrome-aws-lambda";

interface TeacherObject {
  name: string;
  rating: number;
  difficulty: number;
  reviews: string[];
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  // Validate the URL before proceeding
  if (!url || !/^https?:\/\/.+\..+$/.test(url)) {
    console.error("Invalid URL provided:", url);
    return new Response("Invalid URL provided", { status: 400 });
  }

  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    while (true) {
      try {
        await page.waitForSelector("button.Buttons__Button-sc-19xdot-1", {
          timeout: 5000,
        });
        await page.$eval("button.Buttons__Button-sc-19xdot-1", (element) =>
          element.click()
        );
      } catch (error) {
        console.log("No more buttons to click, starting data scraping.");
        break;
      }
    }

    const teachers = await page.$$("a.TeacherCard__StyledTeacherCard-syjs0d-0");

    const teacherObjects: TeacherObject[] = [];

    for (const teacher of teachers) {
      const name = await teacher.$eval(
        ".CardName__StyledCardName-sc-1gyrgim-0.cJdVEK",
        (el) => el.textContent
      );

      const ratingText = await teacher.$eval(
        ".CardNumRating__CardNumRatingNumber-sc-17t4b9u-2",
        (el) => el.textContent
      );
      const rating = parseFloat(ratingText || "0");

      if (rating > 0.0) {
        const page2 = await browser.newPage();
        const teacherUrl = await teacher
          .getProperty("href")
          .then((prop) => prop.jsonValue());

        if (!teacherUrl) {
          console.error("Invalid teacher URL");
          continue;
          A;
        }

        await page2.goto(teacherUrl, { waitUntil: "networkidle2" });
        await page2.bringToFront();

        const reviews = await page2.$$eval(
          ".Comments__StyledComments-dzzyvm-0.gRjWel",
          (els) => els.map((el) => el.textContent || "")
        );

        const difficultyText = await page2.$eval(
          ".FeedbackItem__FeedbackNumber-uof32n-1.kkESWs",
          (el) => el.textContent
        );
        const difficulty = parseFloat(difficultyText || "0");

        teacherObjects.push({
          name: name || "",
          rating: rating || 0.0,
          difficulty: difficulty || 0.0,
          reviews: reviews as string[],
        });

        await page2.close();
      }
      console.log("Finished scraping data for teacher: ", name);
    }

    console.log("Scarping complete!");
    await browser.close();
    return NextResponse.json(teacherObjects);
  } catch (error) {
    console.error("Error occurred while scraping data:", error);
    return new Response("Error occurred while scraping data", { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

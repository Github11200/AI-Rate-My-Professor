import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

interface TeacherObject {
  name: string;
  rating: number;
  difficulty: number;
  reviews: string[];
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { url } = await req.json();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  try {
    await page.goto(url);

    while (true) {
      try {
        // Wait for the button to be visible
        await page.waitForSelector("button.Buttons__Button-sc-19xdot-1", {
          timeout: 5000,
        });

        let button = await page.$eval(
          `button.Buttons__Button-sc-19xdot-1`,
          (element) => element.click()
        );
      } catch (error) {
        // If the button is not found, break the loop
        console.log("Show More button not found. All content loaded.");
        break;
      }
    }

    let teachers = await page
      .$$("a.TeacherCard__StyledTeacherCard-syjs0d-0")
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      });

    const teacherObjects: TeacherObject[] = [];

    for (let teacher of teachers) {
      const name = (await teacher.$eval(
        ".CardName__StyledCardName-sc-1gyrgim-0.cJdVEK",
        (el) => el.textContent
      )) as string;

      const rating = parseFloat(
        (await teacher.$eval(
          ".CardNumRating__CardNumRatingNumber-sc-17t4b9u-2",
          (el) => el.textContent
        )) as string
      );

      if (rating > 0.0) {
        const teacherObject: TeacherObject = {
          name: "",
          rating: 0.0,
          difficulty: 0.0,
          reviews: [],
        };

        const page2 = await browser.newPage();
        await page2.goto(await (await teacher.getProperty("href")).jsonValue());
        await page2.bringToFront();

        const reviews = await page2.$$eval(
          ".Comments__StyledComments-dzzyvm-0.gRjWel",
          (el) => el.map((x) => x.textContent)
        );

        const difficulty = parseFloat(
          (await page2.$eval(
            ".FeedbackItem__FeedbackNumber-uof32n-1.kkESWs",
            (el) => el.textContent
          )) as string
        );

        teacherObject.reviews = reviews as string[];
        teacherObject.name = name;
        teacherObject.rating = rating;
        teacherObject.difficulty = difficulty;

        await page2.close();

        teacherObjects.push(teacherObject);
      }
    }

    await browser.close();

    return new Response(JSON.stringify(teacherObjects));
  } finally {
    console.log("exiting");

    if (browser) {
      browser.close();
    }
  }
}

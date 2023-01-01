const puppeteer = require("puppeteer");

const getLeaders = async () => {
  const browser = await puppeteer.launch();

  console.log("Browser launched...");

  const page = await browser.newPage();

  await page.goto(
    "https://www.nba.com/stats/leaders?SeasonType=Regular%20Season"
  );

  console.log("Page loaded...");

  const tableData = await page.$$("td");

  const tableheaders = await page.$$eval("th", (el) =>
    el.map((x) => x.getAttribute("field"))
  );

  console.log("Data collected...");

  // initializing empty array to hold all data
  const leaders = [];

  // this keeps track of the place of each player's stats start
  let playerDelimeter = 0;

  for (let i = 0; i < 10; i++) {
    // initialize empty object in leaders array for each player
    leaders[i] = {};
    // set statCount for each player to zero
    let statCount = 0;
    // j loops through all stats starting at player delimeter, which goes up by 23 for each player
    let j = playerDelimeter;

    // loops 23 times to record all stats
    while (statCount < 23) {
      // accessing string from puppeteer
      const statValue = await (
        await tableData[j].getProperty("textContent")
      ).jsonValue();

      // creating a property inside each player object and storing it's value from above
      leaders[i][tableheaders[statCount]] = statValue;
      //incrementing j to get to next stat
      j++;
      // keeping track of number of loops for each player
      statCount++;
    }
    // player delimeter increases by 23 to access next players stats
    playerDelimeter += 23;
  }
  await browser.close();
  console.log("Done!");
  console.table(leaders);
};

getLeaders();

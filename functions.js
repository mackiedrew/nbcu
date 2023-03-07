const functions = require("@google-cloud/functions-framework");
const luxon = require("luxon");
const path = require("path");
const fs = require("fs/promises")

const merchants = ["schutz"].map((merchant) => `${merchant}.csv`);

functions.http("generate", (req, res) => {
  main(merchants);
  // Upload to Google Bucket
  res.send("OK");
});

functions.http("feed", async (req, res) => {
  const now = luxon.DateTime.now();
  console.log("now", now)
  const lastDay = luxon.DateTime.fromObject({
    year: now.year,
    month: now.month,
    day: now.day,
    // hour: now.hour,
  });
  // Download CSV from Google Bucket
  const csv = await readCsv("./nbcu.csv");
  res.set("Content-Type", "text/csv");
  res.set("Content-Disposition", 'attachment; filename="nbcu.csv"');
  res.set("Last-Modified", lastHour.toHTTP());
  res.send(csv);
});

const readCsv = async (fileName) => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, fileName), { encoding: 'utf8' });
    return data
  } catch (err) {
    console.log(err);
  }
}

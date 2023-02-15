const { downloadAwsFiles } = require("./aws.js");
const { transformCsvsToNCBU } = require("./transform.js");
const functions = require("@google-cloud/functions-framework");
const luxon = require("luxon");

const merchants = ["schutz"].map((merchant) => `${merchant}.csv`);

const main = async (merchants) => {
  console.log("🚀 Started transforming CSVs");

  // Download list of TSVs from AWS bucket
  console.log(
    `🧠 Will attempt to download the following files: ${merchants.join(", ")}`
  );
  const fileNames = await downloadAwsFiles(merchants);
  console.log("⬇️  Dowloaded CSVs from AWS");

  // Transfmorm each row by a set of rules
  await transformCsvsToNCBU(fileNames);
  console.log("🎉 Transformed all CSVs");

  console.log("✅ Finished transforming CSVs!");
};

// main(merchants);

functions.http("generate", (req, res) => {
  main(merchants);
  // Upload to Google Bucket
  res.send("OK");
});

functions.http("feed", (req, res) => {
  const now = luxon.DateTime.now();
  const lastHour = luxon.DateTime.fromObject({
    year: now.year,
    month: now.month,
    day: now.day,
    hour: now.hour,
  });
  // Download CSV from Google Bucket
  const csv = readCsv("nbcu.csv");
  res.set("Content-Type", "text/csv");
  res.set("Content-Disposition", 'attachment; filename="nbcu.csv"');
  res.set("Last-Modified", lastHour.toHTTP());
  res.send(csv);
});

const readCsv = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
  return data
}

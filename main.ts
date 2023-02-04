import { downloadAwsFiles } from "./aws";

const merchants: string[] = [
    "schutz",
].map(merchant => `${merchant}.csv`)

const transformToNCBU = (csvs: string[]) => ["transformed CSV"];

const writeCsv = (csvs: string[]) => {} 

const main = (merchants: string[]) => {
    console.log("🚀 Started transforming CSVs");

    // Download list of TSVs from AWS bucket
    console.log(`🧠 Will attempt to download the following files: ${merchants.join(", ")}`)
    const fileNames = downloadAwsFiles(merchants);
    console.log("⬇️  Dowloaded CSVs from AWS");
    // Transfmorm each row by a set of rules
    // const transformedCsvs = transformToNCBU(csvs);
    // Write one new CSV to a single new file
    // writeCsv(transformedCsvs);
    console.log("✅ Finished transforming CSVs!");
}

main(merchants);

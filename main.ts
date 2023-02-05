import { downloadAwsFiles } from "./aws";
import { transformCsvsToNCBU } from "./transform";

const merchants: string[] = [
    "schutz",
].map(merchant => `${merchant}.csv`)

const main = async (merchants: string[]) => {
    console.log("🚀 Started transforming CSVs");

    // Download list of TSVs from AWS bucket
    console.log(`🧠 Will attempt to download the following files: ${merchants.join(", ")}`)
    const fileNames = await downloadAwsFiles(merchants);
    console.log("⬇️  Dowloaded CSVs from AWS");
    
    // Transfmorm each row by a set of rules
    await transformCsvsToNCBU(fileNames);
    console.log("🎉 Transformed all CSVs");
    
    console.log("✅ Finished transforming CSVs!");
}

main(merchants);

const merchants: string[] = [
    "schutz",
]

const downloadFromAWs = (merchants: string[]): string[] => ["fileNames"]

const readFilesToMemory = (files: string[]): string[] => ["csv1", "csv2"]

const transformToNCBU = (csvs: string[]) => ["transformed CSV"];

const writeCsv = (csvs: string[]) => {} 

const main = (merchants: string[]) => {
    // Download list of TSVs from AWS bucket
    const fileNames = downloadFromAWs(merchants);
    // Read files into memory
    const csvs = readFilesToMemory(fileNames);
    // Transform each row by a set of rules
    const transformedCsvs = transformToNCBU(csvs);
    // Write one new CSV to a single new file
    writeCsv(transformedCsvs);
}

main(merchants);

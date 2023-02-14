import papa from "papaparse";
import { promises as fs } from "fs";
import path from "path";
import { stripHtml } from "string-strip-html";

/**
 * ✅ We need to split additional image into 6 rows instead of one separated by commas
 * ✅ We need to add a "refundable" column that will always be true
 * ✅ We need to strip HTML from the description and clamp it at the paragraph-level at 5000 characters
 * We need to split the Description field so that the Sentences get mapped to Product Description, and that we add a new optional attribute for every category in our marketplace called Product Details, which is the mapped recipient of all the remaining data. (Note: Delete SKU info).
 */

const transformCsvToNCBU = async (fileName) => {
  const originalCsv = await fs.readFile(path.resolve(__dirname, fileName), "utf-8");

  // Read file into papa
  console.log("👁️  Reading CSV", fileName);
  const parsedCsv = await new Promise<any>((resolve) =>
    papa.parse(originalCsv, {
      header: true,
      complete: resolve,
    })
  );

  // Transform data
  console.log("💪 Transforming CSV", fileName);
  const transformedData = parsedCsv.data
    .map(removeRatings)
    .map(addRefundableColumn)
    .map(removeHTMLFromDescription)
    .map(splitImages)
    .map(splitDescription);
    
  console.log(transformedData.map((e) => [e.product_description, e.product_details]))

  const csv = papa.unparse({...transformedData, data: transformedData});

  // Write new file
  console.log("🖊️  Writing transformed CSV", `nbcu-${fileName}`);
  await fs.writeFile(path.resolve(__dirname, `nbcu-${fileName}`), csv);
};

const removeRatings = ({ total_ratings, star_rating, ...rest }) => {
    return rest;
}

const addRefundableColumn = (row) => ({ ...row, refundable: true }) 

const removeHTMLFromDescription = (row) => ({ ...row, description: stripHtml(row.description || "").result });

const splitImages = ({image_link, additional_image_link, ...rest}) => {
    const [image_2 = '', image_3 = '', image_4 = '', image_5 = '', image_6 = ''] = (additional_image_link || "").split(",");
    return {
        ...rest,
        image_1: image_link || '',
        image_2,
        image_3,
        image_4,
        image_5,
        image_6,
    }
};

const truncate = (string, limit) => {
  if (string.length <= limit) {
    return string;
  }
  return string.slice(0, limit - 1);
};

const splitDescription = ({description, ...rest}) => {
  const [product_description, ...product_details] = description.split('\n');
  return {
    product_description: truncate(product_description, 5000),
    product_details: product_details.join("\n"),
    ...rest,
  }
}

export const transformCsvsToNCBU = (fileNames) =>
  Promise.all(fileNames.map(transformCsvToNCBU));

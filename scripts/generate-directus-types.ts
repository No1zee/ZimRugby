import * as fs from "fs";
import * as path from "path";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "zru-directus-admin-8afea6eb598749eb88e651ac";
const OUTPUT_PATH = path.join(process.cwd(), "src/types/directus-generated.ts");

interface DirectusField {
  collection: string;
  field: string;
  type: string;
  meta: {
    required: boolean;
    nullable: boolean;
  } | null;
}

function mapType(directusType: string): string {
  switch (directusType) {
    case "string":
    case "text":
    case "uuid":
    case "hash":
      return "string";
    case "integer":
    case "bigint":
    case "float":
    case "decimal":
      return "number";
    case "boolean":
      return "boolean";
    case "json":
      return "Record<string, unknown>";
    case "dateTime":
    case "date":
    case "time":
      return "string";
    default:
      return "any";
  }
}

async function main() {
  console.log(`Fetching Directus fields metadata from ${DIRECTUS_URL}/fields...`);
  
  try {
    const res = await fetch(`${DIRECTUS_URL}/fields`, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Directus returned status ${res.status}`);
    }

    const json = await res.json();
    const fields: DirectusField[] = json.data || [];

    // Group fields by collection
    const collections: Record<string, DirectusField[]> = {};
    for (const field of fields) {
      // Ignore system collections starting with directus_
      if (field.collection.startsWith("directus_")) continue;
      
      if (!collections[field.collection]) {
        collections[field.collection] = [];
      }
      collections[field.collection].push(field);
    }

    let code = `/**\n * Auto-generated Directus TypeScript definitions.\n * Generated on ${new Date().toISOString()}\n */\n\n`;

    for (const [name, colFields] of Object.entries(collections)) {
      const interfaceName = name
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

      code += `export interface ${interfaceName} {\n`;
      for (const field of colFields) {
        const tsType = mapType(field.type);
        const optional = field.meta?.required ? "" : "?";
        const nullable = field.meta?.nullable ? " | null" : "";
        code += `  ${field.field}${optional}: ${tsType}${nullable};\n`;
      }
      code += `}\n\n`;
    }

    // Ensure output directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, code, "utf-8");
    console.log(`Successfully generated TypeScript interfaces in ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("Failed to generate types:", error);
    process.exit(1);
  }
}

main();

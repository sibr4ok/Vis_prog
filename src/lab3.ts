import { readFile, writeFile } from "node:fs/promises";

export function csvToJSON(input: string[], delimiter: string): object[] {
    if (!input.length) {
        throw new Error("Input is empty");
    }

    const headers = input[0].split(delimiter);

    return input.slice(1).map((row, rowIndex) => {
        const values = row.split(delimiter);

        if (values.length !== headers.length) {
            throw new Error(
                `Row ${rowIndex + 1} has incorrect number of columns`
            );
        }

        const obj: Record<string, any> = {};

        headers.forEach((header, index) => {
            const value = values[index];


            const parsed = Number(value);
            obj[header] = isNaN(parsed) ? value : parsed;
        });

        return obj;
    });
}

export async function formatCSVFileToJSONFile(
    input: string,
    output: string,
    delimiter: string
): Promise<void> {
    const data = await readFile(input, "utf-8");
    const lines = data.trim().split("\n");

    const json = csvToJSON(lines, delimiter);

    await writeFile(output, JSON.stringify(json, null, 2), "utf-8");
}
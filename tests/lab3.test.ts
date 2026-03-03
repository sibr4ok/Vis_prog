import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs/promises", () => ({
    readFile: vi.fn(),
    writeFile: vi.fn(),
}));

import { readFile, writeFile } from "fs/promises";
import { csvToJSON, formatCSVFileToJSONFile } from "../src/lab3";



describe("csvToJSON", () => {
    it("converts correct CSV to JSON", () => {
        const input = [
            "p1;p2;p3;p4",
            "1;A;b;c",
            "2;B;v;d"
        ];

        const result = csvToJSON(input, ";");

        expect(result).toEqual([
            { p1: 1, p2: "A", p3: "b", p4: "c" },
            { p1: 2, p2: "B", p3: "v", p4: "d" }
        ]);
    });

    it("throws error if column count mismatch", () => {
        const input = [
            "p1;p2",
            "1;A;extra"
        ];

        expect(() => csvToJSON(input, ";")).toThrow();
    });

    it("throws error if input is empty", () => {
        expect(() => csvToJSON([], ";")).toThrow();
    });
});



describe("formatCSVFileToJSONFile (with mocks)", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("reads CSV and writes JSON file", async () => {
        const mockCSV = "p1;p2\n1;A\n2;B";

        (readFile as any).mockResolvedValue(mockCSV);
        (writeFile as any).mockResolvedValue(undefined);

        await formatCSVFileToJSONFile("input.csv", "output.json", ";");

        expect(readFile).toHaveBeenCalledWith("input.csv", "utf-8");

        expect(writeFile).toHaveBeenCalledWith(
            "output.json",
            JSON.stringify(
                [
                    { p1: 1, p2: "A" },
                    { p1: 2, p2: "B" }
                ],
                null,
                2
            ),
            "utf-8"
        );
    });
});
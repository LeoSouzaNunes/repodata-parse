import pkg from "@prisma/client";
import fs from "fs";
import { parse } from "json2csv";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const fields = ["name", "owner", "description", "topic", "language", "stars"];

const opts = { fields };

async function getAll() {
    const result = await prisma.repositories.findMany({
        where: {
            hasSponsorship: true,
        },
        orderBy: {
            stars: "desc",
        },
    });

    const jsonString = JSON.stringify(result);
    const jsonData = JSON.parse(jsonString);

    return jsonData;
}

function createCsvData(json) {
    const csv = parse(json, opts);
    console.log(csv);
    return csv;
}

async function run() {
    const jsonData = await getAll();
    const csv = createCsvData(jsonData);
    fs.writeFile("most-famous-sponsored-repos.csv", csv, "utf8", (error) =>
        console.log(error)
    );
}

await run();

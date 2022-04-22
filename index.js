import pkg from "@prisma/client";
import fs from "fs";
import { parse } from "json2csv";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const fields = [
    "id",
    "topic",
    "name",
    "owner",
    "ownerType",
    "fullName",
    "description",
    "ogImage",
    "license",
    "isArchived",
    "isForked",
    "size",
    "language",
    "tags",
    "openIssues",
    "forks",
    "stars",
    "watchers",
    "hasWiki",
    "hasPages",
    "hasSponsorship",
    "createdAt",
    "updatedAt",
];

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

const fs = require("fs");
const path = require("path");

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error("Usage: node convertShader.js <inputFile> <outputFile>");
  process.exit(1);
}

const data = fs.readFileSync(inputFile, "utf8");
const removeEmptyLines = (data) =>
  data
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .join("\n");

const noEmptyLines = removeEmptyLines(data);

const pre = `"`;
const end = `\\r\\n" +`;
const addStuff = (data) => {
  const lines = data.split(/\r?\n/);
  const newLines = lines.map((line) => {
    return `${pre}${line}${end}`;
  });
  return newLines.join("\n");
};

const iii = addStuff(noEmptyLines);

const doPrepend = `"\\r\\n" +\n${iii}`;

const removeLastPlusSymbol = (data) => {
  const lines = data.split(/\r?\n/);
  const lastLine = lines[lines.length - 1];
  const newLastLine = lastLine.replace(/\+$/, "");
  lines[lines.length - 1] = newLastLine;
  return lines.join("\n");
};

const removeLastPlus = removeLastPlusSymbol(doPrepend);

const wrapped = `\`\r\n${removeLastPlus};\r\n\``;

fs.writeFileSync(outputFile, wrapped);

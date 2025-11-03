// netlify/functions/generate-pdf.js
const PDFDocument = require("pdfkit");
const { Readable } = require("stream");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const answers = data.answers;

  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(20).text("Maintenance Report", { align: "center" });
  doc.moveDown();

  answers.forEach(({ question, answer }) => {
    doc.fontSize(12).text(`${question}`, { bold: true });
    doc.text(answer);
    doc.moveDown();
  });

  doc.end();

  const pdfBuffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=maintenance_report.pdf",
    },
    body: pdfBuffer.toString("base64"),
    isBase64Encoded: true,
  };
};

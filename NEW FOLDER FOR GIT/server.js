const XLSX = require('xlsx');
const PDF = require('pdfkit');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const officegen = require('officegen');
const pdf2excel = require('pdf-to-excel');
const pptxgen = require("pptxgenjs");
const merge = require('easy-pdf-merge');

async function pdf() {
    convert("./files/doc1.docx", "./files/doc1.pdf", function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
    });
}
// pdf();

async function docx() {
    const dataBuffer = fs.readFileSync('./files/doc1.pdf');
    const data = await pdfParse(dataBuffer);
    const docx = officegen('docx');
    const p = docx.createP();
    p.addText(data.text);
    const out = fs.createWriteStream('./files/doc2.docx');
    docx.generate(out);
}
// docx();

async function excel() {
    try {
        const options = {
            type: 'buffer',
            bookType: 'xlsx'
        };
        await pdf2excel.genXlsx('./files/excel1.pdf', './files/excel2.xlsx', options);
    } catch (err) {
        console.error('Error occurred:', err.message);
        console.error(err.stack);
    }
}
// excel();

async function excpdf() {
    const workbook = XLSX.readFile('./files/excel1.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const doc = new PDF();
    doc.pipe(fs.createWriteStream('./files/excel1.pdf'));
    doc.fontSize(25).text('Excel Data');
    data.forEach((row, index) => {
        doc.fontSize(12).text(`${JSON.stringify(row)}`);
    });
    doc.end();
}
// excpdf();

async function ppt() {
    function splitTextIntoSlides(text, maxLinesPerSlide, charsPerLine) {
        const words = text.split(' ');
        let slides = [];
        let slideText = '';
        let currentLines = 0;
        words.forEach(word => {
            const currentLineLength = slideText.split('\n').pop().length;
            if (currentLineLength + word.length > charsPerLine) {
                slideText += '\n';
                currentLines++;
            }
            if (currentLines >= maxLinesPerSlide) {
                slides.push(slideText.trim());
                slideText = '';
                currentLines = 0;
            }
            slideText += word + ' ';
        });
        if (slideText.length > 0) {
            slides.push(slideText.trim());
        }
        return slides;
    }
    try {
        const dataBuffer = fs.readFileSync('./files/doc1.pdf');
        const data = await pdfParse(dataBuffer);
        const text = data.text;
        const ppt = new pptxgen();
        const maxLinesPerSlide = 12;
        const charsPerLine = 50;
        const textSlides = splitTextIntoSlides(text, maxLinesPerSlide, charsPerLine);
        textSlides.forEach(slideText => {
            let slide = ppt.addSlide();
            slide.addText(slideText, { x: 0.5, y: 0.5, w: '90%', h: '90%', fontSize: 18 });
        });
        const fileName = './files/newpdf.pptx';
        await ppt.writeFile(fileName);
    } catch (err) {
        console.error('Error:', err);
    }
}
// ppt();


async function pptpdf() {
    officeParser.parseOffice('./files/newpdf.pptx', function (data, err) {
        const word = data;
        const doc = new PDF();
        doc.pipe(fs.createWriteStream('./files/newppt.pdf'));
        doc.text(word, 10, 10);
        doc.end();
    })
}
// pptpdf();

async function merging()
{
    merge(['./files/doc1.pdf', './files/excel1.pdf'], './files/merge.pdf', function (err) {
        if (err) {
            return console.log(err)
        }
        console.log('Successfully merged!')
    });
}
// merging();
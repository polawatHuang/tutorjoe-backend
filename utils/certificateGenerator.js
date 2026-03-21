// utils/certificateGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateCertificate = (studentName, courseName, certCode) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const filePath = path.join(__dirname, `../public/certs/${certCode}.pdf`);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Styling the Certificate
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1e293b'); // Dark background
        doc.fillColor('#ffffff')
           .fontSize(40)
           .font('Helvetica-Bold')
           .text('Certificate of Completion', { align: 'center' });

        doc.moveDown();
        doc.fontSize(20).font('Helvetica').text('This is to certify that', { align: 'center' });
        
        doc.moveDown();
        doc.fontSize(30).font('Helvetica-Bold').fillColor('#38bdf8').text(studentName, { align: 'center' });

        doc.moveDown();
        doc.fontSize(20).fillColor('#ffffff').text('has successfully completed the course', { align: 'center' });

        doc.moveDown();
        doc.fontSize(25).font('Helvetica-Bold').text(courseName, { align: 'center' });

        doc.moveDown(2);
        doc.fontSize(12).font('Helvetica').text(`Verification Code: ${certCode}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => resolve(`/certs/${certCode}.pdf`));
        stream.on('error', reject);
    });
};
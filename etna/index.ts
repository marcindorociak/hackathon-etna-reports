import * as fs from 'fs';
import * as path from 'path';
import { install } from 'source-map-support';
import { DocumentArtefact, TargetFormat } from './document-model';
//import invoices = require('./fixtures/test-data-small.json');
import { getRenderer } from './renderer';
import invoiceTemplate from "./fixtures/invoice";

install();
/**
 * Generates a single document
 * @param document
 * @param targetFormat
 * @param data
 */
export const generate = async (document: DocumentArtefact, targetFormat: TargetFormat, data: object): Promise<NodeJS.ReadableStream> => {
    return await getRenderer(document, targetFormat).generate(data);
};

/**
 * Generates a batch of documents
 * @param document
 * @param targetFormat
 * @param data
 */
export const generateBatch = async (document: DocumentArtefact, targetFormat: TargetFormat, data: object[]): Promise<NodeJS.ReadableStream[]> => {
    const renderer = getRenderer(document, targetFormat);
    const result: NodeJS.ReadableStream[] = [];

    for (const d of data) {
        result.push(await renderer.generate(d));
    }

    return result;
};

export const saveDocument = async (stream: NodeJS.ReadableStream, name: string | number, extension: string) => {
    return new Promise<string>(resolve => {
        const targetDir = path.resolve(__dirname, '../../output');

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        const filePath = path.resolve(targetDir, `${name}.${extension.toLowerCase()}`);
        if (!fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
        stream.on('end', () => {
            resolve(filePath);
        });
    });

};

export const runTest = async (dataInvoices: object) => {
    //const documentType = process.argv[2];
    const documentType = 'PDF';
    const startTime = new Date().getTime();
    // const results = await generateBatch(invoiceTemplate, documentType, dataInvoices);
    const results = await generateBatch(invoiceTemplate, documentType, dataInvoices);

    // Comment the following line out to save the documents to the disk:
    // results.forEach(async (r: NodeJS.ReadStream, i: number) => { await saveDocument(r, i, documentType); });
    console.log(`Generation of ${results.length} ${documentType} documents took ${new Date().getTime() - startTime} ms.`);
    return results;
};

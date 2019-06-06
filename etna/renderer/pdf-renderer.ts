// import * as PDFDocument from 'pdfkit';
import { XMLHttpRequest } from 'xmlhttprequest-ts';
import { DocumentArtefact, TargetFormat } from '../document-model';
import { DocumentRenderer } from './document-renderer';

export class PdfRenderer extends DocumentRenderer {
    constructor(document: DocumentArtefact) {
        super(document, TargetFormat.PDF);
    }

    getExtension() {
        return 'pdf';
    }

    callPrinterEndpoint = async (): Promise<NodeJS.ReadableStream[]> => {
        const request = new XMLHttpRequest();

        request.open('POST', 'http://localhost/api/report:5488', true);
        // request.open('POST', 'http://localhost:5488/api/report', true);
        // request.open('POST', 'https://jsreport-host/api/report', true);
        const data = {
            "template": { "content" : "Hello world", "recipe" : "chrome-pdf" },
            'data' : {"content" : "Hello world"},
            // 'options': { 'timeout': 60000 },
        };

        request.setRequestHeader('content-type', 'application/json');
        request.send(JSON.stringify(data));
        request.onreadystatechange = function () {

            if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
                // If no error
                // const result = JSON.parse(request.responseText);
                return request.responseText;
                console.log("Dziala");
            } else if (request.readyState === 4) {
                // If error occurred
                console.log("REDIKIZAMA");
            }
        };
    }

    async generate(data: object): Promise<NodeJS.ReadableStream> {
            // const doc = new PDFDocument();
            return this.callPrinterEndpoint();
            // return ret;
            // this.document(doc, data);
            // return doc;
    }
}

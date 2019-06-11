// import * as PDFDocument from 'pdfkit';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { DocumentArtefact, TargetFormat } from '../document-model';
import { DocumentRenderer } from './document-renderer';

export class PdfRenderer extends DocumentRenderer {
    constructor(document: DocumentArtefact) {
        super(document, TargetFormat.PDF);
    }

    getExtension() {
        return 'pdf';
    }
    async generate(data: object): Promise<NodeJS.ReadableStream> {
            const data2 = {
                template: { shortid : "rkJTnK2ce", recipe:"chrome-pdf",
                            engine:"jsrender"},
                data : {},
            };

            let config = {
                headers: { 'Content-Type': 'application/json', 'accept-charset': 'utf-8' },
                encoding: null,
                json: true,
            };

            const res = await axios.post('http://localhost:5488/api/report', data2, config)
            return await res.data;
    }
}

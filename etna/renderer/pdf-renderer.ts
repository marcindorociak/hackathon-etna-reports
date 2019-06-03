import * as PDFDocument from 'pdfkit';
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
            const doc = new PDFDocument();
            this.document(doc, data);
            return doc;
    }

}

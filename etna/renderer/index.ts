import { DocumentArtefact, TargetFormat } from '../document-model';
import { DocumentRenderer } from './document-renderer';
import { HtmlRenderer } from './html-renderer';
import { PdfRenderer } from './pdf-renderer';

export { PdfRenderer, HtmlRenderer };

export const getRenderer = (document: DocumentArtefact, targetFormat: TargetFormat): DocumentRenderer => {
    switch (targetFormat) {
        case TargetFormat.PDF:
            return new PdfRenderer(document);
        case TargetFormat.HTML:
            return new HtmlRenderer(document);
        default:
            throw new Error('Unsupported format: ' + targetFormat);
    }
};

import * as jsBeautify from 'js-beautify';
import { BasicFormattingOptions, DocumentArtefact, DocumentChapter, DocumentElement, DocumentParagraph, TableColumn, TableDocumentElement, TargetFormat, TextDocumentElement } from '../document-model';
import { DocumentRenderer } from './document-renderer';
const toReadableStream = require('to-readable-stream');

const DOCUMENT_BODY_CLASS = 'e-document-body';
const DOCUMENT_TITLE_CLASS = 'e-document-title';
const CHAPTER_TITLE_CLASS = 'e-chapter-title';
const PARAGRAPH_TITLE_CLASS = 'e-paragraph-title';
const TEXT_ELEMENT_CLASS = 'e-text-element';

const TABLE_ELEMENT_CLASS = 'e-table-element';
const TABLE_HEADER = 'e-table-element-header';
const TABLE_COLUMN = 'e-table-element-col';

export class HtmlRenderer extends DocumentRenderer {
    private readonly finalStyles: string;

    constructor(document: DocumentArtefact) {
        super(document, TargetFormat.HTML);

        const styleLines: string[] = [];

        // We create stylesheet here, which reuse later in the generation of the documents
        this.createCssRulesForElement(DOCUMENT_BODY_CLASS, document, styleLines);
        this.createCssRulesForElement(DOCUMENT_TITLE_CLASS, document.title, styleLines);
        if (document.chapters) {
            document.chapters.forEach((c: DocumentChapter, chapterId: number) => {
                if (c.title) {
                    this.createCssRulesForElement(`${CHAPTER_TITLE_CLASS}-${chapterId}`, c.title, styleLines);
                }

                if (c.paragraphs) {
                    c.paragraphs.forEach((p: DocumentParagraph, paragraphId: number) => {
                        if (p.title) {
                            this.createCssRulesForElement(`${PARAGRAPH_TITLE_CLASS}-${chapterId}-${paragraphId} `, p.title, styleLines);
                        }
                    });
                }
            });
        }

        this.finalStyles = styleLines.join('\n');
    }

    getExtension():string {
        return 'html';
    }

    private createCssRulesForElement(className: string, textElement: BasicFormattingOptions, lines: string[]) {
        const classLines: string[] = [];
        if (textElement.fontFamily) {
            classLines.push(`    font-family: ${textElement.fontFamily};`);
        }
        if (textElement.fontSize) {
            classLines.push(`    font-size: ${textElement.fontSize};`);
        }
        if (textElement.fontColor) {
            classLines.push(`    color: ${textElement.fontColor};`);
        }
        if (textElement.fontWeight) {
            classLines.push(`    font-weight: ${textElement.fontWeight};`);
        }

        if (classLines.length > 0) {
            lines.push(`.${className} {`);
            lines.push(...classLines);
            lines.push(`}`);
        }
    }

    renderChapter(chapter: DocumentChapter, data: object, chapterId: number): string[] {
        const chapterLines: string[] = [];
        if (chapter.title) {
            chapterLines.push(`<h2 class="${CHAPTER_TITLE_CLASS}-${chapterId}">${this.resolveHandlebars(chapter.title.content, data)}</h2>`);
        }
        if (chapter.paragraphs) {
            chapter.paragraphs.forEach((p: DocumentParagraph, paragraphId: number) => {
                chapterLines.push(...this.renderParagraph(p, data, chapterId, paragraphId));
            });
        }

        return chapterLines;
    }

    renderParagraph(paragraph: DocumentParagraph, data: object, chapterId: number, paragraphId: number): string[] {
        const chapterLines: string[] = [];
        if (paragraph.title) {
            chapterLines.push(`<h3 class="${PARAGRAPH_TITLE_CLASS}-${chapterId}-${paragraphId}">${this.resolveHandlebars(paragraph.title.content, data)}</h3>`);
        }

        if (paragraph.documentElements) {
            paragraph.documentElements.forEach((documentElement: DocumentElement, elementId: number) => {
                chapterLines.push(...this.renderDocumentElement(documentElement, data, chapterId, paragraphId, elementId));
            });
        }
        return chapterLines;
    }

    renderDocumentElement(documentElement: DocumentElement, data: object, chapterId: number, paragraphId: number, elementId: number): string[] {
        switch (documentElement.type) {
            case 'TEXT':
                return this.renderTextElement(documentElement as TextDocumentElement, data, chapterId, paragraphId, elementId);
            case 'TABLE':
                return this.renderTableElement(documentElement as TableDocumentElement, data, chapterId, paragraphId, elementId);
        }
    }

    renderTextElement(documentElement: TextDocumentElement, data: object, chapterId: number, paragraphId: number, elementId: number): string[] {
        const content = this.resolveHandlebars(documentElement.content, data);
        if (documentElement.displayInline) {
            return [`<span className="${TEXT_ELEMENT_CLASS}-${chapterId}-${paragraphId}-${elementId}">${content}</span>`];
        } else {
            return [`<p className="${TEXT_ELEMENT_CLASS}-${chapterId}-${paragraphId}-${elementId}">${content}</p>`];
        }
    }

    renderTableElement(documentElement: TableDocumentElement, data: object, chapterId: number, paragraphId: number, elementId: number): string[] {
        const targetData = (data as any)[documentElement.bind] as object[]; // TODO: Handlebars type of resolve.
        if (targetData instanceof Array) {
            const lines: string[] = [];
            lines.push(`<table class="${TABLE_ELEMENT_CLASS}-${chapterId}-${paragraphId}-${elementId}">`);
            lines.push('<tr>');

            documentElement.columns.forEach((column: TableColumn, columnId: number) => {
                lines.push(`<th class="${TABLE_HEADER}-${chapterId}-${paragraphId}-${elementId}-${columnId}">`);
                lines.push(this.resolveHandlebars(column.headerContent.content, data));
                lines.push('</th>');
            });

            lines.push('</tr>');

            targetData.forEach((rowData: any) => {
                lines.push('<tr>');
                documentElement.columns.forEach((column: TableColumn, columnId: number) => {
                    lines.push(`<td class="${TABLE_COLUMN}-${chapterId}-${paragraphId}-${elementId}-${columnId}">`);
                    lines.push(this.resolveHandlebars(column.cellContentWithHandlebarsRelativeToBind.content, rowData));
                    lines.push('</td>');
                });
                lines.push('</tr>');

            });
            lines.push('</table>');

            return lines;

        } else {
            throw new Error('Invalid table bound: resolved data is not an array.');
        }
    }

    async generate(data: object): Promise<NodeJS.ReadableStream> {
        const documentLines: string[] = [`<html><body class="${DOCUMENT_BODY_CLASS}">`];
        documentLines.push('<style>');
        documentLines.push(this.finalStyles);
        documentLines.push('</style>');

        documentLines.push(`<h1 class="${DOCUMENT_TITLE_CLASS}">${this.resolveHandlebars(this.document.title.content, data)}</h1>`);
        if (this.document.chapters) {
            this.document.chapters.forEach((c: DocumentChapter, chapterId: number) => {
                documentLines.push(...this.renderChapter(c, data, chapterId));
            });
        }
        documentLines.push('</body><html>');
        const result = jsBeautify.html(documentLines.join('\n'), { indent_size: 4 });
        return toReadableStream(result);
    }
}

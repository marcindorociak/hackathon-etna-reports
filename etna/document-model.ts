
export interface DocumentArtefact extends BasicFormattingOptions {
    title: TextDocumentElement;
    chapters?: DocumentChapter[];
    footer?: DocumentElement[];
    header?: DocumentElement[];
}

export interface BasicFormattingOptions {
    fontSize?: 4 | 8 | 12 | 16 | 24 | 32 | 42 | 56 | 72;
    fontFamily?: 'sans-serif' | 'Arial' | 'Helvetica' | 'Verdana' | ' Times New Roman';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
    fontColor?: string;
    backgroundColor?: string;
}

export interface DocumentChapter {
    title?: TextDocumentElement;
    paragraphs?: DocumentParagraph[];
}

export interface DocumentParagraph {
    title?: TextDocumentElement;
    documentElements: DocumentElement[];
}

export enum DocumentElementType {
    IMAGE = 'IMAGE',
    TEXT = 'TEXT',
    TABLE = 'TABLE',
}

export interface DocumentElement {
    type: string;
    displayInline?: boolean;
}

export interface TextDocumentElement extends BasicFormattingOptions, DocumentElement {
    content: string;
}

export interface ImageDocumentElement extends DocumentElement {
    image: string;
}
export interface TableDocumentElement extends DocumentElement {
    bind: string;
    columns: TableColumn[];
}
export interface TableColumn {
    headerContent: TextDocumentElement;
    cellContentWithHandlebarsRelativeToBind: TextDocumentElement;
}

export enum TargetFormat {
    HTML = 'HTML',
    PDF = 'PDF',
}

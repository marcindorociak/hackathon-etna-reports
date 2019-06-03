import * as handlebars from 'handlebars';
import { DocumentArtefact, TargetFormat } from '../document-model';

/**
 * Document generation abstract, all implementations should extend it
 */
export abstract class DocumentRenderer {

    /**
     * All calculations and preparations that are reused across various documents (parsing handlebars, creating style
     * sheets etc) should be done here.
     * @param document 
     * @param targetFormat 
     */
    constructor(protected document: DocumentArtefact, public targetFormat: TargetFormat) {

    }

    /**
     * The generation method, it results a readable stream with the file content.
     * @param data 
     */
    abstract async generate(data: object): Promise<NodeJS.ReadableStream>;

    abstract getExtension(): string;

    /**
     * Helper method to resolve handlebars
     * @param templateString 
     * @param data 
     */
    resolveHandlebars(templateString: string, data: object): string {
        const compiledTemplate = handlebars.compile(templateString);
        return compiledTemplate(data);
    }

}

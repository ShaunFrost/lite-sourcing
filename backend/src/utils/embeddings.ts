import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';
import { Product } from '../types';

let extractor: FeatureExtractionPipeline | null = null;

async function getExtractor() {
    if (!extractor) {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
}

export async function generateProductEmbedding(product: Product) {
    const text = [
        product.name,
        product.category,
        product.unitOfMeasure
    ]
    .filter(Boolean)
    .join(' ');

    const embed = await getExtractor();
    const output = await embed(text, { pooling: 'mean', normalize: true });

    return Array.from(output.data);
}

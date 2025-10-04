import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import vision from '@google-cloud/vision';

@Injectable()
export class OcrService {
  private client: any;

  constructor() {
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async extractTextFromImage(imagePath: string): Promise<any> {
    try {
      const [result] = await this.client.textDetection(imagePath);
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        return { text: '', structured: null };
      }

      const fullText = detections[0].description || '';
      const structured = this.parseReceiptData(fullText);

      return {
        text: fullText,
        structured,
        confidence: result.fullTextAnnotation?.pages?.[0]?.confidence || 0,
      };
    } catch (error) {
      throw new HttpException(
        `OCR processing failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private parseReceiptData(text: string): any {
    const lines = text.split('\n');
    const data: any = {
      merchant: null,
      date: null,
      total: null,
      items: [],
    };

    // Simple parsing logic - can be enhanced with ML
    const datePattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/;
    const amountPattern = /\$?\d+\.\d{2}/;

    lines.forEach((line, index) => {
      // First few lines usually contain merchant name
      if (index < 3 && !data.merchant && line.trim().length > 0) {
        data.merchant = line.trim();
      }

      // Look for date
      const dateMatch = line.match(datePattern);
      if (dateMatch && !data.date) {
        data.date = dateMatch[0];
      }

      // Look for total
      if (line.toLowerCase().includes('total')) {
        const amountMatch = line.match(amountPattern);
        if (amountMatch) {
          data.total = parseFloat(amountMatch[0].replace('$', ''));
        }
      }
    });

    return data;
  }
}

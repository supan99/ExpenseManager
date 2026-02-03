import { OCRResult } from '../types';
import RNFS from 'react-native-fs';
import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? '';
const OPENROUTER_API_URL =
  process.env.OPENROUTER_API_URL ??
  'https://openrouter.ai/api/v1/chat/completions';
const OCR_MODEL = process.env.OCR_MODEL ?? 'google/gemini-2.0-flash-001';

/**
 * Converts local image URI to base64 string
 * Handles file:// URIs from camera and content:// URIs from Android image picker
 */
const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    if (imageUri.startsWith('file://')) {
      const filePath = imageUri.replace('file://', '');
      return await RNFS.readFile(filePath, 'base64');
    }
    if (imageUri.startsWith('content://')) {
      const tempFilePath = `${
        RNFS.CachesDirectoryPath
      }/temp_image_${Date.now()}.jpg`;
      await RNFS.copyFile(imageUri, tempFilePath);
      const base64 = await RNFS.readFile(tempFilePath, 'base64');
      await RNFS.unlink(tempFilePath).catch(() => {});
      return base64;
    }
    return await RNFS.readFile(imageUri, 'base64');
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to process image: ${errorMessage}`);
  }
};

const getMimeType = (imageUri: string): string => {
  const lowerUri = imageUri.toLowerCase();
  if (lowerUri.includes('.jpg') || lowerUri.includes('.jpeg')) {
    return 'image/jpeg';
  }
  if (lowerUri.includes('.png')) {
    return 'image/png';
  }
  if (lowerUri.includes('.webp')) return 'image/webp';
  return 'image/jpeg';
};

const parseOpenAIResponse = (responseText: string): Partial<OCRResult> => {
  try {
    let jsonText = responseText
      .trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '');
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonText);

    return {
      amount: parsed.amount || parsed.total || parsed.totalAmount || undefined,
      date:
        parsed.date || parsed.transactionDate || parsed.billDate || undefined,
      merchant:
        parsed.merchant ||
        parsed.store ||
        parsed.vendor ||
        parsed.businessName ||
        undefined,
      category: parsed.category || parsed.expenseCategory || undefined,
      notes: parsed.notes || undefined,
    };
  } catch {
    return {
      amount: '0',
      date: '',
      merchant: '',
      category: '',
      notes: '',
    };
  }
};

export const OCRService = {
  async processImage(imageUri: string): Promise<OCRResult> {
    try {
      if (!OPENROUTER_API_KEY) {
        return {
          success: false,
          error:
            'OCR API key is not configured. Add OPENROUTER_API_KEY to .env',
        };
      }
      const base64Image = await imageToBase64(imageUri);
      const mimeType = getMimeType(imageUri);
      const prompt = `Analyze this receipt image and extract the following information in JSON format:
{
  "amount": "total amount or price (numbers only, use dot for decimal)",
  "date": "transaction date in YYYY-MM-DD format",
  "merchant": "store name or business name",
  "category": "expense category (Food, Transportation, Shopping, Utilities, Healthcare, Entertainment, Travel, Bills, Education, or Other)"
  "notes": "additional notes or comments"
}

Rules:
- If amount is not found, use empty string
- If date is not found, use empty string
- If merchant is not found, use empty string
- If category is not found, use "Other"
- Date should be in YYYY-MM-DD format (e.g., 2024-01-15)
- Amount should be numeric only (e.g., "125.50" not "₹125.50")
- Notes should be a short description of the receipt
- Return ONLY valid JSON, no additional text or explanation`;

      const requestBody = {
        model: OCR_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1024,
        temperature: 0.1,
      };

      const response = await axios.post(OPENROUTER_API_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        timeout: 30000,
      });

      const responseText = response.data?.choices?.[0]?.message?.content || '';
      if (!responseText) {
        return {
          success: false,
          error: 'No response from API. Please try again.',
        };
      }

      const extractedData = parseOpenAIResponse(responseText);

      return {
        success: true,
        amount: extractedData.amount || undefined,
        date: extractedData.date || undefined,
        merchant: extractedData.merchant || undefined,
        category: extractedData.category || undefined,
        notes: extractedData.notes || undefined,
      };
    } catch (error) {
      let errorMessage = 'OCR processing failed. Please try again.';

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data?.error;
          errorMessage = `API Error: ${error.response.status} - ${
            errorData?.message || errorData?.code || 'Unknown error'
          }`;
        } else if (error.request) {
          errorMessage =
            'Network error. Please check your internet connection.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};

import { OCRResult } from "../types";
import MlkitOcr from "react-native-mlkit-ocr";

const normalizeText = (txt: string): string => {
  return txt
    .replace(/O/g, "0")
    .replace(/l/g, "1")
    .replace(/I/g, "1")
    .replace(/\s+/g, " ");
};

const extractAmount = (txt: string): string => {
  txt = normalizeText(txt);

  const patterns = [
    /Net\s*Amount\s*[:\-]?\s*(?:Rs\.?|₹)?\s*(\d+[\.,]?\d*)/i,
    /Total\s*Sale\s*[:\-]?\s*(?:Rs\.?|₹)?\s*(\d+[\.,]?\d*)/i,
    /Sale\s*[:\-]?\s*(?:Rs\.?|₹)?\s*(\d+[\.,]?\d*)/i,
    /Amount\s*[:\-]?\s*(?:Rs\.?|₹)?\s*(\d+[\.,]?\d*)/i,
    /Rs\.?\s*(\d+[\.,]?\d*)/,
    /₹\s*(\d+[\.,]?\d*)/,
    /(\d{3,6}\.\d{2})/,
  ];

  for (const p of patterns) {
    const m = txt.match(p);
    if (m && m[1]) return m[1].replace(",", ".");
  }
  return "";
};


const extractDate = (txt: string): string => {
  txt = normalizeText(txt);
  const lines = txt.split("\n").map((l) => l.trim());
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const MIN_YEAR = currentYear - 5;
  const MAX_YEAR = currentYear + 1;

  const isValidDate = (dateStr: string): boolean => {
    let day: number, month: number, year: number;

    if (dateStr.includes("/") || dateStr.includes("-")) {
      const parts = dateStr.split(/[\/\-]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          year = parseInt(parts[0]);
          month = parseInt(parts[1]);
          day = parseInt(parts[2]);
        }
        else {
          day = parseInt(parts[0]);
          month = parseInt(parts[1]);
          year = parseInt(parts[2]);
          if (year < 100) year += 2000;

          if (day > 12 || month > 12) {
          } else {
            const date1 = new Date(year, month - 1, day);
            const date2 = new Date(year, day - 1, month);
            if (date1.getMonth() === month - 1 && date1.getDate() === day) {
              const temp = day;
              day = month;
              month = temp;
            }
          }
        }
      } else {
        return false;
      }
    } else if (dateStr.match(/\d{1,2}\s+\w+\s+\d{2,4}/)) {
      const match = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{2,4})/);
      if (!match) return false;
      day = parseInt(match[1]);
      const monthNames = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      const monthName = match[2].toLowerCase().substring(0, 3);
      month =
        monthNames.findIndex((m) => m.startsWith(monthName)) + 1;
      if (month === 0) return false;
      year = parseInt(match[3]);
      if (year < 100) year += 2000;
    } else {
      return false;
    }

    if (year < MIN_YEAR || year > MAX_YEAR) return false;

    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return false;
    }

    return true;
  };

  const hasDateLabel = (line: string): boolean => {
    const lower = line.toLowerCase();
    return /(?:^|\s)(?:date|transaction\s*date|bill\s*date|invoice\s*date)[:\-]?/i.test(
      lower
    );
  };

  const isOrderOrReference = (line: string): boolean => {
    const lower = line.toLowerCase();
    return (
      /(?:order|ref|reference|invoice\s*no|bill\s*no|receipt\s*no|tid|transaction\s*id)/i.test(
        lower
      ) && /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(lower)
    );
  };

  const handleRelativeDate = (line: string): string | null => {
    const lower = line.toLowerCase();
    if (/\b(today|now)\b/.test(lower)) {
      return `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
        currentDay
      ).padStart(2, "0")}`;
    }
    if (/\byesterday\b/.test(lower)) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return `${yesterday.getFullYear()}-${String(
        yesterday.getMonth() + 1
      ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    }
    return null;
  };

  const scoreDateMatch = (
    line: string,
    lineIndex: number,
    totalLines: number
  ): number => {
    let score = 0;

    if (hasDateLabel(line)) score += 100;

    const positionRatio = lineIndex / totalLines;
    if (positionRatio < 0.3) score += 30;
    else if (positionRatio < 0.5) score += 15;

    if (isOrderOrReference(line)) score -= 50;

    if (/\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/.test(line)) score += 20;
    if (/\d{1,2}\s+\w+\s+\d{2,4}/.test(line)) score += 15;

    return score;
  };
  for (const line of lines) {
    const relativeDate = handleRelativeDate(line);
    if (relativeDate) {
      console.log(`✅ Date extracted (relative): ${relativeDate}`);
      return relativeDate;
    }
  }

  const labeledPatterns = [
    {
      regex: /(?:Date|Transaction\s*Date|Bill\s*Date|Invoice\s*Date)[:\-]?\s*(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/i,
      format: "YYYY-MM-DD",
      priority: 100,
    },
    {
      regex: /(?:Date|Transaction\s*Date|Bill\s*Date|Invoice\s*Date)[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      format: "DD/MM/YYYY or MM/DD/YYYY",
      priority: 95,
    },
    {
      regex: /(?:Date|Transaction\s*Date|Bill\s*Date|Invoice\s*Date)[:\-]?\s*(\d{1,2}\s+\w+\s+\d{2,4})/i,
      format: "Text",
      priority: 90,
    },
  ];

  const generalPatterns = [
    {
      regex: /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
      format: "YYYY-MM-DD",
      priority: 50,
    },
    {
      regex: /(\d{1,2}\s+\w+\s+\d{2,4})/,
      format: "Text",
      priority: 40,
    },
    {
      regex: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      format: "DD/MM/YYYY or MM/DD/YYYY",
      priority: 30,
    },
  ];

  const candidates: Array<{
    date: string;
    score: number;
    format: string;
    lineIndex: number;
  }> = [];

  lines.forEach((line, lineIndex) => {
    if (isOrderOrReference(line)) return;

    labeledPatterns.forEach(({ regex, format, priority }) => {
      const match = line.match(regex);
      if (match && match[1]) {
        const dateStr = match[1];
        if (isValidDate(dateStr)) {
          const score = scoreDateMatch(line, lineIndex, lines.length) + priority;
          candidates.push({ date: dateStr, score, format, lineIndex });
        }
      }
    });
  });

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    console.log(
      `✅ Date extracted: ${best.date} (${best.format}, score: ${best.score})`
    );
    return best.date;
  }

  lines.forEach((line, lineIndex) => {
    if (isOrderOrReference(line)) return;

    generalPatterns.forEach(({ regex, format, priority }) => {
      const match = line.match(regex);
      if (match && match[1]) {
        const dateStr = match[1];
        if (isValidDate(dateStr)) {
          const score = scoreDateMatch(line, lineIndex, lines.length) + priority;
          candidates.push({ date: dateStr, score, format, lineIndex });
        }
      }
    });
  });

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    console.log(
      `✅ Date extracted (general): ${best.date} (${best.format}, score: ${best.score})`
    );
    return best.date;
  }

  console.log("❌ No valid date found");
  return "";
};

const extractMerchant = (txt: string): string => {
  const lines = txt.split("\n").map((l) => l.trim()).filter(Boolean);

  const top = lines.slice(0, 8);

  const candidates = top.filter(
    (l) =>
      /[A-Za-z]{3,}/.test(l) &&
      !/date|time|invoice|gst|tid|batch|receipt|copy/i.test(l)
  );

  if (candidates.length === 0) return "";

  return candidates.sort((a, b) => b.length - a.length)[0];
};

const extractCategory = (txt: string, merchant: string): string => {
  const lowerText = txt.toLowerCase();
  const lowerMerchant = merchant.toLowerCase();
  const categoryKeywords: { [key: string]: string[] } = {
    Food: [
      "restaurant",
      "cafe",
      "coffee",
      "pizza",
      "burger",
      "food",
      "dining",
      "bakery",
      "starbucks",
      "mcdonald",
      "kfc",
      "subway",
      "domino",
      "pizzahut",
      "grubhub",
      "ubereats",
      "doordash",
      "zomato",
      "swiggy",
      "grocery",
      "supermarket",
      "walmart",
      "target",
      "kroger",
      "safeway",
      "whole foods",
      "trader joe",
      "hotel",
      "buffet",
      "bistro",
    ],
    Transportation: [
      "uber",
      "lyft",
      "taxi",
      "cab",
      "gas",
      "petrol",
      "fuel",
      "shell",
      "bp",
      "exxon",
      "chevron",
      "mobil",
      "parking",
      "metro",
      "subway",
      "bus",
      "train",
      "airline",
      "airport",
      "flight",
      "car rental",
      "hertz",
      "avis",
      "enterprise",
      "petrol pump",
      "filling station",
      "gas station",
    ],
    Shopping: [
      "amazon",
      "ebay",
      "walmart",
      "target",
      "best buy",
      "costco",
      "ikea",
      "home depot",
      "lowes",
      "nike",
      "adidas",
      "mall",
      "store",
      "retail",
      "shop",
      "marketplace",
      "flipkart",
      "myntra",
      "ajio",
    ],
    Utilities: [
      "electric",
      "water",
      "gas bill",
      "internet",
      "phone",
      "mobile",
      "verizon",
      "at&t",
      "t-mobile",
      "sprint",
      "cable",
      "tv",
      "utility",
      "power",
      "internet service",
      "broadband",
      "bsnl",
      "airtel",
      "jio",
      "vodafone",
    ],
    Healthcare: [
      "pharmacy",
      "drugstore",
      "cvs",
      "walgreens",
      "rite aid",
      "hospital",
      "clinic",
      "doctor",
      "medical",
      "dental",
      "medicine",
      "prescription",
      "health",
      "apollo",
      "max",
      "fortis",
    ],
    Entertainment: [
      "cinema",
      "movie",
      "theater",
      "netflix",
      "spotify",
      "apple music",
      "youtube",
      "disney",
      "hulu",
      "amazon prime",
      "game",
      "gaming",
      "playstation",
      "xbox",
      "nintendo",
      "concert",
      "event",
      "ticket",
      "pvr",
      "inox",
    ],
    Travel: [
      "hotel",
      "booking",
      "airbnb",
      "expedia",
      "priceline",
      "travel",
      "trip",
      "vacation",
      "resort",
      "marriott",
      "hilton",
      "hyatt",
      "makemytrip",
      "goibibo",
      "yatra",
    ],
    Bills: [
      "bill",
      "invoice",
      "payment",
      "subscription",
      "membership",
      "recurring",
      "monthly",
      "annual",
    ],
    Education: [
      "school",
      "university",
      "college",
      "tuition",
      "course",
      "education",
      "bookstore",
      "textbook",
      "learning",
    ],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerMerchant.includes(keyword)) {
        return category;
      }
    }
  }

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return category;
      }
    }
  }

  return "Other";
};

export const OCRService = {
  async processImage(imageUri: string): Promise<OCRResult> {
    try {
      const detected = await MlkitOcr.detectFromUri(imageUri);

      if (!detected || detected.length === 0) {
        return {
          success: false,
          error:
            "No text was detected. Please ensure the receipt is clear and try again.",
        };
      }

      const fullText = detected.map((d) => d.text).join("\n");
      const cleaned = normalizeText(fullText);

      console.log("🔍 OCR RAW:", fullText);
      console.log("🔧 OCR CLEAN:", cleaned);

      const amount = extractAmount(cleaned);
      const date = extractDate(cleaned);
      const merchant = extractMerchant(fullText);
      const category = extractCategory(fullText, merchant);

      return {
        success: true,
        amount: amount || undefined,
        date: date || undefined,
        merchant: merchant || undefined,
        category: category || undefined,
      };
    } catch (error) {
      console.error("OCR Error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "OCR processing failed. Please try again.",
      };
    }
  },
};

// English Affix Data for Word Analysis
export interface AffixData {
  prefixes: AffixItem[]
  roots: AffixItem[]
  suffixes: AffixItem[]
}

export interface AffixItem {
  affix: string
  meaning: string
  variants?: string[] // Alternative forms (e.g., in-/im-/il-/ir-)
}

export interface WordAnalysis {
  word: string
  prefix?: AffixItem
  root?: AffixItem
  suffix?: AffixItem
  breakdown: string[] // ["un", "act", "ive"] for "unactive"
}

export const AFFIX_DATA: AffixData = {
  prefixes: [
    { affix: "un-", meaning: "not" },
    { affix: "in-", meaning: "not", variants: ["im-", "il-", "ir-"] },
    { affix: "dis-", meaning: "not/opposite" },
    { affix: "re-", meaning: "again" },
    { affix: "de-", meaning: "remove/reverse" },
    { affix: "inter-", meaning: "between" },
    { affix: "sub-", meaning: "under" },
    { affix: "super-", meaning: "above" },
    { affix: "trans-", meaning: "across" },
    { affix: "pre-", meaning: "before" },
    { affix: "post-", meaning: "after" },
    { affix: "mono-", meaning: "one" },
    { affix: "bi-", meaning: "two" },
    { affix: "multi-", meaning: "many" },
    { affix: "over-", meaning: "excessive" },
    { affix: "under-", meaning: "insufficient" }
  ],
  roots: [
    { affix: "act", meaning: "do" },
    { affix: "duc", meaning: "lead", variants: ["duct"] },
    { affix: "fac", meaning: "make", variants: ["fact"] },
    { affix: "fer", meaning: "carry" },
    { affix: "mit", meaning: "send", variants: ["miss"] },
    { affix: "scrib", meaning: "write", variants: ["script"] },
    { affix: "dic", meaning: "say", variants: ["dict"] },
    { affix: "vid", meaning: "see", variants: ["vis"] },
    { affix: "cap", meaning: "take", variants: ["cept"] },
    { affix: "cog", meaning: "know", variants: ["gno"] },
    { affix: "struct", meaning: "build" },
    { affix: "port", meaning: "carry" },
    { affix: "grad", meaning: "step/go", variants: ["gress"] },
    { affix: "form", meaning: "shape" },
    { affix: "temp", meaning: "time" },
    { affix: "loc", meaning: "place" },
    { affix: "bio", meaning: "life" },
    { affix: "therm", meaning: "heat" },
    { affix: "photo", meaning: "light" },
    { affix: "geo", meaning: "earth" }
  ],
  suffixes: [
    { affix: "-tion", meaning: "noun/action", variants: ["-sion"] },
    { affix: "-ment", meaning: "noun/result" },
    { affix: "-ity", meaning: "noun/quality" },
    { affix: "-ness", meaning: "noun/state" },
    { affix: "-er", meaning: "person", variants: ["-or"] },
    { affix: "-ist", meaning: "specialist" },
    { affix: "-able", meaning: "adjective/capable", variants: ["-ible"] },
    { affix: "-ive", meaning: "adjective/quality" },
    { affix: "-al", meaning: "adjective/related to" },
    { affix: "-ous", meaning: "adjective/full of" },
    { affix: "-ly", meaning: "adverb" },
    { affix: "-ize", meaning: "verb/make", variants: ["-ise"] },
    { affix: "-ify", meaning: "verb/make" },
    { affix: "-en", meaning: "verb/make" }
  ]
}
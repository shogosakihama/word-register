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
    { affix: "non-", meaning: "not" },
    { affix: "dis-", meaning: "not/opposite" },
    { affix: "a-", meaning: "without" },
    { affix: "anti-", meaning: "against" },
    { affix: "counter-", meaning: "against" },
    { affix: "re-", meaning: "again" },
    { affix: "de-", meaning: "remove/reverse" },
    { affix: "en-", meaning: "make", variants: ["em-"] },
    { affix: "inter-", meaning: "between" },
    { affix: "intra-", meaning: "within" },
    { affix: "sub-", meaning: "under" },
    { affix: "super-", meaning: "above" },
    { affix: "over-", meaning: "excessive" },
    { affix: "under-", meaning: "insufficient" },
    { affix: "trans-", meaning: "across" },
    { affix: "circum-", meaning: "around" },
    { affix: "peri-", meaning: "around" },
    { affix: "extra-", meaning: "outside" },
    { affix: "pre-", meaning: "before" },
    { affix: "post-", meaning: "after" },
    { affix: "fore-", meaning: "before" },
    { affix: "retro-", meaning: "backward" },
    { affix: "mono-", meaning: "one" },
    { affix: "uni-", meaning: "one" },
    { affix: "bi-", meaning: "two" },
    { affix: "di-", meaning: "two" },
    { affix: "tri-", meaning: "three" },
    { affix: "multi-", meaning: "many" },
    { affix: "poly-", meaning: "many" },
    { affix: "semi-", meaning: "half" },
    { affix: "hyper-", meaning: "over/excessive" },
    { affix: "hypo-", meaning: "under/less" },
    { affix: "micro-", meaning: "small" },
    { affix: "macro-", meaning: "large" }
  ],
  roots: [
    { affix: "act", meaning: "do" },
    { affix: "ag", meaning: "do" },
    { affix: "duc", meaning: "lead", variants: ["duct"] },
    { affix: "fac", meaning: "make", variants: ["fact", "fic"] },
    { affix: "fer", meaning: "carry" },
    { affix: "mit", meaning: "send", variants: ["miss"] },
    { affix: "ject", meaning: "throw" },
    { affix: "tract", meaning: "pull" },
    { affix: "vert", meaning: "turn", variants: ["vers"] },
    { affix: "mov", meaning: "move", variants: ["mot"] },
    { affix: "ced", meaning: "go", variants: ["ceed", "cess"] },
    { affix: "grad", meaning: "step/go", variants: ["gress"] },
    { affix: "cap", meaning: "take", variants: ["capt", "cept"] },
    { affix: "scrib", meaning: "write", variants: ["script"] },
    { affix: "graph", meaning: "write/draw" },
    { affix: "dic", meaning: "say", variants: ["dict"] },
    { affix: "log", meaning: "word/study", variants: ["logy"] },
    { affix: "phon", meaning: "sound" },
    { affix: "voc", meaning: "voice/call", variants: ["vok"] },
    { affix: "vid", meaning: "see", variants: ["vis"] },
    { affix: "spect", meaning: "see" },
    { affix: "aud", meaning: "hear" },
    { affix: "sens", meaning: "feel" },
    { affix: "tact", meaning: "touch" },
    { affix: "cog", meaning: "know", variants: ["gno"] },
    { affix: "sci", meaning: "know" },
    { affix: "cred", meaning: "believe" },
    { affix: "doc", meaning: "teach", variants: ["doct"] },
    { affix: "mem", meaning: "remember" },
    { affix: "struct", meaning: "build" },
    { affix: "form", meaning: "shape" },
    { affix: "gen", meaning: "birth/origin" },
    { affix: "cre", meaning: "create" },
    { affix: "reg", meaning: "rule" },
    { affix: "jur", meaning: "law", variants: ["jus"] },
    { affix: "leg", meaning: "law" },
    { affix: "civ", meaning: "citizen" },
    { affix: "soci", meaning: "companion" },
    { affix: "demo", meaning: "people" },
    { affix: "bio", meaning: "life" },
    { affix: "psych", meaning: "mind" },
    { affix: "path", meaning: "disease/feeling" },
    { affix: "therm", meaning: "heat" },
    { affix: "photo", meaning: "light" },
    { affix: "geo", meaning: "earth" },
    { affix: "hydro", meaning: "water" },
    { affix: "aero", meaning: "air" },
    { affix: "chron", meaning: "time" },
    { affix: "temp", meaning: "time" },
    { affix: "loc", meaning: "place" },
    { affix: "port", meaning: "carry" },
    { affix: "magn", meaning: "great" },
    { affix: "brev", meaning: "short" },
    { affix: "mort", meaning: "death" },
    { affix: "viv", meaning: "live" },
    { affix: "vac", meaning: "empty" },
    { affix: "plen", meaning: "full" }
  ],
  suffixes: [
    { affix: "-tion", meaning: "noun/action", variants: ["-sion"] },
    { affix: "-ment", meaning: "noun/result" },
    { affix: "-ity", meaning: "noun/quality" },
    { affix: "-ness", meaning: "noun/state" },
    { affix: "-ance", meaning: "noun/state", variants: ["-ence"] },
    { affix: "-al", meaning: "noun/process" },
    { affix: "-ure", meaning: "noun/result" },
    { affix: "-ship", meaning: "noun/status" },
    { affix: "-dom", meaning: "noun/state" },
    { affix: "-hood", meaning: "noun/state" },
    { affix: "-er", meaning: "person", variants: ["-or"] },
    { affix: "-ist", meaning: "specialist" },
    { affix: "-ian", meaning: "specialist" },
    { affix: "-ant", meaning: "person", variants: ["-ent"] },
    { affix: "-able", meaning: "adjective/capable", variants: ["-ible"] },
    { affix: "-ive", meaning: "adjective/quality" },
    { affix: "-al", meaning: "adjective/related to" },
    { affix: "-ous", meaning: "adjective/full of", variants: ["-eous"] },
    { affix: "-ic", meaning: "adjective/related to" },
    { affix: "-ary", meaning: "adjective/related to" },
    { affix: "-less", meaning: "adjective/without" },
    { affix: "-like", meaning: "adjective/similar" },
    { affix: "-ish", meaning: "adjective/somewhat" },
    { affix: "-ly", meaning: "adverb" },
    { affix: "-ward", meaning: "direction", variants: ["-wards"] },
    { affix: "-ize", meaning: "verb/make", variants: ["-ise"] },
    { affix: "-ify", meaning: "verb/make" },
    { affix: "-en", meaning: "verb/make" },
    { affix: "-ate", meaning: "verb/make" }
  ]
}
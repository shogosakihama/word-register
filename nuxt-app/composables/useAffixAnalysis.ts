import { AFFIX_DATA, type WordAnalysis, type AffixItem } from '../data/affixData'

/**
 * Composable for analyzing English words for affix patterns
 * 英単語のaffix（接頭辞・語根・接尾辞）パターンを解析するComposable
 */
export const useAffixAnalysis = () => {
  
  /**
   * Analyze a word for prefix, root, and suffix patterns
   * 単語を解析して接頭辞・語根・接尾辞のパターンを特定
   */
  const analyzeWord = (word: string): WordAnalysis | null => {
    if (!word || word.length < 3) return null
    
    const cleanWord = word.toLowerCase().trim()
    const analysis: WordAnalysis = {
      word: cleanWord,
      breakdown: []
    }
    
    let remainingWord = cleanWord
    let startIndex = 0
    
    // 1. Check for prefix
    const prefix = findPrefix(remainingWord)
    if (prefix) {
      analysis.prefix = prefix
      const prefixMatch = getPrefixMatch(remainingWord, prefix)
      if (prefixMatch) {
        analysis.breakdown.push(prefixMatch)
        remainingWord = remainingWord.substring(prefixMatch.length)
        startIndex = prefixMatch.length
      }
    }
    
    // 2. Check for suffix (from the end)
    const suffix = findSuffix(remainingWord)
    let suffixLength = 0
    if (suffix) {
      analysis.suffix = suffix
      const suffixMatch = getSuffixMatch(remainingWord, suffix)
      if (suffixMatch) {
        suffixLength = suffixMatch.length
        analysis.breakdown.push(suffixMatch)
        remainingWord = remainingWord.substring(0, remainingWord.length - suffixLength)
      }
    }
    
    // 3. Check for root in the remaining middle part
    if (remainingWord.length >= 2) {
      const root = findRoot(remainingWord)
      if (root) {
        analysis.root = root
        analysis.breakdown.splice(analysis.breakdown.length - (suffix ? 1 : 0), 0, remainingWord)
      } else {
        // No specific root found, but include the remaining part
        analysis.breakdown.splice(analysis.breakdown.length - (suffix ? 1 : 0), 0, remainingWord)
      }
    }
    
    return analysis.breakdown.length > 0 ? analysis : null
  }
  
  /**
   * Find matching prefix in the word
   */
  const findPrefix = (word: string): AffixItem | null => {
    for (const prefix of AFFIX_DATA.prefixes) {
      // Check main form
      const mainForm = prefix.affix.replace('-', '')
      if (word.startsWith(mainForm) && word.length > mainForm.length) {
        return prefix
      }
      
      // Check variants
      if (prefix.variants) {
        for (const variant of prefix.variants) {
          const variantForm = variant.replace('-', '')
          if (word.startsWith(variantForm) && word.length > variantForm.length) {
            return prefix
          }
        }
      }
    }
    return null
  }
  
  /**
   * Find matching suffix in the word
   */
  const findSuffix = (word: string): AffixItem | null => {
    for (const suffix of AFFIX_DATA.suffixes) {
      // Check main form
      const mainForm = suffix.affix.replace('-', '')
      if (word.endsWith(mainForm) && word.length > mainForm.length) {
        return suffix
      }
      
      // Check variants
      if (suffix.variants) {
        for (const variant of suffix.variants) {
          const variantForm = variant.replace('-', '')
          if (word.endsWith(variantForm) && word.length > variantForm.length) {
            return suffix
          }
        }
      }
    }
    return null
  }
  
  /**
   * Find matching root in the word
   */
  const findRoot = (word: string): AffixItem | null => {
    for (const root of AFFIX_DATA.roots) {
      // Check main form
      if (word.includes(root.affix)) {
        return root
      }
      
      // Check variants
      if (root.variants) {
        for (const variant of root.variants) {
          if (word.includes(variant)) {
            return root
          }
        }
      }
    }
    return null
  }
  
  /**
   * Get the actual prefix match from the word
   */
  const getPrefixMatch = (word: string, prefix: AffixItem): string | null => {
    const mainForm = prefix.affix.replace('-', '')
    if (word.startsWith(mainForm)) {
      return mainForm
    }
    
    if (prefix.variants) {
      for (const variant of prefix.variants) {
        const variantForm = variant.replace('-', '')
        if (word.startsWith(variantForm)) {
          return variantForm
        }
      }
    }
    
    return null
  }
  
  /**
   * Get the actual suffix match from the word
   */
  const getSuffixMatch = (word: string, suffix: AffixItem): string | null => {
    const mainForm = suffix.affix.replace('-', '')
    if (word.endsWith(mainForm)) {
      return mainForm
    }
    
    if (suffix.variants) {
      for (const variant of suffix.variants) {
        const variantForm = variant.replace('-', '')
        if (word.endsWith(variantForm)) {
          return variantForm
        }
      }
    }
    
    return null
  }
  
  /**
   * Format analysis result for display
   * 解析結果を表示用にフォーマット
   */
  const formatAnalysis = (analysis: WordAnalysis): string => {
    const parts: string[] = []
    
    if (analysis.prefix) {
      parts.push(`${analysis.prefix.affix} (${analysis.prefix.meaning})`)
    }
    if (analysis.root) {
      parts.push(`${analysis.root.affix} (${analysis.root.meaning})`)
    }
    if (analysis.suffix) {
      parts.push(`${analysis.suffix.affix} (${analysis.suffix.meaning})`)
    }
    
    return parts.join(' + ')
  }
  
  /**
   * Get breakdown visualization
   * 分解の可視化を取得
   */
  const getBreakdownVisualization = (analysis: WordAnalysis): string => {
    return analysis.breakdown.join(' | ')
  }
  
  return {
    analyzeWord,
    formatAnalysis,
    getBreakdownVisualization
  }
}
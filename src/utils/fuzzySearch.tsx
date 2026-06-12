import React from 'react';

/**
 * Performs a subsequence-based fuzzy match check.
 * Returns a score (higher is better) where 0 means no match.
 */
export function fuzzyMatch(query: string, target: string): number {
  if (!query) return 1;
  const qObj = query.toLowerCase().trim();
  const tObj = target.toLowerCase();

  // Direct substring matches get an initial major boost
  if (tObj.includes(qObj)) {
    // Higher boost if the exact match occurs earlier in the string
    return 1000 - tObj.indexOf(qObj);
  }

  let qIdx = 0;
  let tIdx = 0;
  let consecutiveMatches = 0;
  let score = 0;

  while (qIdx < qObj.length && tIdx < tObj.length) {
    if (qObj[qIdx] === tObj[tIdx]) {
      // Subsequence match found
      score += 10;
      consecutiveMatches++;
      score += consecutiveMatches * 5; // Reward consecutive matches

      // Reward matches that start a word/tag boundary
      if (tIdx === 0 || tObj[tIdx - 1] === ' ' || tObj[tIdx - 1] === '-' || tObj[tIdx - 1] === '/') {
        score += 25;
      }

      qIdx++;
    } else {
      consecutiveMatches = 0;
    }
    tIdx++;
  }

  // It's a match only if all characters of the query are found in order
  if (qIdx === qObj.length) {
    return score;
  }

  return 0;
}

/**
 * Aggregates match scores across multiple fields of an event.
 * Returns a score > 0 if there is any fuzzy match, otherwise 0.
 */
export function getFuzzyEventScore(event: { title: string; tagline: string; techKeywords: string[]; description?: string }, query: string): number {
  if (!query) return 1;

  const titleScore = fuzzyMatch(query, event.title) * 3.0;
  const taglineScore = fuzzyMatch(query, event.tagline) * 1.5;
  
  let keywordScore = 0;
  if (event.techKeywords && Array.isArray(event.techKeywords)) {
    event.techKeywords.forEach((kw) => {
      keywordScore = Math.max(keywordScore, fuzzyMatch(query, kw) * 2.0);
    });
  }

  const descScore = event.description ? fuzzyMatch(query, event.description) * 0.5 : 0;

  return Math.max(titleScore, taglineScore, keywordScore, descScore);
}

/**
 * Returns a React elements node with highlighted matching characters for subsequence searches.
 */
export function highlightFuzzyMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const q = query.toLowerCase().trim();
  const tLower = text.toLowerCase();

  // 1. Direct Substring Highlight (for cleanest visual representation when exact parts match)
  const exactIndex = tLower.indexOf(q);
  if (exactIndex !== -1) {
    const before = text.substring(0, exactIndex);
    const match = text.substring(exactIndex, exactIndex + q.length);
    const after = text.substring(exactIndex + q.length);

    return (
      <>
        {before}
        <span className="text-cyan-400 font-extrabold bg-cyan-950/50 px-0.5 rounded border-b border-cyan-400/80 animate-pulse">
          {match}
        </span>
        {after}
      </>
    );
  }

  // 2. Subsequence Highlight (Fuzzy character index tracking)
  const result: React.ReactNode[] = [];
  let qIdx = 0;
  let lastIdx = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charLower = char.toLowerCase();

    if (qIdx < q.length && charLower === q[qIdx]) {
      // Append unmatched buffer
      if (i > lastIdx) {
        result.push(text.substring(lastIdx, i));
      }
      // Highlight single matching char
      result.push(
        <span key={i} className="text-cyan-400 font-extrabold bg-cyan-950/50 px-0.5 rounded border-b border-cyan-400/80 animate-pulse">
          {char}
        </span>
      );
      qIdx++;
      lastIdx = i + 1;
    }
  }

  if (lastIdx < text.length) {
    result.push(text.substring(lastIdx));
  }

  // Only return highlights if we successfully matched the full query sequence in this text
  if (qIdx === q.length) {
    return <>{result}</>;
  }

  return text;
}

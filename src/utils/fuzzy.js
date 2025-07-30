import Fuse from 'fuse.js';

// Original fuzzy search for general searching
export function fuzzySearch(query, records, keys = ['first_name','last_name','last_known_location']) {
  const fuse = new Fuse(records, { keys, threshold: 0.3 });
  return fuse.search(query).map(r => r.item);
}

// 3-Tier Deduplication System
export function checkForDuplicates(newReport, existingReports) {
  // Tier 1: Exact Hash Match (100% identity)
  const tier1Match = findTier1Match(newReport, existingReports);
  if (tier1Match) {
    return {
      tier: 1,
      match: tier1Match,
      confidence: 1.0,
      action: 'block',
      message: 'A record for this individual has already been created. Check back for updated status if they have marked themselves safe.'
    };
  }

  // Tier 2: Strong Partial Match (very likely duplicate)
  const tier2Match = findTier2Match(newReport, existingReports);
  if (tier2Match) {
    return {
      tier: 2,
      match: tier2Match,
      confidence: tier2Match.confidence,
      action: 'confirm',
      message: `We found a similar record for ${tier2Match.first_name} ${tier2Match.last_name} (${Math.round(tier2Match.confidence * 100)}% match). Please confirm if this is the same person or add more details.`
    };
  }

  // Tier 3: Loose Fuzzy Match (possible match)
  const tier3Match = findTier3Match(newReport, existingReports);
  if (tier3Match) {
    return {
      tier: 3,
      match: tier3Match,
      confidence: tier3Match.confidence,
      action: 'warn',
      message: `This may be a match for ${tier3Match.first_name} ${tier3Match.last_name} (${Math.round(tier3Match.confidence * 100)}% similar). Proceed with caution.`
    };
  }

  return null; // No duplicates found
}

// Tier 1: Exact Hash Match
function findTier1Match(newReport, existingReports) {
  return existingReports.find(r => 
    r.dob_hash === newReport.dob_hash &&
    r.ssn4_hash === newReport.ssn4_hash &&
    r.last_name.toLowerCase() === newReport.last_name.toLowerCase()
  );
}

// Tier 2: Strong Partial Match
function findTier2Match(newReport, existingReports) {
  for (const report of existingReports) {
    if (
      report.dob_hash === newReport.dob_hash &&
      report.last_known_location.toLowerCase() === newReport.last_known_location.toLowerCase() &&
      report.last_name.toLowerCase() === newReport.last_name.toLowerCase()
    ) {
      const firstNameSimilarity = calculateSimilarity(report.first_name, newReport.first_name);
      if (firstNameSimilarity > 0.9) {
        return {
          ...report,
          confidence: firstNameSimilarity
        };
      }
    }
  }
  return null;
}

// Tier 3: Loose Fuzzy Match
function findTier3Match(newReport, existingReports) {
  const newFullName = `${newReport.first_name} ${newReport.last_name}`;
  let bestMatch = null;
  let bestScore = 0;

  for (const report of existingReports) {
    const existingFullName = `${report.first_name} ${report.last_name}`;
    const similarity = calculateSimilarity(existingFullName, newFullName);
    
    if (similarity > 0.85 && similarity > bestScore) {
      bestMatch = {
        ...report,
        confidence: similarity
      };
      bestScore = similarity;
    }
  }

  return bestMatch;
}

// Calculate string similarity using Levenshtein distance
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}


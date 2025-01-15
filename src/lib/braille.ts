// Braille patterns represented as dot positions (1-6)
export type BraillePattern = number[];

export interface BrailleCharacter {
  char: string;
  pattern: BraillePattern;
  audio?: string;
}

// Standard English Braille alphabet
export const brailleAlphabet: BrailleCharacter[] = [
  { char: 'a', pattern: [1] },
  { char: 'b', pattern: [1, 2] },
  { char: 'c', pattern: [1, 4] },
  { char: 'd', pattern: [1, 4, 5] },
  { char: 'e', pattern: [1, 5] },
  { char: 'f', pattern: [1, 2, 4] },
  { char: 'g', pattern: [1, 2, 4, 5] },
  { char: 'h', pattern: [1, 2, 5] },
  { char: 'i', pattern: [2, 4] },
  { char: 'j', pattern: [2, 4, 5] },
  { char: 'k', pattern: [1, 3] },
  { char: 'l', pattern: [1, 2, 3] },
  { char: 'm', pattern: [1, 3, 4] },
  { char: 'n', pattern: [1, 3, 4, 5] },
  { char: 'o', pattern: [1, 3, 5] },
  { char: 'p', pattern: [1, 2, 3, 4] },
  { char: 'q', pattern: [1, 2, 3, 4, 5] },
  { char: 'r', pattern: [1, 2, 3, 5] },
  { char: 's', pattern: [2, 3, 4] },
  { char: 't', pattern: [2, 3, 4, 5] },
  { char: 'u', pattern: [1, 3, 6] },
  { char: 'v', pattern: [1, 2, 3, 6] },
  { char: 'w', pattern: [2, 4, 5, 6] },
  { char: 'x', pattern: [1, 3, 4, 6] },
  { char: 'y', pattern: [1, 3, 4, 5, 6] },
  { char: 'z', pattern: [1, 3, 5, 6] }
];

export const brailleNumbers: BrailleCharacter[] = [
  { char: '1', pattern: [1] },
  { char: '2', pattern: [1, 2] },
  { char: '3', pattern: [1, 4] },
  { char: '4', pattern: [1, 4, 5] },
  { char: '5', pattern: [1, 5] },
  { char: '6', pattern: [1, 2, 4] },
  { char: '7', pattern: [1, 2, 4, 5] },
  { char: '8', pattern: [1, 2, 5] },
  { char: '9', pattern: [2, 4] },
  { char: '0', pattern: [2, 4, 5] }
];

export const braillePunctuation: BrailleCharacter[] = [
  { char: '.', pattern: [2, 5, 6] },
  { char: ',', pattern: [2] },
  { char: '?', pattern: [2, 3, 6] },
  { char: '!', pattern: [2, 3, 5] },
  { char: "'", pattern: [3] },
  { char: '-', pattern: [3, 6] }
];

// Convert text to Braille patterns
export const textToBraille = (text: string): BrailleCharacter[] => {
  const chars = text.toLowerCase().split('');
  return chars.map(char => {
    const found = [...brailleAlphabet, ...brailleNumbers, ...braillePunctuation]
      .find(b => b.char === char);
    return found || { char: ' ', pattern: [] };
  });
};

// Check if a pattern matches a character
export const checkPattern = (pattern: BraillePattern, character: BrailleCharacter): boolean => {
  if (pattern.length !== character.pattern.length) return false;
  return pattern.every(dot => character.pattern.includes(dot));
};
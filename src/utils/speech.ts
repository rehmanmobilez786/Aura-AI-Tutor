// Utility for text-to-speech audio synthesis with fallback support

export function playTextToSpeech(text: string, language: string = 'English', onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language codes
  const langMap: Record<string, string> = {
    'English': 'en-US',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'Hindi': 'hi-IN',
    'Mandarin': 'zh-CN',
    'Arabic': 'ar-SA',
    'German': 'de-DE',
    'Japanese': 'ja-JP'
  };

  utterance.lang = langMap[language] || 'en-US';
  utterance.rate = 0.95; // slightly relaxed pace for educational clarity
  utterance.pitch = 1.05; // warm encouraging pitch

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopTextToSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

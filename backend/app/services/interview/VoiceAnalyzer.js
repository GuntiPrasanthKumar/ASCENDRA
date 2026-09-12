const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'sort of', 'kind of'];

class VoiceAnalyzer {
  analyzeSpeech(transcript = '', durationSeconds = 30) {
    const text = (transcript || '').trim();
    if (!text) {
      return {
        wpm: 0,
        fillerWords: [],
        fillerCount: 0,
        fluencyScore: 50,
        wordCount: 0
      };
    }

    const words = text.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const minutes = Math.max(0.1, durationSeconds / 60);
    const wpm = Math.round(wordCount / minutes);

    const foundFillers = [];
    words.forEach(w => {
      const clean = w.replace(/[^a-z]/g, '');
      if (FILLER_WORDS.includes(clean)) {
        foundFillers.push(clean);
      }
    });

    const fillerRatio = foundFillers.length / Math.max(1, wordCount);
    let fluencyScore = 100 - Math.round(fillerRatio * 200);

    // WPM ideal range: 120 - 160 WPM
    if (wpm < 90 || wpm > 180) fluencyScore -= 15;

    return {
      wpm,
      fillerWords: foundFillers,
      fillerCount: foundFillers.length,
      fluencyScore: Math.max(30, Math.min(100, fluencyScore)),
      wordCount
    };
  }
}

module.exports = new VoiceAnalyzer();

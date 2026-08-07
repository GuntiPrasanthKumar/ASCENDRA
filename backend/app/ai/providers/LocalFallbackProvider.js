class LocalFallbackProvider {
  constructor() {
    this.name = 'local_fallback';
    this.modelName = 'ascendra-heuristic-v1';
  }

  isAvailable() {
    return true; // Always available fallback
  }

  async generate(prompt, isJson = false) {
    const startTime = Date.now();
    
    if (isJson) {
      if (prompt.includes('subtopics') || prompt.includes('domain')) {
        const text = JSON.stringify({
          domain: "Computer Science & Software Engineering",
          subtopics: [
            "Data Structures & Algorithms",
            "System Design & Architecture",
            "Database Indexing & Querying",
            "Asynchronous Event Loops",
            "Network Security Protocols",
            "CI/CD Deployment Pipelines"
          ]
        });
        return { text, latencyMs: Date.now() - startTime, model: this.modelName, provider: this.name };
      }

      if (prompt.includes('recommendedPathways')) {
        const text = JSON.stringify({
          recommendedPathways: [
            { title: "Advanced Dynamic Programming", reason: "Targeting weak recursion optimization scores", priority: "HIGH", estimatedMinutes: 25 },
            { title: "System Architecture & API Design", reason: "Consolidate full-stack backend skills", priority: "MEDIUM", estimatedMinutes: 20 }
          ],
          focusGap: "Recursion & Memoization optimization",
          suggestedPractice: "CodeLab Challenge #104: Coin Change DP"
        });
        return { text, latencyMs: Date.now() - startTime, model: this.modelName, provider: this.name };
      }

      // Default Question Set JSON fallback
      const text = JSON.stringify([
        {
          type: "multiple_choice",
          text: "What is the worst-case time complexity of QuickSort?",
          options: ["O(n log n)", "O(n^2)", "O(n)", "O(1)"],
          correctOptionIndex: 1,
          bloomsLevel: "Remember",
          explanation: "QuickSort exhibits O(n^2) worst-case time complexity when pivot selection repeatedly splits into unbalanced partitions."
        },
        {
          type: "fill_in_the_blanks",
          text: "A technique that avoids recomputing subproblems by storing past results is called ___.",
          correctAnswer: "Memoization",
          bloomsLevel: "Understand",
          explanation: "Memoization stores intermediate function call outputs in a cache table."
        }
      ]);
      return { text, latencyMs: Date.now() - startTime, model: this.modelName, provider: this.name };
    }

    const text = `I am your **ASCENDRA AI Tutor**. Here is a high-level summary to help you master this concept:

1. **Core Concept**: Break complex problems into smaller subproblems.
2. **Best Practice**: Verify base conditions and handle edge cases first.
3. **Next Step**: Try solving a related practice challenge in CodeLab!`;

    return {
      text,
      latencyMs: Date.now() - startTime,
      model: this.modelName,
      provider: this.name
    };
  }
}

module.exports = new LocalFallbackProvider();

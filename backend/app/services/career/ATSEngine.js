const HIGH_IMPACT_KEYWORDS = [
  'React', 'Node.js', 'TypeScript', 'Python', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'MongoDB', 'PostgreSQL', 'CI/CD', 'AWS',
  'System Design', 'Algorithms', 'Microservices', 'Git', 'Agile'
];

class ATSEngine {
  evaluateResume(resumeText = '', targetRole = 'Full Stack Engineer') {
    const text = (resumeText || '').toLowerCase();
    const matched = [];
    const missing = [];

    HIGH_IMPACT_KEYWORDS.forEach(kw => {
      if (text.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const keywordScore = Math.round((matched.length / HIGH_IMPACT_KEYWORDS.length) * 100);
    const lengthScore = text.length > 300 ? 95 : 60;
    const structureScore = (text.includes('experience') || text.includes('education') || text.includes('skills')) ? 90 : 70;

    const overallAtsScore = Math.min(100, Math.round((keywordScore * 0.5) + (lengthScore * 0.25) + (structureScore * 0.25)));

    return {
      atsScore: Math.max(50, overallAtsScore),
      targetRole,
      keywordsMatched: matched,
      missingKeywords: missing.slice(0, 5),
      formattingRating: overallAtsScore >= 80 ? 'EXCELLENT' : 'GOOD',
      recommendations: [
        `Add missing industry keywords: ${missing.slice(0, 3).join(', ')}`,
        'Ensure contact information and section headers use standard H2 font styling',
        'Quantify achievements with concrete percentages and performance metrics'
      ]
    };
  }
}

module.exports = new ATSEngine();

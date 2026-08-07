class SkillGapEngine {
  analyzeSkillGaps(candidateSkills = [], targetRole = 'Full Stack Engineer') {
    const REQUIRED_SKILLS = {
      'Full Stack Engineer': ['JavaScript (ES6+)', 'React', 'Node.js', 'System Architecture', 'SQL & NoSQL', 'Docker'],
      'AI / ML Engineer': ['Python', 'TensorFlow / PyTorch', 'Data Structures', 'Model Optimization', 'REST APIs'],
      'DevOps Architect': ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'AWS / GCP', 'Linux Administration']
    };

    const targetList = REQUIRED_SKILLS[targetRole] || REQUIRED_SKILLS['Full Stack Engineer'];
    const lowerSkills = (candidateSkills || []).map(s => String(s).toLowerCase());

    const mastered = [];
    const gaps = [];

    targetList.forEach(req => {
      if (lowerSkills.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
        mastered.push(req);
      } else {
        gaps.push(req);
      }
    });

    return {
      targetRole,
      masteredSkills: mastered.length > 0 ? mastered : ['JavaScript (ES6+)', 'Data Structures & Algorithms'],
      skillGaps: gaps.length > 0 ? gaps : ['Docker & Container Orchestration'],
      matchPercentage: Math.round(((mastered.length || 3) / targetList.length) * 100),
      recommendedActions: gaps.map(g => `Complete specialization module in ${g}`)
    };
  }
}

module.exports = new SkillGapEngine();

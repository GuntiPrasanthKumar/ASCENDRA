class ReadinessEngine {
  calculateReadiness({ technicalScore = 85, communicationScore = 85, problemSolvingScore = 85 }) {
    // Weighted Readiness Formula: 45% Tech + 35% Comm + 20% Problem Solving
    const readinessScore = Math.round(
      (technicalScore * 0.45) + 
      (communicationScore * 0.35) + 
      (problemSolvingScore * 0.20)
    );

    let readinessBadge = 'INDUSTRY_READY';
    if (readinessScore >= 85) {
      readinessBadge = 'TIER_1_READY';
    } else if (readinessScore < 70) {
      readinessBadge = 'DEVELOPING';
    }

    return {
      readinessScore,
      readinessBadge,
      breakdown: {
        technicalWeight: Math.round(technicalScore * 0.45),
        communicationWeight: Math.round(communicationScore * 0.35),
        problemSolvingWeight: Math.round(problemSolvingScore * 0.20)
      }
    };
  }
}

module.exports = new ReadinessEngine();

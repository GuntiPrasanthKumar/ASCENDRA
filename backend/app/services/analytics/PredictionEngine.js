class PredictionEngine {
  predictTrajectory(avgAccuracy = 85, completedCodingCount = 4, interviewScore = 88) {
    const baseScore = (avgAccuracy * 0.4) + (Math.min(10, completedCodingCount) * 4) + (interviewScore * 0.2);
    const p30 = Math.min(99, Math.round(baseScore * 0.85));
    const p60 = Math.min(99, Math.round(baseScore * 0.95));
    const p90 = Math.min(99, Math.round(baseScore * 1.05));

    let salaryMin = 75000;
    let salaryMax = 110000;

    if (baseScore > 85) {
      salaryMin = 95000;
      salaryMax = 145000;
    } else if (baseScore > 75) {
      salaryMin = 85000;
      salaryMax = 120000;
    }

    return {
      placementProbability30Days: p30,
      placementProbability60Days: p60,
      placementProbability90Days: p90,
      estimatedSalaryBand: `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()} / yr`,
      growthVelocity: baseScore >= 80 ? 'ACCELERATED' : 'STEADY',
      readinessBadge: baseScore >= 85 ? 'TIER_1_READY' : 'INDUSTRY_READY'
    };
  }
}

module.exports = new PredictionEngine();

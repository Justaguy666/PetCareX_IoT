export function buildStatsContext(stats) {
    if (!stats) {
        return `No feeding data is available for this user yet.`;
    }

    return `
User feeding statistics:
- Total feedings: ${stats.totalFeedings}
- Successful feedings: ${stats.totalSuccess}
- Failed feedings: ${stats.totalFailures}
- Success rate: ${stats.successRate.toFixed(1)}%
- Average food amount per feeding: ${Math.round(stats.averageAmount || 0)}g

Recent feeding history (latest 7):
${stats.recentHistory.map(h =>
    `• ${h.time.toISOString().slice(0, 10)} – ${h.status} – ${h.amount}g`
).join('\n')}
`.trim();
}

export default buildStatsContext;
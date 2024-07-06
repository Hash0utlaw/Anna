// lib/exportCsv.js
export function exportToCsv(metrics) {
    const { instagram, facebook } = metrics;
    const csvContent = [
      ['Platform', 'Metric', 'Value'],
      ['Instagram', 'Followers', instagram.followers],
      ['Instagram', 'Posts', instagram.posts],
      ['Instagram', 'Engagement Rate', instagram.engagementRate],
      ['Facebook', 'Likes', facebook.likes],
      ['Facebook', 'Followers', facebook.followers],
      ['Facebook', 'Engagement Rate', facebook.engagementRate],
    ]
      .map(row => row.join(','))
      .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'social_media_metrics.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
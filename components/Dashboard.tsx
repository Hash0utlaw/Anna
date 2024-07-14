'use client'
interface ProfileMetrics {
  followers: string;
  posts: string;
  following: string;
  engagementRate: string;
}

interface PostMetrics {
  likes: string;
  caption: string;
  date: string;
}

interface Metrics {
  type: 'profile' | 'post';
  data: ProfileMetrics | PostMetrics;
}

interface DashboardProps {
  metrics: Metrics;
}

export default function Dashboard({ metrics }: DashboardProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Metrics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">
            {metrics.type === 'profile' ? 'Instagram Profile Metrics' : 'Instagram Post Metrics'}
          </h3>
          {metrics.type === 'profile' ? (
            <>
              <p><strong>Followers:</strong> {(metrics.data as ProfileMetrics).followers}</p>
              <p><strong>Following:</strong> {(metrics.data as ProfileMetrics).following}</p>
              <p><strong>Posts:</strong> {(metrics.data as ProfileMetrics).posts}</p>
              <p><strong>Engagement Rate:</strong> {(metrics.data as ProfileMetrics).engagementRate}</p>
            </>
          ) : (
            <>
              <p><strong>Likes:</strong> {(metrics.data as PostMetrics).likes}</p>
              <p><strong>Caption:</strong> {(metrics.data as PostMetrics).caption}</p>
              <p><strong>Date:</strong> {(metrics.data as PostMetrics).date}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
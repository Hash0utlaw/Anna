import { useState } from 'react';

interface Metrics {
  type: 'profile' | 'post';
  data: ProfileMetrics | PostMetrics;
}

interface ProfileMetrics {
  followers: string;
  following: string;
  posts: string;
  engagementRate: string;
}

interface PostMetrics {
  likes: string;
  views?: string;
  caption: string;
  date: string;
}

interface DashboardProps {
  metrics: Metrics;
}

export default function Dashboard({ metrics }: DashboardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">
        {metrics.type === 'profile' ? 'Profile Metrics' : 'Post Metrics'}
      </h2>
      {metrics.type === 'profile' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricItem label="Followers" value={(metrics.data as ProfileMetrics).followers} icon="👥" />
          <MetricItem label="Following" value={(metrics.data as ProfileMetrics).following} icon="🔗" />
          <MetricItem label="Posts" value={(metrics.data as ProfileMetrics).posts} icon="📸" />
          <MetricItem label="Engagement Rate" value={(metrics.data as ProfileMetrics).engagementRate} icon="📊" />
        </div>
      ) : (
        <div className="space-y-4">
          <MetricItem label="Likes" value={(metrics.data as PostMetrics).likes} icon="❤️" />
          {(metrics.data as PostMetrics).views && (
            <MetricItem label="Views" value={(metrics.data as PostMetrics).views!} icon="👁️" />
          )}
          <MetricItem label="Date" value={(metrics.data as PostMetrics).date} icon="📅" />
          <div>
            <h3 className="font-semibold mb-2">Caption</h3>
            <p className={`${expanded ? '' : 'line-clamp-3'}`}>
              {(metrics.data as PostMetrics).caption}
            </p>
            {(metrics.data as PostMetrics).caption.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 hover:text-blue-700 mt-2"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-semibold">{label}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}
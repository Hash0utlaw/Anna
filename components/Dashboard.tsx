interface DashboardProps {
  metrics: {
    instagram: any;
    facebook: any;
  };
}

export default function Dashboard({ metrics }: DashboardProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Metrics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Instagram Metrics</h3>
          <pre>{JSON.stringify(metrics.instagram, null, 2)}</pre>
        </div>
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Facebook Metrics</h3>
          <pre>{JSON.stringify(metrics.facebook, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
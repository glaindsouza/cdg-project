interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'marked' | 'upcoming' | 'registered' | 'completed' | 'ongoing';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    marked: 'bg-blue-100 text-blue-700 border-blue-200',
    upcoming: 'bg-slate-100 text-slate-700 border-slate-200',
    registered: 'bg-orange-100 text-orange-700 border-orange-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
    ongoing: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    marked: 'Marked',
    upcoming: 'Upcoming',
    registered: 'Registered',
    completed: 'Completed',
    ongoing: 'Ongoing',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

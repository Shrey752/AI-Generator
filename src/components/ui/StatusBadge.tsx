const styles: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  called: 'bg-yellow-50 text-yellow-700',
  quoted: 'bg-purple-50 text-purple-700',
  closed: 'bg-green-50 text-green-700',
  active: 'bg-green-50 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  archived: 'bg-red-50 text-red-600',
  suspended: 'bg-red-50 text-red-600',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium font-sans rounded-full capitalize ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

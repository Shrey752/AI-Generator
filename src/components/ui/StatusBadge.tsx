const styles: Record<string, string> = {
  /* Enquiry statuses — brand palette, not stoplights */
  new:      'bg-ivory text-ink border border-warm-border',
  called:   'bg-gold/10 text-gold-dark border border-gold/25',
  quoted:   'bg-teal/10 text-teal border border-teal/20',
  closed:   'bg-ink/5 text-muted border border-warm-border',
  /* Product statuses */
  active:   'bg-teal/10 text-teal border border-teal/20',
  draft:    'bg-ivory text-muted border border-warm-border',
  archived: 'bg-ink/5 text-muted border border-warm-border',
  /* Buyer statuses */
  suspended: 'bg-[#9A2A2A]/8 text-[#9A2A2A] border border-[#9A2A2A]/20',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-label rounded-sm capitalize ${styles[status] ?? 'bg-ivory text-muted border border-warm-border'}`}>
      {status}
    </span>
  )
}

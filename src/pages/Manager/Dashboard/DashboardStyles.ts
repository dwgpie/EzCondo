export const styles = {
  card: {
    borderRadius: '16px',
    background: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    transform: 'translateY(0)'
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  cardContent: {
    padding: '1.5rem'
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconContainer: (bgColor: string) => ({
    padding: '1rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: bgColor.includes('blue')
      ? '#EBF5FF'
      : bgColor.includes('green')
        ? '#F0FDF4'
        : bgColor.includes('red')
          ? '#FEF2F2'
          : '#FAF5FF'
  }),
  title: {
    color: '#6B7280',
    fontSize: '0.875rem',
    marginBottom: '0.25rem'
  },
  value: {
    fontWeight: 700,
    fontSize: '2rem',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  trendContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '0.75rem'
  },
  arrowUp: {
    color: '#10B981',
    fontSize: 28,
    animation: 'bounceUp 1.2s infinite'
  },
  arrowDown: {
    color: '#EF4444',
    fontSize: 28,
    animation: 'bounceDown 1.2s infinite'
  },

  trendValue: (isUp: boolean) => ({
    color: isUp ? '#10B981' : '#EF4444',
    marginLeft: '0.25rem',
    fontSize: '1rem',
    fontWeight: 700
  }),
  keyframes: `
  @keyframes bounceUp {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  @keyframes bounceDown {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(3px); }
  }
  `,
  compareText: {
    color: '#6B7280',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  },
  trendBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    marginTop: '0.5rem'
  },
  arrowWrapper: (isUp: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: isUp ? '#D1FAE5' : '#FEE2E2',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    flexShrink: 0
  })
}

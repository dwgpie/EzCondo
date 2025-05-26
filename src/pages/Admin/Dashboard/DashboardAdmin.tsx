import { Card, CardContent } from '@mui/material'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid/Grid'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import {
  Apartment,
  ReportProblem,
  Group,
  ArrowUpward,
  ArrowDownward,
  LocalParking,
  Spa,
  LocalLaundryService,
  Pool,
  FitnessCenter,
  ChildCare
} from '@mui/icons-material'
import { styles } from '~/pages/Manager/Dashboard/DashboardStyles'
import { useState, useEffect } from 'react'
import { getStatsTemplate, StatItem } from '~/shared/startsTemplate'
import type { JSX } from 'react'
import { getServiceData } from '~/shared/serviceData'
import { getPaymentData, PaymentItem } from '~/shared/paymentData'
import { getTotalTransactionsByMonth } from '~/shared/transactionData'
import GaugeComponent from 'react-gauge-component'
import { useTranslation } from 'react-i18next'
import { getMonthlyIncomeData, IncomeItem, getTotalRevenueStats } from '~/shared/incomeData'

export default function DashboardAdmin() {
  const { t } = useTranslation('dashboard')
  const [stats, setStats] = useState<StatItem[]>([])
  const [serviceData, setServiceData] = useState<any[]>([])
  const [paymentData, setPaymentData] = useState<PaymentItem[]>([])
  const [monthGroup, setMonthGroup] = useState<'firstHalf' | 'secondHalf'>('firstHalf')
  const [gaugeQuarter, setGaugeQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [monthlyIncomeData, setMonthlyIncomeData] = useState<IncomeItem[]>([])
  const [totalRevenueStats, setTotalRevenueStats] = useState<{ totalRevenue: number; percentChange: number }>({
    totalRevenue: 0,
    percentChange: 0
  })
  const [totalServiceBookings, setTotalServiceBookings] = useState<number>(0)

  useEffect(() => {
    getStatsTemplate().then((data) => {
      setStats(
        data.map((item) => ({
          ...item,
          title: t(item.title),
          compareText: t(item.compareText)
        }))
      )
    })
  }, [t])

  useEffect(() => {
    getServiceData().then((data) => {
      setServiceData(
        data.serviceItems.map((item) => ({
          ...item,
          name: t(item.name),
          icon: iconMap[item.icon] || null
        }))
      )
      setTotalServiceBookings(data.totalBookings)
    })
  }, [t])

  useEffect(() => {
    const months =
      monthGroup === 'firstHalf' ? ['01', '02', '03', '04', '05', '06'] : ['07', '08', '09', '10', '11', '12']
    const monthNames =
      monthGroup === 'firstHalf'
        ? [t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'), t('months.may'), t('months.jun')]
        : [t('months.jul'), t('months.aug'), t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')]
    Promise.all(months.map((month) => getPaymentData(month))).then((results) => {
      const dataWithMonthNames = results.flat().map((item, idx) => ({
        ...item,
        month: monthNames[idx] || item.month
      }))
      setPaymentData(dataWithMonthNames)
    })
  }, [monthGroup, t])

  useEffect(() => {
    const fetchTransactions = async () => {
      const monthsInQuarter: { [key: string]: string[] } = {
        Q1: ['01', '02', '03'],
        Q2: ['04', '05', '06'],
        Q3: ['07', '08', '09'],
        Q4: ['10', '11', '12']
      }
      if (gaugeQuarter in monthsInQuarter) {
        const currentMonths = monthsInQuarter[gaugeQuarter]
        const monthlyCounts = await Promise.all(
          currentMonths.map((month: string) => getTotalTransactionsByMonth(month))
        )
        const total = monthlyCounts.reduce((sum: number, count: number) => sum + count, 0)
        setTotalTransactions(total)
      } else {
        setTotalTransactions(0)
      }
    }
    fetchTransactions()
  }, [gaugeQuarter])

  useEffect(() => {
    getMonthlyIncomeData().then((data) => {
      setMonthlyIncomeData(data)
    })
  }, [])

  useEffect(() => {
    getTotalRevenueStats().then((data) => {
      setTotalRevenueStats(data)
    })
  }, [])

  // Map tên icon sang component
  const iconMap: Record<string, JSX.Element> = {
    Apartment: <Apartment className='text-blue-600' fontSize='large' />,
    Group: <Group className='text-green-600' fontSize='large' />,
    ReportProblem: <ReportProblem className='text-red-600' fontSize='large' />,
    LocalParking: <LocalParking className='text-purple-600' fontSize='large' />,
    Spa: <Spa style={{ color: '#4F46E5' }} fontSize='large' />,
    LocalLaundryService: <LocalLaundryService style={{ color: '#10b910' }} fontSize='large' />,
    Pool: <Pool style={{ color: '#3bd1f6' }} fontSize='large' />,
    FitnessCenter: <FitnessCenter style={{ color: '#F59E0B' }} fontSize='large' />,
    ChildCare: <ChildCare style={{ color: '#EC4899' }} fontSize='large' />
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <p
            style={{
              color: payload[0].payload.color,
              margin: '0',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {payload[0].payload.icon}
            {payload[0].payload.name}
          </p>
          <p
            style={{
              color: '#111827',
              margin: '5px 0 0 0',
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            {payload[0].value}%
          </p>
        </div>
      )
    }
    return null
  }

  const PaymentTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <p style={{ color: '#111827', margin: '0 0 8px 0', fontWeight: 600 }}>{label}</p>
          <p style={{ color: '#6366F1', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('dashboard.paid')}:</span>
            <span style={{ fontWeight: 600 }}>
              {payload[0].value} {t(payload[0].value === 1 ? 'dashboard.apartment' : 'dashboard.apartments')}
            </span>
          </p>
          <p style={{ color: '#60A5FA', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('dashboard.unpaid')}:</span>
            <span style={{ fontWeight: 600 }}>
              {Math.abs(payload[1].value)}{' '}
              {t(Math.abs(payload[1].value) === 1 ? 'dashboard.apartment' : 'dashboard.apartments')}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  const RevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      let formattedValue = ''
      if (value >= 1000000) {
        formattedValue = `${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        formattedValue = `${(value / 1000).toFixed(1)}K`
      } else {
        formattedValue = `${value}`
      }
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <p style={{ color: '#111827', margin: '0 0 8px 0', fontWeight: 600 }}>{label}</p>
          <p style={{ color: '#4F46E5', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>Revenue:</span>
            <span style={{ fontWeight: 600 }}>{formattedValue}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className='mx-5 mt-5 mb-5 '>
      <Grid container spacing={2}>
        {stats.map((item, index) => {
          let glowColor = '#4F46E5'
          if (item.icon === 'Apartment') glowColor = '#2563eb'
          if (item.icon === 'Group') glowColor = '#22c55e'
          if (item.icon === 'ReportProblem') glowColor = '#ef4444'
          if (item.icon === 'LocalParking') glowColor = '#a21caf'
          return (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{ border: '1px solid #d9dbdd' }}
                style={styles.card}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CardContent style={styles.cardContent}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      className='dashboard-icon mr-3'
                      style={{
                        ...styles.iconContainer(item.bg),
                        transition: 'transform 0.35s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s, filter 0.3s',
                        transform: hoveredIndex === index ? 'scale(1.18) rotate(-8deg)' : undefined,
                        boxShadow: hoveredIndex === index ? `0 4px 16px ${glowColor}55` : undefined,
                        filter:
                          hoveredIndex === index ? `brightness(1.15) drop-shadow(0 0 8px ${glowColor}aa)` : undefined
                      }}
                    >
                      {iconMap[item.icon]}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexGrow: 1
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='body2' style={{ ...styles.title, fontSize: '16px', fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <div style={styles.trendBox}>
                          <Typography variant='h4' style={{ ...styles.value, fontWeight: 600 }}>
                            {item.value}
                          </Typography>
                          <span style={styles.trendContainer}>
                            <div style={styles.arrowWrapper(item.trend === 'up')}>
                              {item.trend === 'up' ? (
                                <ArrowUpward
                                  style={{
                                    fontSize: 16,
                                    color: '#10B981',
                                    animation: 'bounceUp 1.2s infinite'
                                  }}
                                />
                              ) : (
                                <ArrowDownward
                                  style={{
                                    fontSize: 16,
                                    color: '#EF4444',
                                    animation: 'bounceDown 1.2s infinite'
                                  }}
                                />
                              )}
                            </div>

                            <span style={styles.trendValue(item.trend === 'up')}>
                              <span style={{ marginLeft: '4px' }}>{item.percent}%</span>
                            </span>
                          </span>
                        </div>
                        <Typography variant='caption' style={styles.compareText}>
                          {item.compareText}
                        </Typography>
                      </div>
                      <div style={{ width: '180px', height: '100px', flexShrink: 0 }}>
                        <ResponsiveContainer width='100%' height='100%'>
                          <AreaChart data={[{ value: item.lastWeek }, { value: item.thisWeek }]}>
                            <defs>
                              <linearGradient id={`trendGradient-${index}`} x1='0' y1='0' x2='0' y2='1'>
                                <stop offset='5%' stopColor={glowColor} stopOpacity={0.8} />
                                <stop offset='95%' stopColor={glowColor} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type='monotone'
                              dataKey='value'
                              stroke={glowColor}
                              strokeWidth={2}
                              fill={`url(#trendGradient-${index})`}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Grid container spacing={2} style={{ marginTop: '1px' }}>
        <Grid item xs={12} md={6}>
          <Card style={styles.card} sx={{ border: '1px solid #d9dbdd' }}>
            <CardContent style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Typography variant='h6' style={{ color: '#111827' }}>
                  {t('dashboard.totalTransactionsTitle')}
                </Typography>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setGaugeQuarter('Q1')}
                    style={{
                      background: gaugeQuarter === 'Q1' ? 'rgba(99,102,241,0.08)' : '#fff',
                      color: gaugeQuarter === 'Q1' ? '#4F46E5' : '#374151',
                      border: gaugeQuarter === 'Q1' ? '1.5px solid #6366F1' : '1px solid #D1D5DB',
                      borderRadius: 999,
                      padding: '4px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: gaugeQuarter === 'Q1' ? '0 1px 4px #6366F111' : 'none',
                      transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                      outline: 'none',
                      marginRight: 2
                    }}
                    onMouseOver={(e) => {
                      if (gaugeQuarter !== 'Q1') e.currentTarget.style.background = '#F3F4F6'
                    }}
                    onMouseOut={(e) => {
                      if (gaugeQuarter !== 'Q1') e.currentTarget.style.background = '#fff'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 2px #6366F155'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = gaugeQuarter === 'Q1' ? '0 1px 4px #6366F111' : 'none'
                    }}
                  >
                    {t('dashboard.quarter1Button')}
                  </button>
                  <button
                    onClick={() => setGaugeQuarter('Q2')}
                    style={{
                      background: gaugeQuarter === 'Q2' ? 'rgba(99,102,241,0.08)' : '#fff',
                      color: gaugeQuarter === 'Q2' ? '#4F46E5' : '#374151',
                      border: gaugeQuarter === 'Q2' ? '1.5px solid #6366F1' : '1px solid #D1D5DB',
                      borderRadius: 999,
                      padding: '4px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: gaugeQuarter === 'Q2' ? '0 1px 4px #6366F111' : 'none',
                      transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                      outline: 'none',
                      marginRight: 2
                    }}
                    onMouseOver={(e) => {
                      if (gaugeQuarter !== 'Q2') e.currentTarget.style.background = '#F3F4F6'
                    }}
                    onMouseOut={(e) => {
                      if (gaugeQuarter !== 'Q2') e.currentTarget.style.background = '#fff'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 2px #6366F155'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = gaugeQuarter === 'Q2' ? '0 1px 4px #6366F111' : 'none'
                    }}
                  >
                    {t('dashboard.quarter2Button')}
                  </button>
                  <button
                    onClick={() => setGaugeQuarter('Q3')}
                    style={{
                      background: gaugeQuarter === 'Q3' ? 'rgba(99,102,241,0.08)' : '#fff',
                      color: gaugeQuarter === 'Q3' ? '#4F46E5' : '#374151',
                      border: gaugeQuarter === 'Q3' ? '1.5px solid #6366F1' : '1px solid #D1D5DB',
                      borderRadius: 999,
                      padding: '4px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: gaugeQuarter === 'Q3' ? '0 1px 4px #6366F111' : 'none',
                      transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                      outline: 'none',
                      marginRight: 2
                    }}
                    onMouseOver={(e) => {
                      if (gaugeQuarter !== 'Q3') e.currentTarget.style.background = '#F3F4F6'
                    }}
                    onMouseOut={(e) => {
                      if (gaugeQuarter !== 'Q3') e.currentTarget.style.background = '#fff'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 2px #6366F155'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = gaugeQuarter === 'Q3' ? '0 1px 4px #6366F111' : 'none'
                    }}
                  >
                    {t('dashboard.quarter3Button')}
                  </button>
                  <button
                    onClick={() => setGaugeQuarter('Q4')}
                    style={{
                      background: gaugeQuarter === 'Q4' ? 'rgba(99,102,241,0.08)' : '#fff',
                      color: gaugeQuarter === 'Q4' ? '#4F46E5' : '#374151',
                      border: gaugeQuarter === 'Q4' ? '1.5px solid #6366F1' : '1px solid #D1D5DB',
                      borderRadius: 999,
                      padding: '4px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: gaugeQuarter === 'Q4' ? '0 1px 4px #6366F111' : 'none',
                      transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                      outline: 'none',
                      marginLeft: 2
                    }}
                    onMouseOver={(e) => {
                      if (gaugeQuarter !== 'Q4') e.currentTarget.style.background = '#F3F4F6'
                    }}
                    onMouseOut={(e) => {
                      if (gaugeQuarter !== 'Q4') e.currentTarget.style.background = '#fff'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 2px #6366F155'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = gaugeQuarter === 'Q4' ? '0 1px 4px #6366F111' : 'none'
                    }}
                  >
                    {t('dashboard.quarter4Button')}
                  </button>
                </div>
              </div>
              <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center' }}>
                <GaugeComponent
                  value={totalTransactions}
                  minValue={0}
                  maxValue={500}
                  type='radial'
                  arc={{
                    width: 0.3,
                    subArcs: [
                      { limit: 150, color: '#95d41f' },
                      { limit: 300, color: '#F5CD19' },
                      { limit: 450, color: '#F97316' },
                      { limit: 500, color: '#EA4228' }
                    ]
                  }}
                  pointer={{ type: 'arrow' }}
                  labels={{
                    tickLabels: {
                      type: 'outer',
                      ticks: [
                        { value: 0 },
                        { value: 100 },
                        { value: 200 },
                        { value: 300 },
                        { value: 400 },
                        { value: 500 }
                      ]
                    },
                    valueLabel: {
                      style: {
                        fontSize: '48px',
                        fill: '#111827',
                        textShadow: 'none'
                      }
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '25px' }}>
                <Typography variant='body2' style={{ color: '#6B7280' }}>
                  {t('dashboard.totalTransactionsInQuarter', { quarter: gaugeQuarter.replace('Q', '') })}
                </Typography>
              </div>
            </CardContent>
          </Card>
          <Card style={styles.card} sx={{ border: '1px solid #d9dbdd', marginTop: '1rem' }}>
            <CardContent
              style={{
                padding: '1.5rem',
                minHeight: '450px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <Typography variant='h6' style={{ color: '#111827', marginBottom: '0.5rem' }}>
                    {t('dashboard.paymentTitle')}
                  </Typography>
                  <Typography variant='body2' style={{ color: '#6B7280' }}>
                    {monthGroup === 'firstHalf' ? t('dashboard.firstHalfYear') : t('dashboard.secondHalfYear')}
                  </Typography>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setMonthGroup('firstHalf')}
                    style={{
                      background: monthGroup === 'firstHalf' ? 'rgba(99,102,241,0.08)' : '#fff',
                      color: monthGroup === 'firstHalf' ? '#4F46E5' : '#374151',
                      border: monthGroup === 'firstHalf' ? '1.5px solid #6366F1' : '1px solid #D1D5DB',
                      borderRadius: 999,
                      padding: '4px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: monthGroup === 'firstHalf' ? '0 1px 4px #6366F111' : 'none',
                      transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                      outline: 'none',
                      marginRight: 2
                    }}
                    onMouseOver={(e) => {
                      if (monthGroup !== 'firstHalf') e.currentTarget.style.background = '#F3F4F6'
                    }}
                    onMouseOut={(e) => {
                      if (monthGroup !== 'firstHalf') e.currentTarget.style.background = '#fff'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 2px #6366F155'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = monthGroup === 'firstHalf' ? '0 1px 4px #6366F111' : 'none'
                    }}
                  >
                    {t('dashboard.month1To6Button')}
                  </button>
                  <button
                    onClick={() => setMonthGroup('secondHalf')}
                    style={{
                      background: monthGroup === 'secondHalf' ? 'rgba(99,102,241,0.08)' : '#fff',
                      color: monthGroup === 'secondHalf' ? '#4F46E5' : '#374151',
                      border: monthGroup === 'secondHalf' ? '1.5px solid #6366F1' : '1px solid #D1D5DB',
                      borderRadius: 999,
                      padding: '4px 14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: monthGroup === 'secondHalf' ? '0 1px 4px #6366F111' : 'none',
                      transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                      outline: 'none',
                      marginLeft: 2
                    }}
                    onMouseOver={(e) => {
                      if (monthGroup !== 'secondHalf') e.currentTarget.style.background = '#F3F4F6'
                    }}
                    onMouseOut={(e) => {
                      if (monthGroup !== 'secondHalf') e.currentTarget.style.background = '#fff'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 2px #6366F155'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = monthGroup === 'secondHalf' ? '0 1px 4px #6366F111' : 'none'
                    }}
                  >
                    {t('dashboard.month7To12Button')}
                  </button>
                </div>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart
                    data={paymentData}
                    stackOffset='sign'
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={0}
                    barCategoryGap='25%'
                  >
                    <CartesianGrid strokeDasharray='3 3' horizontal={true} vertical={false} stroke='#E5E7EB' />
                    <XAxis dataKey='month' axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[-30, 30]}
                      ticks={[-30, -20, -10, 0, 10, 20, 30]}
                    />
                    <Tooltip content={<PaymentTooltip />} />
                    <Bar dataKey='paid' fill='#6366F1' radius={[4, 4, 0, 0]} maxBarSize={25} />
                    <Bar dataKey='unpaid' fill='#60A5FA' radius={[4, 4, 0, 0]} maxBarSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, backgroundColor: '#6366F1', borderRadius: 2 }} />
                  <Typography variant='body2'>{t('dashboard.paidText')}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, backgroundColor: '#60A5FA', borderRadius: 2 }} />
                  <Typography variant='body2'>{t('dashboard.unpaidText')}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={styles.card} sx={{ border: '1px solid #d9dbdd' }}>
            <CardContent
              style={{
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant='h6' style={{ color: '#111827', marginBottom: '0.5rem' }}>
                    {t('dashboard.bookingTitle')}
                  </Typography>
                  <Typography variant='h2' style={{ fontWeight: 600, color: '#111827' }}>
                    {totalServiceBookings}
                  </Typography>
                </div>

                <div style={{ width: '200px', height: '232px' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx='50%'
                        cy='50%'
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey='value'
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ marginTop: '5px' }}>
                {serviceData.map((service, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: `${service.color}40`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#fff',
                        padding: '1.03rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {service.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Typography variant='body1' style={{ fontWeight: 500 }}>
                        {service.name}
                      </Typography>
                      <Typography variant='body1' style={{ color: '#6B7280' }}>
                        {t('dashboard.usageRate')}
                      </Typography>
                    </div>
                    <Typography variant='h6' style={{ fontWeight: 600, color: service.color }}>
                      {service.value}%
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: '1px' }}>
        <Grid item xs={12}>
          <Card style={styles.card} sx={{ border: '1px solid #d9dbdd' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ marginRight: '1rem' }}>
                  <Typography variant='h6' style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
                    {t('dashboard.totalRevenueTitle')}
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Typography variant='h3' style={{ fontWeight: 600, color: '#111827' }}>
                      {totalRevenueStats.totalRevenue >= 1000000
                        ? `${(totalRevenueStats.totalRevenue / 1000000).toFixed(1)}M₫`
                        : totalRevenueStats.totalRevenue >= 1000
                          ? `${(totalRevenueStats.totalRevenue / 1000).toFixed(1)}K₫`
                          : `${totalRevenueStats.totalRevenue}₫`}
                    </Typography>
                    <span
                      style={{
                        color: totalRevenueStats.percentChange >= 0 ? '#10B981' : '#EF4444',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {totalRevenueStats.percentChange >= 0 ? (
                        <ArrowUpward style={{ fontSize: '1rem', marginRight: '2px' }} />
                      ) : (
                        <ArrowDownward style={{ fontSize: '1rem', marginRight: '2px' }} />
                      )}
                      {Math.abs(totalRevenueStats.percentChange)}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={monthlyIncomeData}>
                    <defs>
                      <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#4F46E5' stopOpacity={0.3} />
                        <stop offset='50%' stopColor='#4F46E5' stopOpacity={0.1} />
                        <stop offset='100%' stopColor='#4F46E5' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#E5E7EB' />
                    <XAxis
                      dataKey='month'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      dx={-10}
                      tickFormatter={(value) => {
                        if (value >= 1000000) {
                          return `${(value / 1000000).toFixed(1)}M`
                        } else if (value >= 1000) {
                          return `${(value / 1000).toFixed(1)}K`
                        }
                        return value
                      }}
                    />
                    <Tooltip content={<RevenueTooltip />} />
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke='#4F46E5'
                      strokeWidth={2.5}
                      fill='url(#colorRevenue)'
                      dot={{ fill: '#4F46E5', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{
                        r: 6,
                        fill: '#4F46E5',
                        stroke: '#fff',
                        strokeWidth: 2
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <style>{styles.keyframes}</style>
    </div>
  )
}

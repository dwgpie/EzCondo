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
import { getStatsTemplate, StatItem } from '~/shared/Manager/startsTemplate'
import type { JSX } from 'react'
import { getServiceData } from '~/shared/Manager/serviceData'
import { getPaymentData, PaymentItem } from '~/shared/Manager/paymentData'

export default function DashboardManager() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [serviceData, setServiceData] = useState<any[]>([])
  const [paymentData, setPaymentData] = useState<PaymentItem[]>([])
  const [monthGroup, setMonthGroup] = useState<'firstHalf' | 'secondHalf'>('firstHalf')

  useEffect(() => {
    getStatsTemplate().then(setStats)
  }, [])

  useEffect(() => {
    getServiceData().then((data) => {
      setServiceData(
        data.map((item) => ({
          ...item,
          icon: iconMap[item.icon] || null
        }))
      )
    })
  }, [])

  useEffect(() => {
    const months =
      monthGroup === 'firstHalf' ? ['01', '02', '03', '04', '05', '06'] : ['07', '08', '09', '10', '11', '12']
    const monthNames =
      monthGroup === 'firstHalf'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        : ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    Promise.all(months.map((month) => getPaymentData(month))).then((results) => {
      const dataWithMonthNames = results.flat().map((item, idx) => ({
        ...item,
        month: monthNames[idx] || item.month
      }))
      setPaymentData(dataWithMonthNames)
    })
  }, [monthGroup])

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

  const monthlyData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 92 },
    { name: 'Mar', value: 32 },
    { name: 'Apr', value: 95 },
    { name: 'May', value: 37 },
    { name: 'Jun', value: 87 },
    { name: 'Jul', value: 19 },
    { name: 'Aug', value: 18 },
    { name: 'Sep', value: 91 },
    { name: 'Oct', value: 93 },
    { name: 'Nov', value: 96 },
    { name: 'Dec', value: 10 }
  ]

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
            <span>Đã thanh toán:</span>
            <span style={{ fontWeight: 600 }}>{payload[0].value} căn</span>
          </p>
          <p style={{ color: '#60A5FA', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>Chưa thanh toán:</span>
            <span style={{ fontWeight: 600 }}>{Math.abs(payload[1].value)} căn</span>
          </p>
        </div>
      )
    }
    return null
  }

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className='mx-5 mt-5 mb-5 '>
      <Grid container spacing={3}>
        {stats.map((item, index) => {
          let glowColor = '#4F46E5'
          if (item.icon === 'Apartment') glowColor = '#2563eb'
          if (item.icon === 'Group') glowColor = '#22c55e'
          if (item.icon === 'ReportProblem') glowColor = '#ef4444'
          if (item.icon === 'LocalParking') glowColor = '#a21caf'
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{ border: '1px solid #d9dbdd' }}
                style={styles.card}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CardContent style={styles.cardContent}>
                  <div style={styles.flexContainer}>
                    <div
                      className='dashboard-icon'
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
                    <div>
                      <Typography variant='body2' style={styles.title}>
                        {item.title}
                      </Typography>
                      <div style={styles.trendBox}>
                        <Typography variant='h5' style={styles.value}>
                          {item.value}
                        </Typography>
                        <span style={styles.trendContainer}>
                          {item.trend === 'up' ? (
                            <ArrowUpward style={styles.arrowUp} />
                          ) : (
                            <ArrowDownward style={styles.arrowDown} />
                          )}
                          <span style={styles.trendValue(item.trend === 'up')}>
                            {item.trend === 'up' ? '+' : '-'}
                            {item.percent}%
                          </span>
                        </span>
                      </div>
                      <Typography variant='caption' style={styles.compareText}>
                        {item.compareText}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '1px' }}>
        <Grid item xs={12} md={6}>
          <Card style={styles.card} sx={{ border: '1px solid #d9dbdd' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant='h6' style={{ color: '#111827', marginBottom: '0.5rem' }}>
                    Số lượng booking
                  </Typography>
                  <Typography variant='h3' style={{ fontWeight: 600, color: '#111827' }}>
                    100%
                  </Typography>
                  <Typography variant='body2' style={{ color: '#6B7280' }}>
                    Tổng số lượt đặt dịch vụ
                  </Typography>
                </div>

                <div style={{ width: '200px', height: '200px' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
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
                        padding: '0.5rem',
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
                      <Typography variant='body2' style={{ color: '#6B7280' }}>
                        Tỷ lệ sử dụng
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
        <Grid item xs={12} md={6}>
          <Card style={styles.card} sx={{ border: '1px solid #d9dbdd' }}>
            <CardContent style={{ padding: '1.5rem' }}>
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
                    Thanh toán phí điện nước
                  </Typography>
                  <Typography variant='body2' style={{ color: '#6B7280' }}>
                    {monthGroup === 'firstHalf' ? '6 tháng đầu năm' : '6 tháng cuối năm'}
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
                    Tháng 1-6
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
                    Tháng 7-12
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
                  <Typography variant='body2'>Đã thanh toán</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, backgroundColor: '#60A5FA', borderRadius: 2 }} />
                  <Typography variant='body2'>Chưa thanh toán</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '1px' }}>
        <Grid item xs={12}>
          <Card style={styles.card} sx={{ border: '1px solid #d9dbdd' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ marginRight: '1rem' }}>
                  <Typography variant='body2' style={{ color: '#6B7280', marginBottom: '0.25rem' }}>
                    Tổng thu nhập
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Typography variant='h4' style={{ fontWeight: 600, color: '#111827' }}>
                      $459.1k
                    </Typography>
                    <span
                      style={{
                        color: '#10B981',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ArrowUpward style={{ fontSize: '1rem', marginRight: '2px' }} />
                      65%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#4F46E5' stopOpacity={0.3} />
                        <stop offset='50%' stopColor='#4F46E5' stopOpacity={0.1} />
                        <stop offset='100%' stopColor='#4F46E5' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#E5E7EB' />
                    <XAxis
                      dataKey='name'
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
                      tickFormatter={(value) => `$${value}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
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

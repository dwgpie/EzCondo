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
  Pool,
  FitnessCenter,
  LocalParking,
  Security,
  CleaningServices
} from '@mui/icons-material'
import Weather from '../../../components/Weather'
import { styles } from '~/pages/Manager/Dashboard/DashboardStyles'
import { useState } from 'react'

export default function Dashboard() {
  const stats = [
    {
      title: 'Tỷ lệ lấp đầy',
      value: '85%',
      icon: <Apartment className='text-blue-600' fontSize='large' />,
      bg: 'bg-blue-100',
      trend: 'up',
      percent: 2.5,
      compareText: 'Tăng so với tuần trước'
    },
    {
      title: 'Cư dân hiện tại',
      value: '350',
      icon: <Group className='text-green-600' fontSize='large' />,
      bg: 'bg-green-100',
      trend: 'up',
      percent: 1.2,
      compareText: 'Tăng so với tuần trước'
    },
    {
      title: 'Sự cố đang xử lý',
      value: '5',
      icon: <ReportProblem className='text-red-600' fontSize='large' />,
      bg: 'bg-red-100',
      trend: 'down',
      percent: 0.8,
      compareText: 'Giảm so với tuần trước'
    },
    {
      title: 'Số xe đang gửi',
      value: '180',
      icon: <LocalParking className='text-purple-600' fontSize='large' />,
      bg: 'bg-purple-100',
      trend: 'up',
      percent: 1.2,
      compareText: 'Tăng so với tuần trước'
    }
  ]

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

  const serviceData = [
    { name: 'Bảo vệ', value: 38, icon: <Security style={{ color: '#4F46E5' }} />, color: '#4F46E5' },
    { name: 'Vệ sinh', value: 25, icon: <CleaningServices style={{ color: '#10b910' }} />, color: '#10b910' },
    { name: 'Bể bơi', value: 60, icon: <Pool style={{ color: '#3bd1f6' }} />, color: '#3bd1f6' },
    { name: 'Gym', value: 12, icon: <FitnessCenter style={{ color: '#F59E0B' }} />, color: '#F59E0B' },
    { name: 'Bãi xe', value: 10, icon: <LocalParking style={{ color: '#EC4899' }} />, color: '#EC4899' }
  ]

  const paymentData = [
    {
      month: 'Jan',
      paid: 18,
      unpaid: -12
    },
    {
      month: 'Feb',
      paid: 5,
      unpaid: -18
    },
    {
      month: 'Mar',
      paid: 14,
      unpaid: -8
    },
    {
      month: 'Apr',
      paid: 28,
      unpaid: -12
    },
    {
      month: 'May',
      paid: 16,
      unpaid: -3
    },
    {
      month: 'Jun',
      paid: 10,
      unpaid: -15
    },
    {
      month: 'Jul',
      paid: 8,
      unpaid: -12
    }
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
          if (item.icon.props.className?.includes('text-blue-600')) glowColor = '#2563eb'
          if (item.icon.props.className?.includes('text-green-600')) glowColor = '#22c55e'
          if (item.icon.props.className?.includes('text-red-600')) glowColor = '#ef4444'
          if (item.icon.props.className?.includes('text-purple-600')) glowColor = '#a21caf'
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
                      {item.icon}
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
                    Thống kê dịch vụ
                  </Typography>
                  <Typography variant='h3' style={{ fontWeight: 600, color: '#111827' }}>
                    100%
                  </Typography>
                  <Typography variant='body2' style={{ color: '#6B7280' }}>
                    Tổng tỷ lệ sử dụng
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

              <div style={{ marginTop: '2rem' }}>
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
                    Thanh toán phí dịch vụ
                  </Typography>
                  <Typography variant='body2' style={{ color: '#6B7280' }}>
                    6 tháng gần nhất
                  </Typography>
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
          <Grid item xs={12} md={12} style={{ marginTop: '22px' }}>
            <Weather />
          </Grid>
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

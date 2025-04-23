import React from 'react'
import { Card, CardContent } from '@mui/material'
import { CircularProgress, Typography, Grid } from '@mui/material'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { PeopleAlt, MedicalServices, LocalHospital, DirectionsCar } from '@mui/icons-material'
import { ArrowUpward } from '@mui/icons-material'
import { Box, Chip } from '@mui/material'

export default function DashboardManager() {
  const patientTrend = [
    { month: 'Oct 2019', inpatients: 4000, outpatients: 1200 },
    { month: 'Nov 2019', inpatients: 4200, outpatients: 1300 },
    { month: 'Dec 2019', inpatients: 4500, outpatients: 1250 },
    { month: 'Jan 2020', inpatients: 3900, outpatients: 1150 },
    { month: 'Feb 2020', inpatients: 4300, outpatients: 1350 },
    { month: 'Mar 2020', inpatients: 4100, outpatients: 1200 }
  ]

  const timeAdmitted = [
    { time: '07 am', value: 80 },
    { time: '08 am', value: 113 },
    { time: '09 am', value: 95 },
    { time: '10 am', value: 55 },
    { time: '11 am', value: 90 },
    { time: '12 pm', value: 100 }
  ]

  const divisionData = [
    { division: 'Cardiology', pt: 247 },
    { division: 'Neurology', pt: 164 },
    { division: 'Surgery', pt: 86 }
  ]

  const stats = [
    {
      title: 'Total Patients',
      value: '3,256',
      icon: <PeopleAlt className='text-purple-600' fontSize='large' />,
      bg: 'bg-purple-100'
    },
    {
      title: 'Available Staff',
      value: '394',
      icon: <MedicalServices className='text-blue-600' fontSize='large' />,
      bg: 'bg-blue-100'
    },
    {
      title: 'Avg Treat. Costs',
      value: '$2,536',
      icon: <LocalHospital className='text-green-600' fontSize='large' />,
      bg: 'bg-green-100'
    },
    {
      title: 'Available Cars',
      value: '38',
      icon: <DirectionsCar className='text-pink-600' fontSize='large' />,
      bg: 'bg-pink-100'
    }
  ]

  const data = [{ value: 10 }, { value: 12 }, { value: 100 }, { value: 16 }, { value: 18 }, { value: 22 }]
  const chartData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 80, 60, 40, 20, 10]

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <Card className='rounded-2xl shadow-md px-2 py-3 w-100 mb-4'>
        <CardContent className='flex justify-between items-center p-0'>
          {/* Left side */}
          <Box>
            <Typography variant='body2' className='text-gray-500 mb-1'>
              Your Set Goal
            </Typography>
            <div className='flex items-end gap-1'>
              <Typography variant='h4' className='text-blue-600 font-bold leading-tight'>
                127
              </Typography>
              <Typography variant='body2' className='text-gray-500 mb-1'>
                ml
              </Typography>
            </div>
            <Chip label='125ml/day' size='small' className='mt-1 bg-gray-100 text-gray-700 text-xs font-medium' />
          </Box>

          {/* Right side: mini custom bar chart */}
          <div className='flex items-end gap-[2px] h-16 ml-2'>
            {chartData.map((val, index) => (
              <div
                key={index}
                className={`w-[3px] rounded-md ${
                  index === Math.floor(chartData.length / 2) ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{ height: `${val * 0.6}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className='rounded-2xl shadow-md px-2 py-3 mb-4 w-100'>
        <CardContent className='flex justify-between items-center p-0'>
          {/* Left section */}
          <Box>
            <Typography variant='body2' className='text-gray-500 mb-1'>
              Your Set Goal
            </Typography>
            <div className='flex items-end gap-1'>
              <Typography variant='h4' className='text-blue-600 font-bold leading-tight'>
                35
              </Typography>
              <Typography variant='body2' className='text-gray-500 mb-1'>
                %
              </Typography>
            </div>
            <Typography variant='caption' className='text-gray-400'>
              more than last week
            </Typography>
          </Box>

          {/* Right section */}
          <div className='flex flex-col items-end gap-2'>
            <Chip label='40%/day' size='small' className='bg-gray-100 text-gray-700 text-xs font-medium' />
            <div className='flex gap-2'>
              {/* "Water level" column 1 */}
              <div className='w-4 h-10 rounded-md bg-gray-200 flex flex-col justify-end overflow-hidden'>
                <div className='bg-purple-400 w-full h-[50%] rounded-b-md'></div>
              </div>
              {/* "Water level" column 2 */}
              <div className='w-4 h-10 rounded-md bg-gray-200 flex flex-col justify-end overflow-hidden'>
                <div className='bg-blue-500 w-full h-[70%] rounded-b-md'></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className='rounded-2xl shadow-md px-2 py-3 mb-4 w-100'>
        <CardContent className='flex justify-between items-center p-0'>
          {/* Left side: text and value */}
          <Box>
            <Typography variant='body2' className='text-gray-500 mb-1'>
              Your Set Goal
            </Typography>
            <Typography variant='h4' className='text-blue-600 font-bold leading-tight'>
              164<span className='text-sm text-gray-500 ml-1'>mg</span>
            </Typography>
            <Chip label='160ml/day' size='small' className='mt-1 bg-gray-100 text-gray-700 text-xs font-medium' />
          </Box>

          {/* Right side: mini bar chart */}
          <div className='w-24 h-16'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data}>
                <Bar dataKey='value' fill='#3B82F6' radius={[4, 4, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-2xl shadow-md mb-10 w-100'>
        <CardContent className='flex justify-between items-center'>
          {/* Left side - text info */}
          <Box>
            <Typography variant='subtitle2' className='text-gray-500'>
              New subscriptions
            </Typography>
            <div className='flex items-center gap-2 mt-1'>
              <Typography variant='h5' className='font-bold'>
                22
              </Typography>
              <div className='flex items-center text-green-600 text-sm font-medium'>
                <ArrowUpward fontSize='small' />
                15%
              </div>
            </div>
            <Typography variant='caption' className='text-gray-400'>
              compared to last week
            </Typography>
          </Box>

          {/* Right side - mini chart */}
          <div className='w-24 h-16'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={data}>
                <Line type='monotone' dataKey='value' stroke='#8B5CF6' strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Grid container spacing={3}>
        <Grid container spacing={3}>
          {stats.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className='rounded-2xl shadow-md hover:shadow-lg transition-all'>
                <CardContent className='flex items-center gap-4'>
                  <div className={`p-3 rounded-full ${item.bg} flex items-center justify-center`}>{item.icon}</div>
                  <div>
                    <Typography variant='body2' className='text-gray-500'>
                      {item.title}
                    </Typography>
                    <Typography variant='h5' className='font-semibold'>
                      {item.value}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className='rounded-2xl shadow-md'>
            <CardContent>
              <Typography variant='h6'>Outpatients vs. Inpatients Trend</Typography>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={patientTrend}>
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='inpatients' fill='#7C3AED' />
                  <Bar dataKey='outpatients' fill='#34D399' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className='rounded-2xl shadow-md flex items-center justify-center h-full'>
            <CardContent className='text-center'>
              <Typography variant='h6'>Inpatients 72% / Outpatients 28%</Typography>
              <CircularProgress variant='determinate' value={28} size={100} thickness={4} />
              <Typography>Outpatients</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className='rounded-2xl shadow-md text-center'>
            <CardContent>
              <Typography variant='h6'>Patients by Gender</Typography>
              <div className='flex justify-center'>
                <CircularProgress variant='determinate' value={52} size={100} thickness={4} />
              </div>
              <Typography>52% Female / 48% Male</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className='rounded-2xl shadow-md'>
            <CardContent>
              <Typography variant='h6'>Patients By Division</Typography>
              {divisionData.map((item, index) => (
                <div key={index} className='flex justify-between py-1'>
                  <Typography>{item.division}</Typography>
                  <Typography>{item.pt}</Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className='rounded-2xl shadow-md'>
            <CardContent>
              <Typography variant='h6'>Time Admitted</Typography>
              <ResponsiveContainer width='100%' height={200}>
                <LineChart data={timeAdmitted}>
                  <XAxis dataKey='time' />
                  <YAxis />
                  <Tooltip />
                  <Line type='monotone' dataKey='value' stroke='#F97316' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className='rounded-2xl shadow-md bg-purple-600 text-white'>
            <CardContent>
              <Typography variant='h5'>3,240</Typography>
              <Typography>Patients this month</Typography>
              <ResponsiveContainer width='100%' height={100}>
                <LineChart data={timeAdmitted}>
                  <Line type='monotone' dataKey='value' stroke='#fff' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

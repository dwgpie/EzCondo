import { PieChart } from '@mui/x-charts/PieChart'
import { desktopOS, valueFormatter } from './Pie'
import { BarChart } from '@mui/x-charts/BarChart'
import { dataset } from './Bar'

const chartSetting = {
  xAxis: [
    {
      label: 'rainfall (mm)'
    }
  ],
  width: 500,
  height: 400
}

export default function Dashboard() {
  return (
    <div>
      <div className='flex justify-between p-[20px]'>
        {['Today Sell Amount', 'Today Income', 'Today Due', 'Expense Amount'].map((title, index) => (
          <div
            key={index}
            style={{ background: 'linear-gradient(24deg, #00629f 70%, #3ea8ff 100%)' }}
            className='w-[250px] p-4 rounded-xl shadow-md]'
          >
            <div className='text-lg text-white font-semibold'>{title}</div>
            <div className='text-2xl text-white'>$0</div>
            <div className='text-sm text-green-500'>+0.00% Since last month</div>
          </div>
        ))}
      </div>
      <div className='flex pl-[20px] pr-[20px] justify-between'>
        <div className='bg-white text-2xl font-semibold drop-shadow-md rounded-xl w-[48%] '>
          <div className='flex justify-between items-center bg-gray-100 p-3 mb-8'>
            <div className='text-base font-semibold '>List of Services</div>
            <select className='p-1 text-sm border rounded bg-white'>
              <option value='1'>January</option>
              <option value='2'>February</option>
              <option value='3'>March</option>
              <option value='4'>April</option>
              <option value='5'>May</option>
              <option value='6'>June</option>
              <option value='7'>July</option>
              <option value='8'>August</option>
              <option value='9'>September</option>
              <option value='10'>October</option>
              <option value='11'>November</option>
              <option value='12'>December</option>
            </select>
          </div>
          <PieChart
            series={[
              {
                data: desktopOS,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                valueFormatter
              }
            ]}
            height={300}
          />
        </div>
        <div className=' bg-white text-2xl font-semibold drop-shadow-md rounded-xl w-[48%]'>
          <div className='flex justify-between items-center bg-gray-100 p-3'>
            <div className='text-base font-semibold '>List of Services</div>
            <select className='p-1 text-sm border rounded bg-white'>
              <option value='1'>January</option>
              <option value='2'>February</option>
              <option value='3'>March</option>
              <option value='4'>April</option>
              <option value='5'>May</option>
              <option value='6'>June</option>
              <option value='7'>July</option>
              <option value='8'>August</option>
              <option value='9'>September</option>
              <option value='10'>October</option>
              <option value='11'>November</option>
              <option value='12'>December</option>
            </select>
          </div>
          <BarChart
            dataset={dataset}
            yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'seoul', label: 'Seoul rainfall' }]}
            layout='horizontal'
            {...chartSetting}
          />
        </div>
      </div>
      <div className=' bg-white text-2xl font-semibold drop-shadow-md rounded-xl w-[48%]'>
          <div className='flex justify-between items-center bg-gray-100 p-3'>
            <div className='text-base font-semibold '>List of Services</div>
            <select className='p-1 text-sm border rounded bg-white'>
              <option value='1'>January</option>
              <option value='2'>February</option>
              <option value='3'>March</option>
              <option value='4'>April</option>
              <option value='5'>May</option>
              <option value='6'>June</option>
              <option value='7'>July</option>
              <option value='8'>August</option>
              <option value='9'>September</option>
              <option value='10'>October</option>
              <option value='11'>November</option>
              <option value='12'>December</option>
            </select>
          </div>
          <BarChart
            dataset={dataset}
            yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'seoul', label: 'Seoul rainfall' }]}
            layout='horizontal'
            {...chartSetting}
          />
        </div>
    </div>
  )
}

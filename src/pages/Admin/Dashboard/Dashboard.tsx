import { PieChart } from '@mui/x-charts/PieChart'
import { desktopOS, valueFormatter } from './Pie'
import { BarChart } from '@mui/x-charts/BarChart'
import { dataset } from './Bar'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin/SideBarAdmin'

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
    <div className='bg-[#EDF2F9] pt-25 z-13 h-screen'>
      <div className='grid grid-cols-12 gap-5 items-start'>
        <div className='col-span-1'></div>
        <div className='col-span-2 sticky top-25'>
          <SideBarAdmin />
        </div>
        <div className='col-span-8'>
          <div className='grid grid-cols-4 gap-5 mb-8'>
            {['Today Sell Amount', 'Today Income', 'Today Due', 'Expense Amount'].map((title, index) => (
              <div key={index} className='bg-white p-4 rounded-xl shadow-md'>
                <div className='text-lg font-semibold'>{title}</div>
                <div className='text-2xl'>$0</div>
                <div className='text-sm text-green-500'>+0.00% Since last month</div>
              </div>
            ))}
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <div className='bg-white text-2xl font-semibold drop-shadow-md rounded-xl '>
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
            <div className=' bg-white text-2xl font-semibold drop-shadow-md rounded-xl'>
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
        </div>
        <div className='col-span-1'></div>
      </div>
    </div>
  )
}

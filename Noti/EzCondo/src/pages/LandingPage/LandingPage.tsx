import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className='flex h-screen'>
      <div className='m-auto text-4xl'>
        <Link to='/login'>Login</Link>
      </div>
    </div>
  )
}

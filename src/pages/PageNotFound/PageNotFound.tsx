export default function PageNotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4'>
      <h1 className='text-9xl font-bold text-blue-600 animate-bounce'>404</h1>
      <h2 className='text-4xl font-semibold mt-4'>Page Not Found</h2>
      <p className='mt-2 text-lg text-center text-gray-500 max-w-md'>
        It looks like you've wandered into a place that doesn't exist. Please go back or check the URL.
      </p>
      <button
        onClick={() => window.history.back()}
        className='mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition cursor-pointer'
      >
        Go Back
      </button>
    </div>
  )
}

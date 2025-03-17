import { SearchProvider } from './components/Search/SearchContext'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'

function App() {
  const routeElements = useRouteElements()
  return (
    <SearchProvider>
      {' '}
      {/* Bọc toàn bộ ứng dụng */}
      <div>
        {routeElements}
        <ToastContainer />
      </div>
    </SearchProvider>
  )
}

export default App

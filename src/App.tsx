import { SearchProvider } from './components/Search/SearchContext'
import useRouteElements from './useRouteElements'
import useRouteManagerElements from './useRouteManagerElements'
import { ToastContainer } from 'react-toastify'

function App() {
  const routeElements = useRouteElements()
  const routeManagerElements = useRouteManagerElements()
  return (
    <SearchProvider>
      {' '}
      {/* Bọc toàn bộ ứng dụng */}
      <div>
        {routeElements || routeManagerElements}
        <ToastContainer />
      </div>
    </SearchProvider>
  )
}

export default App

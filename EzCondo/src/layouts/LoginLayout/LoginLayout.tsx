import Footer from '~/components/Footer'
import Header from '~/components/Header'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'

interface Props {
  children?: React.ReactNode
}

export default function LoginLayout({ children }: Props) {
  return (
    <div>
      <Header />
      <SideBarAdmin />
      {children}
      <Footer />
    </div>
  )
}

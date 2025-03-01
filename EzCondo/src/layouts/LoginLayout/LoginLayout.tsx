import Footer from '~/components/Footer'
import Header from '~/components/Header'

interface Props {
  children?: React.ReactNode
}

export default function LoginLayout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

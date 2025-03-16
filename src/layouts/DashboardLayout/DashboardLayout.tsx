import React from 'react'
import Header from '~/components/Header'

interface Props {
  children?: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

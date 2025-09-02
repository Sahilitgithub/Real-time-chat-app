import React from 'react'
import DesktopSidebar from './DesktopSidebar'
import MobileFooter from './MobileFooter'
import getCurrentUser from '@/app/actions/getCurrentUser'

const Sidebar = async ({children}: {children: React.ReactNode}) => {
  const currentUser = await getCurrentUser();
  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className='lg:pl-20 h-full bg-gradient-to-t from-teal-200 to-teal-500 border-r-1 border-gray-500'>
        {children}
      </main>
    </div>
  )
}

export default Sidebar

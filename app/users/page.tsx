export const dynamic = 'force-dynamic'; // Ensure the page is always rendered on the server
import { auth } from '@/auth'
import EmptyState from '../components/EmptyState'
import { redirect } from 'next/navigation';

const Users = async () => {
  const session = await auth();
  const user = session?.user;
  if(!user){
    redirect('/')
  }
  return (
    <div className='hidden lg:block lg:pl-80 h-full'>
      <EmptyState />
    </div>
  )
}

export default Users

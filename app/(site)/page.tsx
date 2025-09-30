import AuthForm from "./components/AuthForm"
import Image from 'next/image'

const Home = () => {
  return (
    <div 
    className="flex flex-col bg-gray-100 min-h-full justify-center py-12 sm:px-6 lg:px-8 ">
     <div className="sm:mx-auto sm:w-full sm:max-w-md">
       <Image 
       src='/images/messenger-logo.png'
       alt="Messenger Logo"
       width='48'
       height='48'
       className="mx-auto w-auto" />
       <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-gray-900" >
          Sign in to your account
       </h1>
     </div>
       <AuthForm /> 
    </div>
  )
}

export default Home

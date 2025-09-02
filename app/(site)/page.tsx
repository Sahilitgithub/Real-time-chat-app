import Image from "next/image";
import AuthForm from "./components/AuthForm";


export default function Home() {
  return (
   <main 
   className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100" >
     <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Image 
      src="/images/messenger-logo.png"
      alt="Logo"
      width="48"
      height="48"
      className="mx-auto w-auto"
      />
      <h1 className="mt-3 font-bold text-center text-3xl tracking-tight text-gray-950">Welcome to the Chat App</h1>
     </div>
     {/* Auth Form */}
      <AuthForm />
   </main>
  );
}

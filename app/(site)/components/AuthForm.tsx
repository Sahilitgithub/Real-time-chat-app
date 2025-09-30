"use client";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session?.status === "authenticated"){
       router.push('/users')
    }
  }, [session?.status, router])

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      // Axios Register
      await axios.post('/api/register', data)
      .then(() => {
        router.push('/users')
      })
       .catch(() => toast.error("Something went wrong!"))
       .finally(() => setIsLoading(false))
     
    }

    if (variant === "LOGIN") {
      // next-auth sign in
      await signIn('credentials', {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if(callback?.error ){
          toast.error("Invalid Credentials")
        }
        if(callback?.ok && !callback.error){
          toast.success("LoggIn!")
          router.push('/users')
        }
      })
      .finally(() => setIsLoading(false))
    }
  };

  const socialLogin = async (action: string) => {
    setIsLoading(true);
    
    await signIn(action, {redirectTo: '/users'})
  };

  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-4 shadow rounded-lg sm:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {variant === "REGISTER" && (
            <Input
              label="Name"
              id="name"
              type="text"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}

          <Input
            label="Email"
            id="email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Button 
          fullWidth
          disabled={isLoading}
          type="submit"
           >
            {variant === "LOGIN" ? "Sign in" : "Register"}
          </Button>
        </form>
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Auth Social button */}
          <div className="mt-4 flex gap-3">
            <AuthSocialButton 
            icon={BsGoogle}
            onClick={() => socialLogin('google')} />

            <AuthSocialButton 
            icon={BsGithub}
            onClick={() => socialLogin('github')} />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN" ? "New to Messenger?" : "Already have an account?"}
          </div>
          <div 
          onClick={toggleVariant}>
            <span className="underline cursor-pointer">
              {variant === "LOGIN" ? "Create an account" : "Login"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

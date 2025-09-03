"use client";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Button from "../../components/Button";
import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";
import toast from "react-hot-toast";
import {signIn, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      // Redirect or perform some action
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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    
    if (variant === "REGISTER") {
      // Register logic here
      axios.post('/api/register', data)
      .then(() => signIn('credentials', {...data, redirect: true, callbackUrl: '/users'}))
      .catch(() => toast.error("Something Went Wrong!"))
      .finally(() => setIsLoading(false));
    } 
    if(variant === "LOGIN") {
      // Login logic here
      signIn("credentials", {...data, redirect: true, callbackUrl: '/users'})
      .then((callback) => {
        if(callback?.error) {
          toast.error("Invalid Credentials")
        }
        if(callback?.ok && !callback?.error) {
          toast.success("Logged In!")
          router.push('/users');
        }
      }).finally(() => setIsLoading(false))
    }
  };

  /// Social action function
  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { callbackUrl: `${window.location.origin}/users`, redirect: true })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials");
        }
        if (callback?.ok && !callback?.error) {
        toast.success("Logged In!");
      }
    }).finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-slate-900 px-4 py-6 shadow rounded-lg sm:px-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              type="text"
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            type="email"
            id="email"
            label="Email Address"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div className="mt-3">
            <Button disabled={isLoading} type="submit" fullWidth>
              {variant === "LOGIN" ? "Log In" : "Register"}
            </Button>
          </div>
        </form>

        {/* Or sign in/sing up with */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white rounded-md px-2 text-gray-500">Or</span>
            </div>
          </div>
          {/* Social Login Button */}
          <div className="flex mt-3 gap-2">
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
          </div>
        </div>
        {/* If user not exist */}
        <div className="flex gap-2 justify-center text-sm mt-4 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "Don't have an account?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

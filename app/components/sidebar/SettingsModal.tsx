'use client'
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../inputs/Input";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import Button from "../Button";

interface SettingsModalProps {
    isOpen?: boolean;
    onClose: () => void;
    currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser
 }) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        }
    });

    const image = watch("image");

    // @ts-expect-error client component
    const handleUpload = async (result) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true
        });
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        axios.post('/api/settings', data)
        .then(() => {
            router.refresh();
            onClose();
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Edit your public profile information.
                </p>
                <div className="mt-4 flex flex-col gap-y-8 !text-black">
                    <Input 
                        disabled={isLoading}
                        label="Name"
                        id="name"
                        type="text"
                        errors={errors}
                        required
                        register={register}
                    />
                    <div>
                        <label htmlFor="Photo" 
                        className="block text-sm font-medium leading-6 text-gray-900" >Photo</label>
                        <div 
                        className="mt-2 flex items-center gap-x-3">
                            <Image 
                            src={image || currentUser?.image || "/images/placeholder.jpg"}
                            alt="Profile Photo"
                            className="rounded-full"
                            width="48"
                            height="48"
                            />
                            <CldUploadWidget 
                            options={{maxFiles: 1}}
                            uploadPreset="real-time-chat-app" 
                            onSuccess={handleUpload} >
                                {({ open }) => (
                                    <Button 
                                    disabled={isLoading}
                                    type="button"
                                    secondary
                                    onClick={open}
                                    >
                                        Change
                                    </Button>
                                )}
                            </CldUploadWidget>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="mt-4 flex items-center justify-end gap-x-4" >
                 <Button 
                 type="button"
                 disabled={isLoading}
                 secondary
                 onClick={onClose} >
                    Cancel
                </Button> 
                <Button  
                disabled={isLoading}
                type="submit" >
                    Save
                </Button>                      
            </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal

'use client';

import Input from "@/app/components/inputs/Input";
import Modal from "@/app/components/Modal";
import  Select from "../../components/inputs/Select";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[]
}

const GroupChatModal:React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users
}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {register, handleSubmit, watch, setValue, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: []
    }
  });

  const members = watch('members');

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios.post('/api/conversations', {
      ...data,
      isGroup: true
    })
    .then(() => {
      router.refresh();
      onClose()
    })
    .catch(() => toast.error("Something went wrong!"))
    .finally(() => setIsLoading(false))

  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-10">
          <div className="border-b border-gray-900/10 pb-4">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Create a group chat
            </h2>
            <p className="mt-1 text-sm text-gray-600 leading-6">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-3 flex flex-col gap-y-6">
              <Input 
              type="text"
              id="name"
              label="Name"
              disabled={isLoading}
              required 
              register={register}
              errors={errors} />

              <Select 
              disabled={isLoading}
              label="Members"
              options={users.map((user) => ({
                value: user.id,
                label: user.name ?? "Unknown"
              }))} 
              onChange={(value) => setValue("members", value, {
                shouldValidate: true
              })}
              value={members} />

            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-x-6">
           <Button 
           disabled={isLoading}
           onClick={onClose}
           type="button"
           secondary >
            Cancel 
           </Button>
           <Button 
           type="submit"
           disabled={isLoading} >
            Create
           </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal 

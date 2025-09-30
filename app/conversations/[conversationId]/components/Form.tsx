"use client"
import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { CldUploadWidget } from 'next-cloudinary'

const Form = () => {
  const { conversationId } = useConversation();

  const {register, handleSubmit, setValue, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
        message: ''
    }
  });

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', {shouldValidate: true});
    axios.post(`/api/messages`, {
        ...data,
        conversationId
    }) 
  }

  return (
    <div 
    className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full' >
      <CldUploadWidget 
      options={{maxFiles: 1}}
      uploadPreset='realtime-chat-app' 
      onSuccess={(result) => {
        const imageUrl =
          result &&
          result.info &&
          typeof result.info === 'object' &&
          'secure_url' in result.info
            ? (result.info as { secure_url: string }).secure_url
            : undefined;

        if (imageUrl) {
          axios.post('/api/messages', {
            image: imageUrl,
            conversationId
          });
        }
        
      }} >
        {({open}) => {
          return (
            <button onClick={() => open()}>
              <HiPhoto size={30} className='text-sky-500' />
            </button>
          )
        }}
      </CldUploadWidget>
      <form onSubmit={handleSubmit(onSubmit)} 
      className='flex items-center gap-2 lg:gap-4 w-full' >
        <MessageInput 
        id="message"
        register={register}
        errors={errors}
        required
        placeholder="Write a message"  />
        <button 
        type='submit'
        className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'>
            <HiPaperAirplane size={18} 
            className='text-white' />
        </button>
      </form>
    </div>
  )
}

export default Form

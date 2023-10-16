'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import qs from 'query-string'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'


const formSchema = z.object({
    name: z.string().min(1,{
        message:'Channel name is required.'
    }).refine(
        name => name !== 'general',{
            message:"Channel name can not be 'general'"
        }
    ),
    type:z.nativeEnum(ChannelType)
})

const CreateChannelModal = () => {
    const router = useRouter()
    const {isOpen,onClose,type} = useModal()
    const isModalOpen = isOpen && type === 'createChannel'
    const params = useParams();
    
    const form = useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:'',
            type: ChannelType.TEXT
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values:z.infer<typeof formSchema>) =>{
       try {   
        const url = qs.stringifyUrl({
            url: '/api/channels',
            query:{
                serverId:params?.serverId
            }
        })

         await axios.post(url,values)
         form.reset();
         router.refresh()
         onClose()

       } catch (error) {
        console.log(error);
       }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-center text-2xl font-bold">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <FormField
                             control={form.control}
                             name='name'
                             render={({field}) =>(
                                <FormItem>
                                    <FormLabel 
                                    className='
                                    uppercase text-xs font-bold text-zinc-500
                                    dark:text-secondary/70
                                    '>
                                        Channel name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                        disabled={isLoading}
                                        className='bg-zinc-300/50 border-0
                                        focus-visible:ring-0 text-black
                                        focus-visible:ring-offset-0'
                                        placeholder='Enter channel name'
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                             )}
                             />

                             <FormField 
                             control={form.control}
                             name='type'
                             render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                    className='
                                    uppercase text-xs font-bold text-zinc-500
                                    dark:text-secondary/70
                                    '
                                    >Channel Type</FormLabel>
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                            className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'
                                            >
                                                <SelectValue placeholder='Select a channel type' />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {Object.values(ChannelType).map(type => (
                                                <SelectItem className='capitalize' key={type} value={type}>{type.toLowerCase()}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                             )}
                             />
                        </div>

                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant='primary' disabled={isLoading}>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default CreateChannelModal;
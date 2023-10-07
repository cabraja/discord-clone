'use client'

import { UploadDropzone } from "@/lib/uploadthing";
import '@uploadthing/react/styles.css'
import { X } from "lucide-react";
import Image from 'next/image'

type FileUploadProps ={
    onChange: (url?:string) => void;
    value:string;
    endpoint: 'serverImage' | 'messageFile';
}

const FileUpload = ({onChange,endpoint,value}:FileUploadProps) => {
    const fileType = value?.split('.').pop();

    if(value && fileType !== 'pdf'){
        return(
            <div className="relative h-20 w-20">
                <Image fill src={value} alt="Server image" className="rounded-full"/>
                <button
                onClick={() => onChange('')}
                className="bg-rose-500 text-white rounded-full absolute top-0 right-0 shadow-sm"
                type="button"
                >
                    <X  className="h-5 w-5"/>
                </button>
            </div>
        )
    }
    

    return ( 
    <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={res => {
            onChange(res?.[0].url)
        }}
        onUploadError={(error:Error) => {
            console.log(error);
            
        }}
    />
    );
}
 
export default FileUpload;
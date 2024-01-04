import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'

type ProfileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
}

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop, accept: {
            'image/*': ['.png', '.jpeg', '.jpg'],
        }
    })

    return (
        <div {...getRootProps()} className='flex flex-center flex-col'>
            <input {...getInputProps()} className='cursor-pointer' />

            <div className="cursor-pointer flex-center gap-5">
                <img src={fileUrl || "/assets/icons/profile-placeholder.svg"} alt="pf-image"
                    className='h-24 w-24 rounded-full object-cover object-top' />
                <p className="text-primary-500 small-regular md:base-semibold">
                    Click to change profile photo
                </p>
            </div>
        </div>
    )
}

export default ProfileUploader
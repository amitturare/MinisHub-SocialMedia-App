import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    // mediaUrl: string;
    setFileUrl: (url: string) => void;
}

const ProfileUploader = ({ fieldChange, setFileUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);

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
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            Change image
        </div>
    )
}

export default ProfileUploader
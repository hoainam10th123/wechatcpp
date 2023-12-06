import { useRef } from "react"
import { Photo } from '@mui/icons-material'
import { useStore } from "../../stores/stores"
import { Files } from "../../stores/socketStore"
import { toast } from "react-toastify"


export default function PhotoAttach() {
    const inputRef = useRef<any>(null)
    const { 
        socketStore:{clearFiles, sendFile},
        conversationStore: {activeUserchating}
    } = useStore()

    const onChangeHandler = (event: any)=>{
        let isLargeFile = false
        const files = Array.from<File>(event.target.files)
        
        clearFiles()
        
        const tempFiles: Files[] = []
        let countFile = 0

        files.forEach((file: File)=>{            
            if(file.size >= 10*1024*1024){
                toast.error('Kich thuoc file qua lon, chi nhan file nho hon 10MB')
                isLargeFile = true
                return;
            }            
        })

        if(!isLargeFile)
            files.forEach((file: File)=>{            
                countFile++
                tempFiles.push({file, fileName: file.name })
                if(files.length === countFile)
                    sendFile(tempFiles, activeUserchating?._id!)
            })

        // files.forEach(file =>{
        //     const reader = new FileReader()
        //     reader.readAsDataURL(file)
        //     reader.onload = (e)=>{
        //         addFile({file, imgData: e.target?.result})                
        //     }
        // })        
    }

    return (
        <div onClick={()=> inputRef.current.click()}>
            <Photo />
            <input 
                type="file" 
                multiple hidden ref={inputRef} 
                accept="image/png,image/jpeg,image/gif"
                onChange={onChangeHandler} />
        </div>
    )
}
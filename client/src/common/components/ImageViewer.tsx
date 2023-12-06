import { Box } from "@mui/material";
import { Close } from '@mui/icons-material'
import { useStore } from "../../stores/stores";


export default function ImageViewer(){
    const { commonStore: {showImageViewer, imgUrl} } = useStore()

    return (
        <Box sx={{textAlign:'center', position:'relative'}}>
            <div style={{position:'absolute', top: 2, left: 5}} onClick={()=>showImageViewer(false)}>
                <Close sx={{fontSize: 30}} />
            </div>
            <img alt={imgUrl} style={{marginTop: 4}} width={450} height={450} src={imgUrl} />
        </Box>
    )
}
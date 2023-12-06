import { Box, TextField, Popover, Button } from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from "react";
import { useStore } from "../../stores/stores";
import PhotoAttach from "./PhotoAttach";



export default function ChatFooter() {
    const { conversationStore, socketStore, commonStore: { setIsScrollToBottom} } = useStore()
    const [message, setMessage] = useState('')
    const [typeing, setTyping] = useState(false)    

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const click = (emojiData: EmojiClickData, event: MouseEvent)=>{
        setMessage(message + emojiData.emoji)
    }

    const enterText = (event: any) =>{
        if (event.target.value.trim().length > 0 && event.key === "Enter") {
            const userNhan = conversationStore.activeUserchating
            socketStore.sendMsg(message, userNhan?._id!)            
            setMessage('')
            setIsScrollToBottom(false)
        }
    }

    const onChangeHandler = (event: any) =>{
        setMessage(event.target.value);
        if(!typeing) {
            setTyping(true)
            socketStore.typeing(conversationStore.activeUserchating?._id!)
        }
        const lastTypeing = new Date().getTime()
        const timer = 2000
        setTimeout(()=>{
            const timeNow = new Date().getTime()
            const timeDiff = timeNow - lastTypeing
            if(timeDiff >= timer && typeing) {
                socketStore.stopTypeing(conversationStore.activeUserchating?._id!)
                setTyping(false)
            }                
        }, timer) 
        
        if(!socketStore.isSeen){
            const lastMessage = socketStore.messages.slice(-1)[0];
            socketStore.setSeenMessage(true)
            socketStore.seenMessage(conversationStore.activeUserchating?._id!, lastMessage._id)
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                    id="outlined-basic"
                    fullWidth
                    value={message || ''}
                    onChange={(event) => {
                        onChangeHandler(event)
                    }}
                    onKeyDown={(e) => enterText(e)}
                />                

                <Box sx={{ display: 'flex' }}>
                    <AddCircleOutlineIcon style={{ margin: 5 }} />
                    <AttachFileIcon style={{ margin: 5 }} />
                </Box>

                <PhotoAttach />

                <>
                    <Button style={{padding: 0}} aria-describedby={id} onClick={handleClick}>
                        <SentimentSatisfiedAltIcon />
                    </Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <EmojiPicker onEmojiClick={click} />
                    </Popover>                    
                </>                
            </Box>
        </>

    )
}
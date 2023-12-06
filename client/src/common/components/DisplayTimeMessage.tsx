import { Avatar, Box } from "@mui/material";
import { useStore } from "../../stores/stores";
import { observer } from "mobx-react-lite";


export default observer(function DisplayTimeMessage() {
    const { userStore, socketStore: { messages, isSeen } } = useStore()

    const checkIsLastMessageSender = () => {
        const lastElement = messages.slice(-1)[0];
        if (lastElement) {
            const now = new Date().getTime()
            const senderDate = new Date(lastElement.messageSent).getTime()
            const diffTime = now - senderDate
            const xMinute = 1*60*1000
            // last message is of sender
            if ((userStore.user?._id === lastElement.sender._id || 
                userStore.user?._id === lastElement.recipient._id) && diffTime >= xMinute 
                && lastElement.dateRead) {
                return (
                    <div style={{ fontSize: 11, color: 'gray' }}>
                        last seen {new Date(lastElement.dateRead).toLocaleTimeString()}
                    </div>
                )
            }
            else if(isSeen){
                return (
                    <Avatar sx={{ width: 13, height: 13 }} alt="Remy Sharp" src={'./assets/thiennhien.jpg'} />
                )
            }else{
                return null
            }
        }
        return null
    }

    return (
        <div style={{ marginBottom: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {checkIsLastMessageSender()}
            </Box>
        </div>
    )
})
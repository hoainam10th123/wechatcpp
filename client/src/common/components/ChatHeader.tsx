import { Avatar, Box } from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import { observer } from 'mobx-react-lite';
import { useStore } from "../../stores/stores";
import { ChuHoaDau } from "../utils/string";
import moment from 'moment';

export default observer(function ChatHeader() {
    const { conversationStore, socketStore, commonStore } = useStore()
    const { activeUserchating } = conversationStore

    const checkOnline = () => {
        const isOnline = socketStore.usersOnline.some(x => x._id === activeUserchating!._id)
        if (isOnline) return true
        return false
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar className="border" sx={{ width: 55, height: 55 }} alt="Remy Sharp" src={activeUserchating?.picture || './assets/user.png'} />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 6 }}>
                    <strong>{ChuHoaDau(activeUserchating?.displayName!)}</strong>
                    {
                        checkOnline() ? <div style={{ color: 'grey', fontSize: 15 }}>online</div>
                            : <div style={{ color: 'grey', fontSize: 15 }}>{moment(activeUserchating?.lastActive).fromNow()}</div>
                    }
                </div>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div onClick={() => {
                    commonStore.setOpenCuocGoiDi(true)                                    
                }}>
                    <CallIcon className="styleIconCall" />
                </div>

                <VideocamIcon className="styleIconCall" />
                <InfoIcon className="styleIconCall" />
            </Box>
        </Box>
    )
})
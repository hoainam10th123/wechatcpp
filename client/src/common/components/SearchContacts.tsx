import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';
import { IUser } from "../../models/user"
import { useStore } from '../../stores/stores';
import CircleIcon from '@mui/icons-material/Circle';
import { toast } from 'react-toastify';

interface Props {
    users: IUser[]
}

export default function SearchContacts({ users }: Props) {

    const { conversationStore, socketStore, userStore: {user} } = useStore()

    const selectUser = (userNhan: IUser) => {
        if(user!._id === userNhan._id){
            toast.error('You can not send message yourself')
        }else{
            conversationStore.setActiveUserChating(userNhan)        
            // get message from socket server
            socketStore.joinConversation(userNhan._id)
        }        
    }

    const displayOnlineIcon = (user: IUser) => {
        const isOnline = socketStore.usersOnline.some(x => x._id === user._id)
        if (isOnline) return true
        return false
    }

    return (
        <Box>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {users.map((conv, index) => (
                    <div key={index}>
                        <ListItem alignItems="center" className='hoverSidebarBody'
                            onClick={() => selectUser(conv)}>

                            <div style={{ position: 'relative' }}>
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={conv.picture || './assets/user.png'} />
                                </ListItemAvatar>
                                {displayOnlineIcon(conv) && (
                                    <div
                                        style={{
                                            color: 'green',
                                            position: 'absolute',
                                            bottom: -5,
                                            right: 16
                                        }}>
                                        <CircleIcon style={{ fontSize: 12 }} />
                                    </div>
                                )}
                            </div>

                            <ListItemText
                                primary={conv.displayName}
                                secondary={
                                    conv.status
                                }
                            />
                        </ListItem>

                        {index !== users.length - 1 ? (<Divider variant="inset" component="li" />) : null}
                    </div>
                ))}
            </List>
        </Box>
    )
}
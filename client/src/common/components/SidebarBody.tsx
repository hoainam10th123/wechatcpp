import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import moment from 'moment';
import { IConversation } from '../../models/conversation';
import { useStore } from '../../stores/stores';
import { IUser } from '../../models/user';
import { observer } from 'mobx-react-lite';
import CircleIcon from '@mui/icons-material/Circle';
import { toast } from 'react-toastify';


interface Props {
    conversations: IConversation[]
}

export default observer(function SidebarBody({ conversations }: Props) {
    const { userStore, conversationStore, socketStore } = useStore()

    const getSenderUser = (users: IUser[]) => {
        const receiverUser = userStore.user?._id === users[0]._id ? users[1] : users[0]
        return receiverUser
    }

    const selectContacToChat = async (conv: IConversation) => {
        if (socketStore.messages.length > 0) socketStore.clearMessages()

        if (conversationStore.activeUserchating) {
            const lastUser = conversationStore.activeUserchating
            socketStore.leaveRoom(lastUser._id)
        }
        const sender = getSenderUser(conv.users)
        if (userStore.user?._id !== sender._id) {
            conversationStore.setActiveUserChating(sender)
            // get message from socket server
            socketStore.joinConversation(sender._id)
        } else {
            toast.error('You can not send message yourself')
        }


    }

    const displayOnlineIcon = (conv: IConversation) => {
        const sender = getSenderUser(conv.users)
        const isOnline = socketStore.usersOnline.some(x => x._id === sender._id)
        if (isOnline) return true
        return false
    }

    return (
        <Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {conversations.map((conv, index) => (
                    <div key={index} className='hoverSidebarBody'>
                        <Box sx={conversationStore.activeUserchating?._id === getSenderUser(conv.users)._id ?
                            { backgroundColor: 'blanchedalmond', borderRadius: 2 } : {  }}>
                            
                            <ListItem alignItems="center" onClick={() => selectContacToChat(conv)}>

                                <Box sx={{ position: 'relative' }}>
                                    <ListItemAvatar>
                                        <Avatar className="border" alt={getSenderUser(conv.users).displayName} src={getSenderUser(conv.users).picture || './assets/user.png'} />
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
                                </Box>

                                <ListItemText
                                    primary={getSenderUser(conv.users).displayName}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {userStore.user?._id === conv.latestMessage?.sender._id ? 'You ' : ''}
                                            </Typography>
                                            {conv.latestMessage?.content}
                                        </React.Fragment>
                                    }
                                />
                                <ListItemText secondary={moment(conv.latestMessage?.createdAt).fromNow()} />
                            </ListItem>

                            {index !== conversations.length - 1 ? (<Divider variant="inset" component="li" />) : null}
                        </Box>

                    </div>
                ))}
            </List>
        </Box>
    )
})
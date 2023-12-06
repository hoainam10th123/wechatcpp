import { CircularProgress, Grid } from "@mui/material";
import SidebarHeader from "../../common/components/SidebarHeader";
import SidebarBody from "../../common/components/SidebarBody";
import { useEffect, useState } from "react";
import { useStore } from "../../stores/stores";
import { observer } from 'mobx-react-lite';
import { IUser } from "../../models/user";
import SearchContacts from "../../common/components/SearchContacts";
import DefaultMainChat from "../../common/components/DefaultMainChat";
import ChatContainer from "./ChatContainer";
import AlertDialog from "../../common/components/videocall/AlertDialog";
import VideocallDi from "../../common/components/videocall/videocallDi";
import VideoCallDen from "../../common/components/videocall/videoCallDen";

export default observer(function ChatHome() {
    const { conversationStore, commonStore, peerSenderStore } = useStore();
    const { conversations, loading, activeUserchating } = conversationStore
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        conversationStore.getConversations().then(() => {
            console.log('get conversations success')
        })
    }, [conversationStore])

    function dataUsersReturn(data: IUser[]) {
        setUsers(data)
    }

    function ViewSidebarBodyAndContacts() {
        if (users.length > 0) {
            return <SearchContacts users={users} />
        } else {
            return <SidebarBody conversations={conversations} />
        }
    }

    return (
        <Grid container spacing={2} sx={{ position: 'relative' }}>
            <Grid item xs={4}>
                <SidebarHeader callbackContact={dataUsersReturn} />
                {
                    loading ? <CircularProgress color="secondary" />
                        : <ViewSidebarBodyAndContacts />
                }
            </Grid>

            <Grid item xs={8}>
                {
                    !activeUserchating && <DefaultMainChat />
                }
                {
                    activeUserchating && <ChatContainer />
                }
            </Grid>

            {commonStore.open && <AlertDialog />}

            {commonStore.openCuocGoiDen && (
                <div className="dinhViVideoCallUI">
                    <VideoCallDen />
                </div>
            )}

            {
                commonStore.openCuocGoiDi && (
                    <div className="dinhViVideoCallUI">
                        <VideocallDi />
                    </div>
                )
            }

        </Grid>
    )
})
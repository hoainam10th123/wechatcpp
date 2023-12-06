import { Avatar, Box } from "@mui/material";
import { IMessage } from "../../models/message"
import QuiltedImageList from "./StandardImageList";


interface Props {
    message: IMessage;
}

export default function MessageLeft({ message }: Props) {

    const renderMessage = () => {

        if (message.content !== '') {
            return (
                <div style={{ marginBottom: 8 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Avatar className="border" style={{ marginRight: 4 }} alt="Remy Sharp" src={'./assets/user.png'} />

                        <div className="messageLeft">
                            {message.content}
                        </div>
                    </Box>
                </div>
            )
        } else if (message.files.length > 0) {
            return <QuiltedImageList images={message.files} />
        }else return null
    }

    return renderMessage()
}
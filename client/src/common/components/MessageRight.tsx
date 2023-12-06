import { Box } from "@mui/material";
import { IMessage } from "../../models/message"
import QuiltedImageList from "./StandardImageList";


interface Props {
    message: IMessage;
}

export default function MessageRight({ message }: Props) {

    const renderMessage = () => {
        if (message.content !== '') {
            return (
                <div style={{marginTop: 4}}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="messageRight">
                            {message.content}
                        </div>
                    </Box>
                </div>
            )
        } else if (message.files.length > 0) {
            return <QuiltedImageList images={message.files} />
        } else return null
    }

    return renderMessage()
}
import ChatBody from "../../common/components/ChatBody";
import ChatFooter from "../../common/components/ChatFooter";
import ChatHeader from "../../common/components/ChatHeader";
import ImageViewer from "../../common/components/ImageViewer";
import { useStore } from "../../stores/stores";
import { observer } from "mobx-react-lite";

export default observer(function ChatContainer() {
    const { commonStore: { isShow } } = useStore()

    return (
        <>        
            <ChatHeader />
            {isShow && <ImageViewer />}
            {!isShow && <ChatBody />}
            {!isShow && <ChatFooter />}
        </>
    )
})
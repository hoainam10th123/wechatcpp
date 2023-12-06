import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/stores';
import MessageLeft from './MessageLeft';
import MessageRight from './MessageRight';
import { IMessage } from '../../models/message';
import DisplayTimeMessage from './DisplayTimeMessage';
import { useEffect, useRef } from 'react';
import { BeatLoader } from 'react-spinners'


export default observer(function ChatBody() {
    const { userStore, socketStore, conversationStore, commonStore:{ isScrollToBottom, setIsScrollToBottom} } = useStore()
    const endRef = useRef<any>() 

    const RenderMessage = (mess: IMessage) => {
        if (userStore.user?._id === mess.sender._id) {
            return <MessageRight key={mess._id} message={mess} />
        } else {
            return <MessageLeft key={mess._id} message={mess} />
        }
    }

    useEffect(() => {
        scrollToBottom()       
    }, [socketStore.messages.length, socketStore.isTyping])

    const scrollToBottom = () => {
        endRef.current.scrollIntoView({ behavior: "smooth" })
        setIsScrollToBottom(true)
    }

    const renderTyping = () => {
        if (socketStore.isTyping) {
            return <BeatLoader color="#000" size={8} />
        } else {
            return null
        }
    }

    const handleScroll = (e: any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

        if (bottom) {
            console.log('Bottom')
            //const lastMessage = socketStore.messages.slice(-1)[0]
            //socketStore.seenMessage(conversationStore.activeUserchating?._id!, lastMessage._id)
        }
    }    

    return (
        // thay chatBody background-image trong App.css
        <div className="chatBody" onScroll={handleScroll}>
            {
                socketStore.messages.map(mess => RenderMessage(mess))
            }

            {<DisplayTimeMessage />}

            {renderTyping()}

            <div ref={endRef}></div>
        </div>
    )
})
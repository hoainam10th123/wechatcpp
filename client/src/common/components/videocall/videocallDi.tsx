import { Fab } from "@mui/material";
import { CallEnd } from '@mui/icons-material';
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "../../../stores/stores";
import Draggable from 'react-draggable';
import { observer } from "mobx-react-lite";


// huy peerSenderStore tai chatHome
export default observer(function VideoCallUIDi() {
    const { commonStore, peerSenderStore } = useStore()
    let interval: any;
    const localVideoRef = useRef<any>();
    const remoteVideoRef = useRef<any>();
    const [activeDrags, setActiveDrags] = useState(0)

    const onStart = () => {
        setActiveDrags((prev) => ++prev);
    };

    const onStop = () => {
        setActiveDrags((prev) => --prev);
    };

    const dragHandlers = { onStart: onStart, onStop: onStop };

    const handleEndCall = () => {
        peerSenderStore.setNull()
        commonStore.setOpenCuocGoiDi(false)
    }

    useEffect(() => {
        try {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream=>{
                localVideoRef.current.srcObject = stream;                
                peerSenderStore.createPeer(stream)
            })
        } catch (error) {
            console.error(error)
            toast.error('Error while getUserMedia')
        }
    }, [peerSenderStore])

    useEffect(() => {
        // on("acceptedCall" socketStore
        if (peerSenderStore.peer)
            peerSenderStore.peer.signal(peerSenderStore.data);        
    }, [peerSenderStore, peerSenderStore.data])

    useEffect(() => {
        if (commonStore.clearIntervalTime) {
            clearInterval(interval)
        }
    }, [commonStore.clearIntervalTime])

    useEffect(() => {
        remoteVideoRef.current.srcObject = peerSenderStore.remoteStream;
    }, [peerSenderStore.remoteStream])

    return (
        <div style={{     
            display:'flex', 
            alignItems: 'center',              
            borderRadius: 5,
            backgroundColor: 'black',
            width: 'calc(100vh - 300px)',
            height: 'calc(100vh - 100px)',
        }}>
            {/* remote video */}
            <div style={{ objectFit: 'cover' }}>
                <video
                    width="100%"
                    height="auto"
                    ref={remoteVideoRef}
                    playsInline
                    muted
                    autoPlay
                ></video>
            </div>

            {/* local video */}
            <Draggable bounds="parent" {...dragHandlers}>
                <div style={{ position: 'absolute', bottom: 5, right: 6, border: '1px solid gray' }}>
                    <video
                        width={120}
                        height={100}
                        ref={localVideoRef}
                        playsInline
                        muted
                        autoPlay
                    ></video>
                </div>
            </Draggable>

            <div className="CallEndStyle" >
                <Fab color="error" size="medium" onClick={handleEndCall}>
                    <CallEnd />
                </Fab>
            </div>
        </div>
    )
})
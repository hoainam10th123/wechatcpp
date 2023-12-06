import { Fab } from "@mui/material";
import { CallEnd } from '@mui/icons-material';
import { useEffect, useRef, useState } from "react";
import { useStore } from "../../../stores/stores";
import Draggable from 'react-draggable';
import Peer from "simple-peer";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";

// khi bam chap nhan cuoc goi thi man hinh nay se hien len vao cuoc goi
export default observer(function VideoCallUIDen() {
    const { commonStore, socketStore } = useStore()
    const localVideoRef = useRef<any>();
    const remoteVideoRef = useRef<any>();
    const [activeDrags, setActiveDrags] = useState(0)
    let peer: any

    const onStart = () => {
        setActiveDrags((prev) => ++prev);
    };

    const onStop = () => {
        setActiveDrags((prev) => --prev);
    };

    const dragHandlers = { onStart: onStart, onStop: onStop };

    const handleEndCall = () => {
        commonStore.setOpenCuocGoiDen(false)
    }

    useEffect(() => {
        try {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream =>{
                localVideoRef.current.srcObject = stream;
                peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: stream,
                });
                peer.on("signal", (data: any) => {   
                    console.log(data)                 
                    socketStore.answerCall(commonStore.cuocGoiTuUser?._id!, data)                                    
                });
                peer.on("stream", (stream: any) => {
                    remoteVideoRef.current.srcObject = stream;
                });
                peer.signal(socketStore.signalData) 
            })
        } catch (error) {
            console.error(error)
            toast.error('Error while getUserMedia')
        }
    }, [socketStore, commonStore])

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
                        width={160}
                        height={120}
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
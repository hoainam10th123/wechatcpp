import { Grid } from "@mui/material";
import { useEffect, useRef } from "react";
import Peer from "simple-peer";


export default function TestSimplePeer() {

    const localVideoRef = useRef<any>();
    const remoteVideo1Ref = useRef<any>();
    const remoteVideo2Ref = useRef<any>();


    const getuserMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            return stream
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getuserMediaStream().then(stream => {
            if (stream) {
                //localVideoRef.current.srcObject = stream;
                var peer1 = new Peer({ initiator: true, trickle: false, stream: stream })
                var peer2 = new Peer({ initiator: false, trickle: false, stream: stream })

                peer1.on('signal', data => {
                    peer2.signal(data)
                })

                peer2.on('signal', data => {
                    peer1.signal(data)
                })

                peer2.on('stream', stream => {
                    remoteVideo1Ref.current.srcObject = stream;
                })
                peer1.on('stream', stream => {
                    remoteVideo2Ref.current.srcObject = stream;
                })
            }
        })
    }, [])

    return (
        <Grid container spacing={2} sx={{ position: 'relative' }}>
            <Grid item xs={6}>
                <div>
                    <video
                        width="calc(100vh - 300px)"
                        height="calc(100vh - 100px)"
                        ref={remoteVideo1Ref}
                        playsInline
                        muted
                        autoPlay
                    ></video>
                    <div>Remote</div>
                </div>
            </Grid>

            <Grid item xs={6}>
                <div>
                    <video
                        width="calc(100vh - 300px)"
                        height="calc(100vh - 100px)"
                        ref={remoteVideo2Ref}
                        playsInline
                        muted
                        autoPlay
                    ></video>
                    <div>Remote</div>
                </div>
            </Grid>

        </Grid>
    )
}
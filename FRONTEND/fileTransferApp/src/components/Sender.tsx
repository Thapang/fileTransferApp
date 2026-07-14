import { useEffect, useRef, useState } from "react";
import { FileUploader } from "./FileUploader";
import { sendapi } from "../helper";

import {
    createPeer,
    createOffer,
    applyAnswer,
    waitForChannelOpen,
    watchConnectionState
} from "../cRTC";

export const Sender = () => {

    const [code, setCode] = useState("");

    const [connectionState, setConnectionState] =
        useState("Not Connected");

    const peerRef =
        useRef<RTCPeerConnection | null>(null);

    const channelRef =
        useRef<RTCDataChannel | null>(null);

    const eventSourceRef =
        useRef<EventSource | null>(null);

    async function establishConnection(roomCode: string) {

    if (
        !peerRef.current ||
        !channelRef.current ||
        eventSourceRef.current
    ) {
        return;
    }

    const peer = peerRef.current;
    const channel = channelRef.current;

    const eventSource = new EventSource(
        `${import.meta.env.VITE_SSE_API_URL}/receiveAnswers/${roomCode}`
    );

    eventSourceRef.current = eventSource;

    let handled = false;

    const cleanupEventSource = () => {

        eventSource.close();
        eventSourceRef.current = null;

    };

    

    eventSource.onmessage = async (event) => {

    console.log("SSE MESSAGE RECEIVED", event.data);

    if (handled) {
        return;
    }

    handled = true;

    // Close SSE immediately after receiving the answer
    cleanupEventSource();

    try {

        const {
            answerSDP,
            answerIceCandidates
        } = JSON.parse(event.data);

        await applyAnswer(
            peer,
            answerSDP,
            answerIceCandidates
        );

        await waitForChannelOpen(channel);

        await watchConnectionState(
            peer,
            setConnectionState
        );

        try {

            await sendapi.delete(
                `/deleteCode/${roomCode}`
            );

        } catch (err) {

            console.error(
                "Unable to delete Redis room.",
                err
            );

        }

    } catch (err) {

        console.error(err);

    }

};

eventSource.onerror = () => {

    // Ignore normal SSE close after receiving the answer
    if (eventSource.readyState === EventSource.CLOSED) {
        return;
    }

    console.error("SSE connection error");

    cleanupEventSource();

};

}

    async function setUp() {

        try {

            // Generate room code
            const response =
                await sendapi.get("/generate");

            const generatedCode =
                response.data.code;

            // Show code immediately
            setCode(generatedCode);

            // User sees that backend setup is in progress
            setConnectionState(
                "Establishing Connection..."
            );

            // Create Peer
            const peer = createPeer();
            peerRef.current = peer;

            // Create Offer
            const {
                sdp,
                iceCandidates,
                channel
            } = await createOffer(peer);

            channelRef.current = channel;

            // Upload sender SDP + ICE
            await sendapi.post(
                "/senderInfo",
                {
                    code: generatedCode,
                    sdp,
                    iceCandidates
                }
            );

            // Sender is now completely ready
            setConnectionState(
                "Waiting for Receiver..."
            );

            // Start waiting for receiver
            void establishConnection(generatedCode);

        } catch (err) {

            console.error(err);

            setConnectionState("Failed");

        }

    }
        useEffect(() => {

        return () => {

            eventSourceRef.current?.close();
            eventSourceRef.current = null;

            peerRef.current?.close();
            peerRef.current = null;

            channelRef.current = null;

        };

    }, []);

    return (

        <div
            style={{
                maxWidth: "650px",
                margin: "30px auto",
                padding: "20px",
                border: "2px solid black",
                borderRadius: "10px",
                fontFamily: "Arial, sans-serif"
            }}
        >

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "25px"
                }}
            >

                <h2>
                    Send a File
                </h2>

                <p>
                    Generate a connection code and share
                    it with the receiver.
                </p>

            </div>

            <label
                style={{
                    fontWeight: "bold"
                }}
            >
                CONNECTION CODE
            </label>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginTop: "10px",
                    marginBottom: "25px"
                }}
            >

                <div
                    style={{
                        width: "170px",
                        height: "45px",
                        border: "2px solid black",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                        letterSpacing: "3px",
                        backgroundColor:
                            code ? "#ffffff" : "#f0f0f0"
                    }}
                >
                    {code || "------"}
                </div>

                <button
                    onClick={setUp}
                    disabled={!!code}
                    style={{
                        padding: "10px 18px",
                        cursor:
                            code
                                ? "not-allowed"
                                : "pointer"
                    }}
                >
                    Generate
                </button>

            </div>

            <div
                style={{
                    border: "1px solid gray",
                    borderRadius: "6px",
                    padding: "12px",
                    backgroundColor: "#f8f8f8",
                    marginBottom: "25px"
                }}
            >

                <strong>Status</strong>

                <div
                    style={{
                        marginTop: "8px",
                        fontSize: "17px",
                        fontWeight: "bold",
                        color:
                            connectionState === "connected"
                                ? "green"
                                : "#1565c0"
                    }}
                >
                    {connectionState}
                </div>

            </div>

            <FileUploader
                channel={channelRef.current}
            />

        </div>

    );

};
import { useState } from "react";
import { sendapi, receiveapi } from "../helper";

import {
    createPeer,
    createAnswer,
    waitForChannelOpen,
    watchConnectionState,
    receiveFile,
    waitForDataChannel
} from "../cRTC";

export const Receiver = () => {

    const [code, setCode] = useState("");

    const [connectionState, setConnectionState] =
        useState<RTCPeerConnectionState | "Not Connected">(
            "Not Connected"
        );

    async function establishConnection() {

        if (!code) {
            alert("Please enter the connection code.");
            return;
        }

        try {

            // Fetch Sender Offer
            const response = await receiveapi.get(

                "/receiveSenderInfo",
                {
                    params: {
                        code: code
                    }
                }
            );

            console.log("Complete Response:", response);
            console.log("Response Data:", response.data);
            console.log("SDP:", response.data.sdp);
            console.log("ICE:", response.data.ice);

            // Create Peer
            const peer = createPeer();

            // Create Receiver Answer
            const answer = await createAnswer(
                peer,
                response.data.sdp,
                response.data.ice
            );

            console.log("Receiver Answer:", answer);

            // Upload Receiver Answer
            await sendapi.post(
                "/answers",
                {
                    code: code,
                    sdp: answer.sdp,
                    iceCandidates: answer.iceCandidates
                }
            );

            // Wait for DataChannel
            // 
            
            const channel = await waitForDataChannel(peer);

            await waitForChannelOpen(channel);





            // Monitor connection
            watchConnectionState(
                peer,
                (state) => {

                    setConnectionState(state);

                    if (state === "connected") {

                        alert("Connection Established");

                        // Start receiving file
                        receiveFile(channel);

                    }

                }
            ).catch((err) => {

                console.error(err);

                alert(err.message);

            });

        } catch (err) {

            console.error("Receiver Error:", err);

            alert("Failed to establish connection.");

        }

    }

    return (

        <div
            style={{
                border: "2px solid black",
                padding: "20px"
            }}
        >

            <h2>Receive File</h2>

            <p>
                Enter the sender's connection code.
            </p>

            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Connection Code"
            />

            <br />
            <br />

            <button
                onClick={establishConnection}
            >
                Establish Connection
            </button>

            <br />
            <br />

            <strong>Status:</strong>{" "}
            {connectionState}

        </div>

    );

};
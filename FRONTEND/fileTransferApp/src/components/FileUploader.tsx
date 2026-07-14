import { useState, type ChangeEvent } from "react";
import {
    prepareFile,
    sendMetadata,
    sendFile,
    sendTransferComplete
} from "../cRTC";

type FileStatus = "idle" | "uploading" | "success" | "error";

interface FileUploaderProps {
    channel: RTCDataChannel | null;
}

export const FileUploader = ({ channel }: FileUploaderProps) => {

    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<FileStatus>("idle");

    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>
    ) {

        if (!event.target.files) return;

        setFiles(Array.from(event.target.files));
        setStatus("idle");

    }

    async function handleUpload() {

        if (!channel) {
            alert("Connection has not been established.");
            return;
        }

        if (channel.readyState !== "open") {
            alert("Data channel is not open.");
            return;
        }

        if (files.length === 0) {
            alert("Please select a file or folder.");
            return;
        }

        try {

            setStatus("uploading");

            const preparedFile = await prepareFile(files);

            sendMetadata(
                channel,
                preparedFile
            );

            await sendFile(
                channel,
                preparedFile
            );

            sendTransferComplete(
                channel
            );

            setStatus("success");

            alert("File sent successfully.");

        } catch (error) {

            console.error(error);

            setStatus("error");

            alert("Unable to send file.");

        }

    }

    return (

        <div style={{ marginTop: "20px" }}>

            <h3>Choose File / Folder</h3>

            <div>

                <label>Files</label>
                <br />

                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />

            </div>

            <br />

            <div>

                <label>Folder</label>
                <br />

                <input
                    type="file"
                    webkitdirectory=""
                    onChange={handleFileChange}
                />

            </div>

            <br />

            {files.length > 0 && (

                <div>

                    <p>
                        Selected Items : {files.length}
                    </p>

                    <hr />

                    {files.map((file) => (

                        <div key={file.name}>

                            <strong>{file.name}</strong>

                            <br />

                            Size :
                            {" "}
                            {(file.size / 1024).toFixed(2)}
                            {" "}
                            KB

                            <br />

                            Type :
                            {" "}
                            {file.type || "Folder"}

                            <br />
                            <br />

                        </div>

                    ))}

                </div>

            )}

            <button
                onClick={handleUpload}
                disabled={
                    files.length === 0 ||
                    status === "uploading"
                }
            >
                Send
            </button>

            <br />
            <br />

            <strong>FileStatus :</strong>
            {" "}
            {status}

        </div>

    );

}
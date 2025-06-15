import React, { useEffect, useState } from "react";
import API from '../api/axios';

const TestPage: React.FC = () => {
    const [getResponse, setGetResponse] = useState<string | null>(null);
    const [postResponse, setPostResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);



    // Call GET /api/test on mount
    useEffect(() => {
        API.get("/test/data")
            .then((res) => setGetResponse(JSON.stringify(res.data)))
            .catch((err) => setGetResponse("Error: " + err.message));
    }, []);

    // Call POST /api/test on button click
    const handlePost = () => {
        setLoading(true);
        API.post("/test/data", { message: "Hello from frontend!" })
            .then((res) => setPostResponse(JSON.stringify(res.data)))
            .catch((err) => setPostResponse("Error: " + err.message))
            .finally(() => setLoading(false));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Test Page</h2>

            <div>
                <h4>GET /api/test Response:</h4>
                <pre>{getResponse || "Loading..."}</pre>
            </div>

            <div style={{ marginTop: "2rem" }}>
                <button onClick={handlePost} disabled={loading}>
                    Send POST /api/test
                </button>
                <h4>POST Response:</h4>
                <pre>{postResponse || "Click the button to send POST."}</pre>
            </div>
        </div>
    );
};

export default TestPage;
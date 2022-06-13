import {useState, useCallback, useEffect} from "react";
import {  useParams } from 'react-router-dom';

import { io } from "socket.io-client";


function useWebhookRoom() {
    const [socket, setSocket] = useState();
    const { roomId } = useParams();

    useEffect(() => {
        setSocket(() => {
            return io("ws://localhost:3001", {
                reconnectionDelayMax: 10000,
                query: {
                    "room": roomId
                },
            });
        });
    }, [roomId]);

    // TOOD: Figure out connectToRoom logic

    useEffect(() => {
        socket.on()
    }, [socket]);




    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);


    const addResults = useCallback(val => {
        setResults(current => {
            return [...current, val];
        });
    }, [setResults]);   

    return {
        input, setInput,results, addResults
    };
}

export default useWebhookRoom;
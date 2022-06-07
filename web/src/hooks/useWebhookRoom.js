import {useState, useCallback} from "react";

function useWebhookRoom() {

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
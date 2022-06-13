import React, {createContext, useCallback, useContext} from "react";

import {  useParams, useLocation } from 'react-router-dom';

import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function useSocket() {
    const socketVal = useContext(SocketContext);
    if (socketVal === null) {
        throw new Error("Must use a SocketProvider");
    }
    return socketVal;
}

export function SocketProvider({children}) {
    const [socket, setSocket] = useState(null);

    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const setRoomId = useCallback((newId) => {
        // if not a change, ignore
        if (roomId === newId) {
            return;
        }
        // default to just navigate to new id
        let usePath = "/" + newId;
        // if there is already a room id, just replace in off chance we are using obs
        if (roomId) {

        }
        const newPathname = location.pathname.replace(roomId, )
    }, [location, roomId, navigate]);


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



    return (<SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>)
}
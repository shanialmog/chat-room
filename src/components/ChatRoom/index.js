import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import moment from 'moment'

const ChatRoom = (props) => {
    const [message, setMessage] = useState("")
    const [response, setResponse] = useState([])
    const [socket, setSocket] = useState(null)
    const [username, setUsername] = useState(props.username)


    useEffect(() => {
        const openSocket = io.connect()
        openSocket.on("msg", data => {
            setResponse((prevstate) => { return ([...prevstate, data]) });
            setSocket(openSocket)
        });
    }, []);

    useEffect(() => {
        setUsername(props.username);
    }, [props])
    
    const messagesEndRef = useRef(null)
    
    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }, [response]);

    const handleChange = (event) => {
        setMessage(event.target.value)
    }
    
    const sendMsg = (event) => {
        socket.emit("msg", { "message": message, "user": username })
        const t = Date.now()
        const time = Math.floor(t / 1000)
        setResponse((prevstate) => { return ([...prevstate, { "message": message, "user": username, "timestamp": time }]) })
        setMessage("")
    }
    
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMsg()
        }
    }
    
    return (
        <div className="page-cont">
            <CssBaseline />
            <h1
                className="header"
            >Chat room</h1>
            <div
                className="chat-msg-cont"
            >
                {response.map((res) => {
                    const t = moment.unix(res.timestamp)
                    return (
                        <div
                            className="chat-msg"
                            key={res.timestamp + res.message}
                        >
                            <TextField
                                label={`${res.user} ${t.fromNow()}`}
                                value={res.message}
                                multiline
                                rowsMax={4}
                                placeholder="Text here"
                                variant="outlined"
                                fullWidth
                            />
                        </div>
                    )
                })}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="user-msgbox">
                <div className="user-msg">
                    <TextField
                        label={username}
                        value={message}
                        // multiline
                        rowsMax={2}
                        placeholder="Text here"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <div>
                        <IconButton
                            type="submit"
                            onClick={sendMsg}
                            edge="end"
                            color="primary"
                        >
                            <SendRoundedIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom

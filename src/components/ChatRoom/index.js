import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

import UserName from '../UserName'
import UserMessage from '../timeline/UserMessage/'

import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import Button from '@material-ui/core/Button'
import Notifications from '../timeline/Notifications'

const ChatRoom = () => {
    const [username, setUsername] = useState(null)
    const [openModal, setOpenModal] = useState(true)
    const [message, setMessage] = useState("")
    const [timeline, setTimeline] = useState([])
    const [socket, setSocket] = useState(null)
    const [userIsTyping, setUserIsTyping] = useState([])

    const isValidMessage = message.length > 0 && socket

    useEffect(() => {
        const openSocket = io.connect()
        openSocket.on("msg", data => {
            setTimeline((prevstate) => { return ([...prevstate, { "type": "users_message", data }]) })
        })
        openSocket.on("join", data => {
            setTimeline((prevstate) => { return [...prevstate, { "type": "user_joined", data }] })
        })
        openSocket.on("left", data => {
            setTimeline((prevstate) => { return [...prevstate, { "type": "user_left", data }] })
        })
        openSocket.on("typing", data => {
            currentlyTyping(data)
            // setUserIsTyping((prevstate) => { return [...prevstate, data.name] })
        })
        setSocket(openSocket)
        return () => {
            openSocket.close()
        }
    }, [])

    const currentlyTyping = (data) => {
        const userTyping = data.name
        setUserIsTyping(prevstate => {
            for (let name of prevstate) {
                console.log("for name", name)
                if (userTyping === name) {
                    return [...prevstate]
                }
            }
            return [...prevstate, userTyping]
        })
    }

    const setName = (username) => {
        setOpenModal(false)
        socket.emit("set_name", { "name": username })
        setUsername(username)
    }

    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }, [timeline]);

    const handleChange = (event) => {
        setMessage(event.target.value)
        socket.emit("typing")
    }

    const sendMsg = (event) => {
        socket.emit("msg", { "message": message })
        const t = Date.now()
        const time = Math.floor(t / 1000)
        setTimeline((prevstate) => {
            return ([...prevstate, {
                "type": "users_message", data: { "message": message, "name": username, "timestamp": time }
            }])
        })
        setMessage("")
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMsg()
        }
    }

    console.log("AA", userIsTyping, userIsTyping.length)

    return (
        <div className="page-cont">
            {socket &&
                <UserName
                    setName={setName}
                    openModal={openModal}
                />
            }
            <div className="header">
                <h1>Chat room</h1>
                <div>
                    {username &&
                        <Button
                            onClick={() => setOpenModal(true)}
                        >
                            {username}
                        </Button>
                    }
                </div>
            </div>
            <div
                className="chat-msg-cont"
            >
                {
                    timeline.map((res, i) => {
                        return (
                            <div
                                className="chat-msg"
                                key={i}
                            >
                                {
                                    res.type === "users_message" &&
                                    <UserMessage
                                        {...res.data}
                                    />
                                }
                                {
                                    res.type === "user_joined" &&
                                    <Notifications
                                        {...res.data}
                                        type="joined"
                                    />
                                }
                                {
                                    res.type === "user_left" &&
                                    <Notifications
                                        {...res.data}
                                        type="left"
                                    />
                                }
                            </div>
                        )
                    })
                }
                    {
                        userIsTyping.length === 1 &&
                        <div>{userIsTyping} is typing</div>
                    }
                    {
                        userIsTyping.length > 1 &&
                        <div>{userIsTyping.join()} are typing</div>
                    }
                <div ref={messagesEndRef}></div>
            </div>
            <div className="user-msgbox">
                <div className="user-msg">
                    <TextField
                        label={username}
                        value={message}
                        rowsMax={2}
                        placeholder="Text here"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <div>
                        {/* {socket && */}
                        <IconButton
                            type="submit"
                            onClick={sendMsg}
                            edge="end"
                            color="primary"
                            disabled={!isValidMessage}
                        >
                            <SendRoundedIcon />
                        </IconButton>
                        {/* } */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom

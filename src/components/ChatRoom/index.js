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

    const isValidMessage = message.length > 0 && socket != null && socket.connected

    console.log("isValidMessage", isValidMessage)

    useEffect(() => {
        const openSocket = io.connect()
        openSocket.on("msg", data => {
            setTimeline((prevstate) => {
                return (
                    [...prevstate, { "type": "users_message", data }]
                )
            })
            deleteUserTyping(data)
        })
        openSocket.on("join", data => {
            setTimeline((prevstate) => { return [...prevstate, { "type": "user_joined", data }] })
        })
        openSocket.on("left", data => {
            setTimeline((prevstate) => { return [...prevstate, { "type": "user_left", data }] })
            deleteUserTyping(data)
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

    const deleteUserTyping = (data) => {
        setUserIsTyping(prevstate => {
            const deleteUser = prevstate.filter(user => data.name !== user.name)
            return deleteUser
        }
        )
    }

    const currentlyTyping = (data) => {
        const userTypingName = data.name
        const userTypingId = data.user_id
        const currentTS = Date.now()
        setUserIsTyping(prevstate => {
            const lastTypingTS = Date.now()
            // prevstate.map(
            //     prevUserTyping => {
            //         if (userTypingId === prevUserTyping.user_id) {
            //             return { ...prevUserTyping, timestamp: lastTypingTS }
            //         }
            //     }
            // )
            for (let user in prevstate) {
                if (userTypingId === prevstate[user].user_id) {
                    const usersPrevstate = [...prevstate]
                    //update timestamp
                    usersPrevstate[user].timestamp = lastTypingTS
                    return usersPrevstate
                }
            }
            console.log("before")
            setTimeout(() => console.log("5 seconds later, usertyping:", userTypingName), 5000)
            console.log({ userTypingName, userTypingId, lastTypingTS })
            return [...prevstate, { name: userTypingName, user_id: userTypingId, timestamp: lastTypingTS }]
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
        // console.log("message",message)
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
        if (event.key === 'Enter' && isValidMessage) {
            sendMsg()
        }
    }


    console.log("userIsTyping", userIsTyping, userIsTyping.length)
    // console.log("timeline", timeline)

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
                    <div>{userIsTyping[0].name} is typing...</div>
                }
                {
                    userIsTyping.length === 2 &&
                    <div>{userIsTyping[0].name},{userIsTyping[1].name} are typing...</div>
                }
                {
                    userIsTyping.length > 2 &&
                    <div>{userIsTyping.length} users are typing...</div>
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

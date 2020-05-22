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
    const [userCount, setUserCount] = useState(null)

    const isValidMessage = message.length > 0 && socket != null && socket.connected


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
            GetUserCount()
        })
        openSocket.on("left", data => {
            setTimeline((prevstate) => { return [...prevstate, { "type": "user_left", data }] })
            deleteUserTyping(data)
            GetUserCount()
        })
        openSocket.on("typing", data => {
            currentlyTyping(data)
            // checkUserTypingTS()
            // setUserIsTyping((prevstate) => { return [...prevstate, data.name] })
        })
        const GetUserCount = async () => {
            const response = await fetch('/users')
            const getUsersCount =await  response.json()
            console.log("getUsersCount",getUsersCount)
            setUserCount(getUsersCount.count)
        }
        GetUserCount()
        setSocket(openSocket)
        return () => {
            openSocket.close()
        }
    }, [])

    // useEffect(() => {
    //     const GetUserCount = async () => {
    //         const response = await fetch('/users')
    //         const getUsersCount =await  response.json()
    //         console.log("getUsersCount",getUsersCount)
    //         setUserCount(getUsersCount.count)
    //     }
    //     GetUserCount()
    // }, [])

    const deleteUserTyping = (data) => {
        setUserIsTyping(prevstate => {
            const deleteUser = prevstate.filter(user => data.name !== user.name)
            return deleteUser
        }
        )
    }

    const checkUserTypingTS = (userTyping) => {
        setTimeout(() => {
            setUserIsTyping(prevstate => {
                const filterUserByTimestamp = prevstate.filter(user => {
                    const currentTS = Date.now()
                    const diffTS = currentTS - user.timestamp
                    return diffTS < 5000
                })
                return filterUserByTimestamp

            })
        }, 5000)
    }

    const currentlyTyping = (data) => {
        const userTypingName = data.name
        const userTypingId = data.user_id
        setUserIsTyping(prevstate => {
            checkUserTypingTS(data)
            const lastTypingTS = Date.now()
            for (let user in prevstate) {
                if (userTypingId === prevstate[user].user_id) {
                    const usersPrevstate = [...prevstate]
                    usersPrevstate[user].timestamp = lastTypingTS
                    return usersPrevstate
                }
            }
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
        const messageNewLine = message.replace(/[/\r\n|\r|\n/]/g, '\n\n')
        socket.emit("msg", { "message": messageNewLine })
        // console.log("message",message)
        const t = Date.now()
        const time = Math.floor(t / 1000)
        setTimeline((prevstate) => {
            return ([...prevstate, {
                "type": "users_message", data: { "message": messageNewLine, "name": username, "timestamp": time }
            }])
        })
        setMessage("")
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && isValidMessage && !event.shiftKey) {
            event.preventDefault()
            sendMsg()
        }
    }


    // console.log("userIsTyping", userIsTyping, userIsTyping.length)
    console.log("timeline", timeline)
    console.log("users", userCount)

    return (
        <div className="page-cont">
            {socket &&
                <UserName
                    setName={setName}
                    openModal={openModal}
                />
            }
            <div className="header">
                {
                    userCount > 0
                        ?
                        <div>Users: {userCount}</div>
                        :
                        <div>Users: 0</div>
                }
                <h1>Chatroom</h1>
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
                    <div className="typing-indicator">{userIsTyping[0].name} is typing...</div>
                }
                {
                    userIsTyping.length === 2 &&
                    <div className="typing-indicator">{userIsTyping[0].name},{userIsTyping[1].name} are typing...</div>
                }
                {
                    userIsTyping.length > 2 &&
                    <div className="typing-indicator">{userIsTyping.length} users are typing...</div>
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
                        multiline
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

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
    const [userId, setUserId] = useState("")
    const [timeline, setTimeline] = useState([])
    const [socket, setSocket] = useState(null)
    const [userIsTyping, setUserIsTyping] = useState([])
    const [userCount, setUserCount] = useState(null)
    const [, setForceRender] = useState(0)
    const [isFetching, setIsFetching] = useState(false)

    const isValidMessage = message.length > 0 && socket != null && socket.connected
    // const isValidMessage = message.length > 0

    useEffect(() => {
        const updateInterval = setInterval(() => setForceRender(prevstate => prevstate + 1), 60000)
        const openSocket = io.connect()
        const getUserMessages = async () => {
            const response = await fetch('/messages?size=5')
            const fetchedMessages = await response.json()
            setTimeline(() => {
                return fetchedMessages.map((timelimeItem) => ({ "type": "users_message", data: timelimeItem })
                )
            })
        }
        openSocket.on("user_id", userId => {
            setUserId(userId.user_id)
        })
        getUserMessages()
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
        openSocket.on("delete_msg", deleted_id => {
            setTimeline(prevstate => {
                for (let i in prevstate) {
                    console.log(deleted_id)
                    console.log(prevstate)
                    if (prevstate[i].data.id === deleted_id.id) {
                        console.log(prevstate[i].data.id)
                        const updatedTimeline = [...prevstate]
                        updatedTimeline[i].data.is_deleted = true
                        updatedTimeline[i].data.message = null
                        return updatedTimeline
                    }
                }
            })
        })
        // window.addEventListener('scroll', handleScroll)
        // window.addEventListener('scroll', e => {console.log(e)})
        const GetUserCount = async () => {
            const response = await fetch('/users')
            const getUsersCount = await response.json()
            console.log("getUsersCount", getUsersCount)
            setUserCount(getUsersCount.count)
        }
        GetUserCount()
        setSocket(openSocket)
        return () => {
            openSocket.close()
            clearInterval(updateInterval)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        if (!isFetching) return
        loadEarlierMessages()
        console.log('Fetch earlier messages!')
    }, [isFetching])
    
    const handleScroll = (e) => {
        console.log(e)
        console.log(e.target.scrollTop)
        if (e.target.scrollTop === 0) {
            console.log('Fetching!!')
            setIsFetching(true)
        }
    }


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
        // const t = Date.now()
        // const time = Math.floor(t / 1000)
        // console.log("message", messageNewLine, "name", username, "timestamp", time)
        // setTimeline((prevstate) => {
        //     return (
        //         [...prevstate, {
        //             "type": "users_message", data: { "message": messageNewLine, "name": username, "timestamp": time }
        //         }])
        // })
        setMessage("")
    }

    const loadEarlierMessages = async () => {
        console.log("done fetching!")
        const earliestMessageId = timeline[0].data.id
        console.log(earliestMessageId, "earliestMessageId")
        const response = await fetch(`/messages?before_message=${earliestMessageId}&size=10`)
        const earliestMessages = await response.json()
        console.log("earliestMessages", earliestMessages)
        setTimeline((prevstate) => {
            const timelineMessages = earliestMessages.map(timelineItem => {
                // console.log("earliestMessages", earliestMessages)
                return ({ "type": "users_message", data: timelineItem })
            })
            return ([...timelineMessages, ...prevstate])
        })
        setIsFetching(false)
    }


    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && isValidMessage && !event.shiftKey) {
            event.preventDefault()
            sendMsg()
        }
    }

    const deleteMessage = (message_id) => {
        socket.emit("delete_msg", { "id": message_id })
        setTimeline(prevstate => {
            for (let i in prevstate) {
                console.log(i)
                if (prevstate[i].data.id === message_id) {
                    console.log(prevstate[i].data.id)
                    const updatedTimeline = [...prevstate]
                    updatedTimeline[i].data.is_deleted = true
                    updatedTimeline[i].data.message = null
                    return updatedTimeline
                }
            }
        })
        // setTimeline(prevstate => {
        //     console.log(message_id)
        //     const delMessageFromTimeline = prevstate.map(message =>
        //         message_id != message.data.id
        //         // !message.data.is_deleted && message_id !== message.data.id
        //         // console.log("message",message.data.id)
        //     )
        //     return delMessageFromTimeline
        // })
        console.log("deleted?")
    }


    console.log("timeline", timeline)
    // console.log("users", userCount)
    // console.log("user_id", userId)

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
            <div className="chat-msg-cont" onScroll={handleScroll}>
                {
                    timeline.length > 0 &&
                    <div style={{ textAlign: "center" }}>
                        <Button
                            size="small"
                            onClick={loadEarlierMessages}
                        >
                            Load earlier messages
                    </Button>
                    </div>
                }
                {
                    timeline.map((res, i) => {
                        return (
                            <div
                                className="chat-msg"
                                key={i}
                            >
                                {
                                    res.type === "users_message" &&
                                    // console.log(res)
                                    <UserMessage
                                        userId={userId}
                                        {...res.data}
                                        deleteMessage={deleteMessage}
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

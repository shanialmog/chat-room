import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline'
// import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import SendRoundedIcon from '@material-ui/icons/SendRounded'

function App() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const openSocket = io.connect()
    openSocket.on("msg", data => {
      setResponse((prevstate) => { return ([...prevstate, data]) });
      setSocket(openSocket)
    });
  }, []);

  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  const sendMsg = () => {
    socket.emit("msg", { "message": message, "user": "shani" })
  }
  console.log("response", response)

  return (
    <div className="page-cont">
      <CssBaseline />
      <h1>Chat room</h1>
      <div 
        className="chat-msg-cont"
      >
        {response.map((res) => {
          return (
            <div
              className="chat-msg"
              key={res.timestamp}
            >
              <TextField
                label={res.timestamp + res.user}
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
      </div>
      <div className="user-msgbox">
        <div className="user-msg">
          <TextField
            label="Shani"
            value={message}
            // multiline
            rowsMax={2}
            placeholder="Text here"
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />
          <div className="send-btn">
            <IconButton
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

export default App

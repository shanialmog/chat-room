import React, { useState, useEffect, useRef } from 'react'

import IconButton from '@material-ui/core/IconButton'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import CssBaseline from '@material-ui/core/CssBaseline'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'

import ChatRoom from './components/ChatRoom'


const App = () => {
    const [open, setOpen] = React.useState(true)
    const [tempUsername, setTempUsername] = useState("")
    const [username, setUsername] = useState("")
    const isValidUsername = tempUsername.length > 0

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setUsername(tempUsername)
    }

    const handleChange = (event) => {
        setTempUsername(event.target.value)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleClose()
        }
    }

    return (
        <div>
            <CssBaseline />
            <Modal
                className="modal"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div
                        className="modal-fade"
                    >
                        <h1>Select Username</h1>
                        <div className="modal-input">
                            <TextField
                                label="username"
                                // defaultValue="Select username"
                                // helperText="Some important text"
                                variant="outlined"
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                            <div>
                                <IconButton
                                    type="button"
                                    onClick={handleClose}
                                    edge="end"
                                    color="primary"
                                    disabled={!isValidUsername}
                                    value={tempUsername}
                                >
                                    <SendRoundedIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
            <ChatRoom username={username} />
        </div>
    )
}

export default App

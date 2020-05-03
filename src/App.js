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

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <CssBaseline />
            <Modal
                className="modal"
                open={handleOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={true}>
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
                            />
                            <div>
                                <IconButton
                                    type="submit"
                                    // onClick={}
                                    edge="end"
                                    color="primary"
                                >
                                    <SendRoundedIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
            <ChatRoom />
        </div>
    )
}

export default App

import React, { useState } from 'react'

import IconButton from '@material-ui/core/IconButton'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import TextField from '@material-ui/core/TextField'


const UserName = (props) => {
    const [tempUsername, setTempUsername] = useState("")
    const isValidUsername = tempUsername.length > 0

    const handleChangeName = () => {
        props.setName(tempUsername)
    }

    const handleChange = (event) => {
        setTempUsername(event.target.value)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleChangeName()
        }
    }

    return (
        <div>
            <Modal
                className="modal"
                open={props.openModal}
                // onClose={handleChangeName}
                closeAfterTransition
                BackdropComponent={Backdrop}
                disableBackdropClick
                disableEscapeKeyDown
            >
                <Fade in={props.openModal}>
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
                                value={tempUsername}
                            />
                            <div>
                                <IconButton
                                    type="button"
                                    onClick={handleChangeName}
                                    edge="end"
                                    color="primary"
                                    disabled={!isValidUsername}
                                >
                                    <SendRoundedIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default UserName

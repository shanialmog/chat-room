import React from 'react'
import ReactMarkdown from 'react-markdown'
import InputLabel from "@material-ui/core/InputLabel"
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'

export default ({ name, message, timestamp, user_id, userId, id, deleteMessage, is_deleted }) => {
    const t = moment.unix(timestamp)
    const handleDeleteMessage = () => {
        deleteMessage(id)
    }

    const isSameUser = user_id === userId ? true : false

    const styles = {
        alignSelf: isSameUser ? "flex-end" : "flex-start",
        marginTop: "8px",
        borderRadius: "10px",
        backgroundColor: isSameUser ? '#418c77' : "#417b8c",
        width: "50%",
        padding: "0.5em 1em",
        color: "#fff"
    }

    const styles2 = {
        display: "flex",
        justifyContent: "space-between",
    }

    return (
        <div style={styles}>
            <InputLabel style={{ zIndex: "3", color: "#fff", position: "relative" }}
                variant="outlined"
                shrink
            >
                {`${name} ${t.fromNow()}`}
            </InputLabel>
            <div style={styles2}>
                {
                    is_deleted
                        ?
                        <ReactMarkdown source='*message was deleted*' />
                        :
                        <div style={{ overflow: "hidden" }}>
                            <ReactMarkdown source={message} />
                        </div>
                }
                {
                    (isSameUser && !is_deleted) &&
                    <div style={{ alignSelf: "flex-end" }}>
                        <IconButton
                            type="submit"
                            onClick={handleDeleteMessage}
                            edge="end"
                            fontSize="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                }
            </div>
        </div>
    )
}

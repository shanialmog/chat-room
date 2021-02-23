import React from 'react'
import ReactMarkdown from 'react-markdown'
import InputLabel from "@material-ui/core/InputLabel"
import NotchedOutline from "@material-ui/core/OutlinedInput/NotchedOutline"
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'

export default ({ name, message, timestamp, user_id, userId, id, deleteMessage, is_deleted }) => {
    const t = moment.unix(timestamp)
    const handleDeleteMessage = () => {
        deleteMessage(id)
    }

    return (
        <div>
            {/* {
                !is_deleted && */}
                <div style={{ position: "relative", marginTop: "8px" }}>
                    <InputLabel style={{ zIndex: "3", position: "relative" }}
                        variant="outlined"
                        // className={classes.inputLabel}
                        shrink
                    >
                        {`${name} ${t.fromNow()}`}
                    </InputLabel>
                    {/* <div> */}
                    <div style={{ padding: "2px 14px" }}>
                        {
                            is_deleted
                                ?
                                <ReactMarkdown source='*message was deleted*' />
                                :
                                <ReactMarkdown source={message} />
                        }
                        <NotchedOutline colorSecondary notched />
                        {
                            user_id === userId &&
                            <div>
                                <IconButton
                                    type="submit"
                                    onClick={handleDeleteMessage}
                                    edge="end"
                                    color="primary"
                                    // disabled={!isValidMessage}
                                    fontSize="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        }

                        {/* <NotchedOutline notched /> */}
                    </div>
                    {/* </div> */}
                </div>
            {/* } */}
        </div>

        // <div>
        /* <div style={{
            // ...titleStyle,
            transform: 'translate(-43px, -11px) scale(0.75)',
            fontSize: '17px',
            color: 'rgba(0, 0, 0, 0.54)',
            position: 'absolute',
        }}
        >
            {`${name} ${t.fromNow()}`}
        </div>
        <div
            // className="flex-row"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.23)',
                padding: '5px 14px',
                borderRadius: '4px',
            }}
        >
            <ReactMarkdown source={message} />
        </div> */
        /* </div> */


        // <TextField
        //     label={`${name} ${t.fromNow()}`}
        //     value={message}
        //     variant="outlined"
        //     fullWidth
        // />
    )
}

import React from 'react'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'

export default ({ name, message, timestamp }) => {
    const t = moment.unix(timestamp)
    return (
        <TextField
            label={`${name} ${t.fromNow()}`}
            value={message}
            multiline
            rowsMax={4}
            placeholder="Text here"
            variant="outlined"
            fullWidth
        />
    )
}

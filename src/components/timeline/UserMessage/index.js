import React from 'react'
import ReactMarkdown from 'react-markdown'
import InputLabel from "@material-ui/core/InputLabel"
import NotchedOutline from "@material-ui/core/OutlinedInput/NotchedOutline"
import moment from 'moment'

// export default (props) => {
export default ({ name, message, timestamp }) => {
    const t = moment.unix(timestamp)
    console.log(name, timestamp, message)

    return (
        <div style={{ position: "relative", marginTop: "8px" }}>
            <InputLabel
                variant="outlined"
                // className={classes.inputLabel}
                shrink
            >
                {`${name} ${t.fromNow()}`}
            </InputLabel>
            {/* <div> */}
                <div style={{padding: "2px 14px"}}>
                    <ReactMarkdown source={message} />
                    <NotchedOutline colorSecondary notched />
                    {/* <NotchedOutline notched /> */}
                </div>
            {/* </div> */}
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

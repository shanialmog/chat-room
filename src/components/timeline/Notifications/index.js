import React from 'react'

export default ({ name, type }) => {
    return (
        <div>
            {
                type === "joined"
                ?
                <div style={{ color: "#a3a3a3" }}>A user has joined</div>
                :
                type === "left" &&
                    name
                    ?
                    <div style={{ color: "#a3a3a3" }}>{`${name} has left`}</div>
                    :
                    <div style={{ color: "#a3a3a3" }}>A user has left</div>
            }
        </div>
    )
}
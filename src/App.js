import React from 'react'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'

function App() {
  return (
    <div>
      <CssBaseline />
      <h1>Chat room</h1>
      <TextField
        id="outlined-multiline-static"
        label="Shani"
        multiline
        rows={4}
        placeholder="Text here"
        variant="outlined"
      />
      <div>
        <Button variant="contained">Send</Button>
      </div>
    </div>
  )
}

export default App

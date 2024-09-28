// import express
const express = require('express')

const app = express()

/*
Without the json-parser, the body property would be undefined. 
The json-parser takes the JSON data of a request, transforms it into a JavaScript 
object and then attaches it to the body property of the request object before the route 
handler is called.
json-parser相当于预处理，先将JSON格式的数据转换成JS object并附加到request的body中，
这样route handler在接受请求后，就能够直接识别数据格式了。
在
*/
// create a json-parser
app.use(express.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

//define two routes to the app
// handle HTTP request made to the app's root.
// whenenver there is a request to the root, the event handler(callback function) activates and send the messages.
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) =>{
  response.json(notes)
})

//handle HTTP request made to the app's notes path.
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  // find the note with an id that matches the parameter.
  const note = notes.find(note => note.id === id)
  if (note){
    response.json(note)
}else{
    response.statusMessage = "No resources exist.";
    response.status(404).end()
  }
})





// post a note and check whether the body content is empty. 
app.post('/api/notes',(request, response)=>{
  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  // define the note format of how it should construct.
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }
  notes = notes.concat(note)

  response.json(note)
})

// generate Id for the next notes. 
const generateId = () => {
  const maxId = notes.length > 0
  // finds the highest id among all the notes, and if there are no notes, 
  // it defaults to 0
  ? Math.max(...notes.map(n => Number(n.id)))
  :0
  return String(maxId + 1)
}

// add a route for deleting resources.
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()

})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

})

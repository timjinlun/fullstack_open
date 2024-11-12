const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())


// 设定一个新的token reqObj
morgan.token('reqObj', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :req[content-length] - :response-time ms :reqObj'))

// cross-origin resources sharing
const cors = require('cors')
app.use(cors())

// 调用前端的`dist`文件
app.use(express.static('dist'));

/**
 * Http Method + routes + status code + 
 */

let phonebook = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons/', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const length = phonebook.length;
    response.send(`Phonebook has info for ${length} people <br> ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(400).end()
    }
})


const generateId = () => {
    const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(person => Number(person.id)))
    :0
    return String(maxId + 1)
}

const generateRandomId = () => {
    const Max = 10000
    const Min = 100
    const id = phonebook.length > 0
    ? Min + Math.floor(Math.random() * (Max - Min) + 1)
    : 0
    return String(id)
}


app.delete('/api/persons/:id', (request, response) => {
    console.log("The phonebook before is: ", phonebook);
    
    // Get the id from the request
    const id = request.params.id

    // Check if the id exists in the phonebook
    const person = phonebook.find(person => person.id === id)
    
    // if true, delete the designated person.
    if (person){
        phonebook = phonebook.filter(person => person.id !== id)
        response.status(404).json({
            message: `Note ${id} has been deleted.`
        })
    // else, raise a warning.
    } else{
        response.status(404).json({
            error: "No such a person exist in the phonebook."
        })
    }
    console.log("After the phonebook is: ", phonebook)
     
})


app.post('/api/persons', (request, response) => {
    // console.log(request.params.body);
    // console.log(request);
    console.log(request.body);

    const body = request.body
    
    if (!body.name || ! body.number) {
        response.status(404).json({
            message: "content missing. Whether name or number"
        })
    } 

    // Check if the name already exists in the phonebook
    if (phonebook.find(person => person.name === body.name)){
        response.status(404).json({
            message: "Name must be unique"
        })
    }

    const person = {
        name : body.name, 
        number : body.number,
        id : generateRandomId()
    }
    phonebook = phonebook.concat(person)
    response.json(person)
    
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
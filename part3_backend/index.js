const express = require("express")
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.get('/', (request, response) => 
    response.send('<h1>Hello</h1>')
)



const requestLogger = (request, response, next) => {
    console.log("Method", request.method)
    console.log("Path: ", request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

// middleWare
// json.parson
app.use(express.json())

// Custom format string to match the output in your image
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time ms :body'));

// allow for requests from all origins.
app.use(cors())


let persons = [
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

const getNumOfInfo = () => {
    persons.length
}

// A router to GET the all persons contact info
app.get('/api/persons', (request, response) => {
    response.json(persons)
})


// A router to GET the phonebook general info.
app.get('/info', (request, response) => {
    const requestTime = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime} </p>`)
})

// A router to GET a single person's info when id is provided.
// If is not found, respond with 204 status code.
app.get('/api/persons/:id', (requset, response) => {
    // get the number id from request
    const id = String(requset.params.id)
    console.log(id)

    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        console.log(response.statusMessage = "No resourses exit.")
        response.status(404).end()
    }
})


// delete a single phonebook entries.
app.delete('/api/persons/:id', (request, response) => {
    const id = String(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


// POST a phonebook entries
app.post('/api/persons/', (request, response) => {
    const body = request.body
    const nameExisted = persons.find(person => person.name === request.body.name)
    // Make sure no repetative names in the phonebook
    if(nameExisted){
        response.status(400).json({error: "Name already existed."});
        return;
    }

    // Error when missing name or numbers.
    if (!body.name){
        return response.status(400).json({ error: 'Name is missing'})
    }

    if (!body.number){
        return response.status(400).json({ error: "Number is missing."})
    }

    const person = {
        // get the random id and convert it to String type.
        id: String(getRandomInt(1, 10000)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)

    console.log(person.id); // This will print a random integer between 1 (inclusive) and 10 (exclusive)

})

// Generate a random integer between min and max.
const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}



const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
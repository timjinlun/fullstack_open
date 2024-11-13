const express = require('express')
const app = express()
require('dotenv').config()

// 加载phonebook model
const Person = require('./models/phonebook')

// 调用前端的`dist`文件
app.use(express.static('dist'));


// 调用logger
const morgan = require('morgan')
// 设定一个新的token reqObj
morgan.token('reqObj', (req, res) => {
    return JSON.stringify(req.body)
})

// cross-origin-resource-sharing
const cors = require('cors')


// cross-origin resources sharing
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :reqObj'))



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}





const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
}



/**
 * 通过`/api/persons`获取所有的人员信息
 */
app.get('/api/persons/', (request, response) => {
    Person.find({}).then(people => {
        console.log("All the person object in phonebook:", people);
        response.json(people)
    })
})



/**
 * 通过`/info`获取人员信息的总数
 */
app.get('/info', (request, response) => {
    Person.find({})
    .then(persons => {
        console.log("Number of People:", persons.length);
        const currentTimestamp = new Date().toLocaleString();
        response.send(`Phonebook has info for ${persons.length} people\n${currentTimestamp}`)
    })
    .catch(error => {
        console.log("Get unsuccessfully, ", error.message);
        
        response.status(500).send({ error: "server error"})
    })
})


/**
 * 通过`/api/persons/:id`获取指定id的人员信息
 */
app.get('/api/persons/:id', (request, response) => {
    const idNum = request.params.id;
    console.log("The id you want to get is: ", idNum);
    Person.findById(idNum).then(person => {
        if (person) {
            console.log("The person is: ", person);
            response.json(person);
        } else {
            console.log(`Person with id ${idNum} not found`);
            response.status(404).send({ error: `Person with id ${idNum} not found` });
        }
    })
    .catch(error => {
        console.log("Get unsuccessfully,", error.message);
        response.status(500).send({ error: 'Server error' });
    })
})

app.post('/api/persons', (request, response) => {

    const body = request.body
    console.log(request.body);

    if (body.name===undefined || body.number===undefined) {
        response.status(400).json({
            message: "content missing. Whether name or number."
        })
    } 
    // Check if the name already exists in the phonebook
    if (body.name == Person.find({name: body.name})){
        console.log("You want to add: ", body.name);
        console.log("Already in the data: ", Person.find({name: body.name}));
        response.status(404).json({
            message: "Name must be unique."
        })
    }
    const person = new Person({
        name : body.name, 
        number : body.number,
    })
    person.save().then(savedPerson =>{
        response.json(savedPerson)
    })
})



app.put('/api/persons/:id', (request, response, next) => {
    const { id } = request.params;
    const { name, number } = request.body;

    Person.findByIdAndUpdate(
        id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson);
            } else {
                response.status(404).send({ error: 'Person not found' });
            }
        })
        .catch(error => next(error));
});


/**
 * 通过`/api/persons/:id`删除指定id的人员信息
 */
app.delete('/api/persons/:id', (request, response, next) => {
    console.log("The ID you want to delete is: ", request.params.id)
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            console.log(result);
            response.status(204).end()
        })
        .catch(error => next(error))
})







app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
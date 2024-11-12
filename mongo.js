const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://timjinlun-pb:149325@phonebook-db.3m5dq.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook-db`
mongoose.set('strictQuery',false)

mongoose.connect(url)



const phonebookSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// Create a Note model
const Note = mongoose.model('Note', noteSchema)


// Using Note model to construct new notes that are JavaScript objects based.
// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })
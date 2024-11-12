const mongoose = require('mongoose')

// 如果没有填写登陆密码，则报错


const password = process.argv[2]

const url =
`mongodb+srv://timjinlun-pb:${password}@phonebook-db.3m5dq.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook-db`
mongoose.set('strictQuery',false)

mongoose.connect(url)


const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Create a Note model
const Contact = mongoose.model('Contact', contactSchema)


const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
})

// 如果命令行参数少于3个，即缺少密码，则报错
if (process.argv.length<3){
  console.log('give password as argument');
  process.exit(1)
} 
// 如果密码是仅有的参数，则返回当前储存在phonebook的所有contact
else if(process.argv.length==3){
  Contact.find({}).then(result =>{
    console.log(`phonebook:`)
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
  // 多于三个参数则按照添加contact的规则，将参数中的内容添加至phonebook。
} else{
  contact.save().then(result => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close()
    process.exit(1)
  })  
}


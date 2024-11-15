const mongoose = require('mongoose')
// 设置mongoose的严格查询模式为false
mongoose.set('strictQuery', false)

// 获取环境变量中的MONGODB_URI
const url = process.env.MONGODB_URI

console.log('connecting to', url)

// 连接到MongoDB
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

/**
 * Schema representing a person in the phonebook.
 * 
 * @typedef {Object} Person
 * @property {string} name - The name of the person. Must be at least 3 characters long and is required.
 * @property {string} number - The phone number of the person. Must match the pattern `123-12345678` or `12-1234567` and is required.
 * 
 * @type {mongoose.Schema<Person>}
 */
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    // 验证数据格式
    validate: {
    // either 123-12345678 or 12-1234567 digits
      validator: function (v) {
        return /\d{3}-\d{8}|\d{2}-\d{7}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    // 必填为true
    required: true
  }
})

// 设置返回的JSON格式
personSchema.set('toJSON', {
// 重写transform方法，即返回的对象中不包含_id和__v，并且将_id转换为字符串
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// 导出模块
module.exports = mongoose.model('Person', personSchema)
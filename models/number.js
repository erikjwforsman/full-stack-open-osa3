const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const numberSchema = new mongoose.Schema({
  name: { type:String, required: true, unique:true },
  number: { type:String, required: true }
})
numberSchema.plugin(uniqueValidator)

numberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Number", numberSchema)

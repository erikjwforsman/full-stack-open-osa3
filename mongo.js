const mongoose = require("mongoose")

if (process.argv.length<3){
  console.log("give password argument")
  process.exit(1)
}

const password=process.argv[2]

const url =`mongodb+srv://fullstack:${password}@cluster0.ruefr.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model("Number", numberSchema)

//Numeron tallennus
if (process.argv.length>4){
  const number = new Number({
    name: process.argv[3],
    number: process.argv[4]
  })

  number.save().then(response => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })

}
//Numeroiden tulostus
else {
  console.log("phonebook:")
  Number.find({}).then(result =>{
    result.map(person =>{
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()

  })
}

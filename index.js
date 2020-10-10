const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")

require("dotenv").config()
const Number = require("./models/number")

morgan.token("person", (req, res)=>{
  return JSON.stringify(req.body)
})
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"))
app.use(express.static("build"))
app.use(express.json())


app.get("/info/", (req, res, next) =>{
  Number.countDocuments()
    .then( amount => res.send(`<div>
                                <p>Phonebook has info of ${amount} people</p>
                                <p>${new Date()}</p>
                              </div>`))
    .catch(error=>next(error))

})


app.get("/api/persons", (req, res, next) => {
  Number.find({})
    .then(numbers => {
      res.json(numbers.map(number=>number.toJSON()))
    })
    .catch(error =>next(error))
})

app.get("/api/persons/:id", (req, res, next) => {

  Number.findById(req.params.id)
    .then(number => {
      if(number){
        res.json(number.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Number.findByIdAndRemove(req.params.id)
    .then(number => {
      res.status(204).end()
    })
    .catch(error=>next(error))

})


app.post("/api/persons", (req, res, next) => {
  const body = req.body

  const person = new Number({
    name:body.name,
    number:body.number
  })

  person.save()
    .then(savedNumber => {
    res.json(savedNumber.toJSON())
  })
    .catch(error=>next(error))


})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const number = {
    name: body.name,
    number: body.number
  }

  Number.findByIdAndUpdate(req.params.id, number, {new:true})
    .then(updatedNumber => {
      res.json(updatedNumber.toJSON())
    })
    .catch(error=>next(error))
})


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({error:"malformatted id"})
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT //|| 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

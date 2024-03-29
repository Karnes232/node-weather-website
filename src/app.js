const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const PORT = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'James Karnes'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About Me",
        name: 'James Karnes'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: "If you need some more help, please feel free to contact us",
        title: 'Help',
        name: 'James Karnes'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        } 
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
                } 
            weatherResponse = {
                forecast: `${forecastData.description}. It is currently ${forecastData.temperature} degrees, but it feels like ${forecastData.feelslike} degrees out. The wind is ${forecastData.windSpeed} knots coming from ${forecastData.windDir} direction, and we have a humidity of ${forecastData.humidity}%`,
                location,
                address: req.query.address
            }
            res.send(weatherResponse)      
        }) 
    })
    
    
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: "Help article not found",
        title: '404',
        name: 'James Karnes'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: "Page Not Found",
        title: '404',
        name: 'James Karnes'
    })
})

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
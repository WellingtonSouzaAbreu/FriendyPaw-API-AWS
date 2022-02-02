const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
let staticEndpoints = []

module.exports = app => {

    const newRoutes = async (endpoint, html) => {
        if (!endpoint) return

        return app.get(endpoint, (req, res) => res.send(html))
    }

    app.use(bodyParser.json())
    app.use(cors({
        origin: '*'
    }))
    app.use('/animal-pictures', express.static('./_animalPictures'))
    app.use('/publication-pictures', express.static('./_publicationPictures'))
    app.use('/interested-pictures', express.static('./_interestedPictures'))
    app.use('/remote-monitoring-pictures', express.static('./_remoteMonitoringPictures'))
    newRoutes()

    return { newRoutes, staticEndpoints }
}
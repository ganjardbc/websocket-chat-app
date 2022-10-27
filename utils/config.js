'use strict'

const ejs = require('ejs')
const express = require('express')
const path = require('path')

class Config {
    constructor (app) {
        // setting .html as the default template extension
        app.set('view engine', 'html')

        // initializing the ejs template engine
        app.engine('html', ejs.renderFile)

        // telling express where it can find the templates
        app.set('views', (__dirname + '../views'))

        // files
        app.use(
            express.static(
                path.join('public_data')
            )
        )
    }
}

module.exports = Config
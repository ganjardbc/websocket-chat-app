'use strict'

// global variable
const express = require('express')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const INDEX = '/index.html'

// utils variable
const routes = require('./utils/routes')
const config = require('./utils/config')

class Server {
	constructor () {
		// set host and port
		this.host = 'localhost'
		this.port = 3030

		// assign express module
		this.app = express()

		// start express server
		this.http = this.app
			.use((req, res) => {
				res.sendFile(INDEX, {
					root: __dirname
				})
			})
			.listen(this.port, () => {
				console.log(`Listening on *:${this.port}`)
			})

		// assign socket io module with http server
		this.socket = socketio(this.http, {
			cors: {
				origin: '*'
			}
		})
	}

	appConfig () {
		this.app.use(bodyParser.json())
		new config(this.app)
	}

	includeRoutes () {
		new routes(this.app, this.socket).routesConfig()
	}

	appExecute () {
		this.appConfig()
		this.includeRoutes()
		this.http
	}
}

const app = new Server()
app.appExecute()
'use strict'

class Routes {
    constructor (app, socket) {
        // set express and socket module
        this.app = app 
        this.io = socket 

        // array
        this.users = []
        this.channels = []
    }

    appRoutes () {
        this.app.get('/', (req, res) => {
            res.render('index')
        })
    }

    socketEvents () {
        this.io.on('connection', (socket) => {
            console.log('user connected', socket.id)

            // add user
            socket.on('addUser', (data) => {
                const findUserId = this.users.find((item) => item.id === socket.id)
                if (!findUserId) {
                    this.users.push({
                        id: socket.id,
                        name: data.name,
                        foto: data.foto
                    })

                    this.io.emit('userList', this.users)

                    console.log('userList', this.users)
                }
            })

            // add channel
            socket.on('addChannel', (data) => {
                this.channels.unshift({
                    ...data
                })

                this.io.emit('channelList', this.channels)

                console.log('channels', this.channels)
            })

            // get channel list
            socket.on('channelList', () => {
                this.io.emit('channelList', this.channels)

                console.log('channels', this.channels)
            })

            // add message
            socket.on('addMessage', (data) => {
                const findCannelIndex = this.channels.map((item) => item.id).indexOf(data.to)
                // put message in first list
                this.channels[findCannelIndex].message.unshift({
                    ...data
                })

                const message = this.channels.find((item) => item.id === data.to).message
                this.io.emit('messageList', message)
                this.io.emit('channelList', this.channels)

                console.log('message', message)
                console.log('channels', this.channels)
            })

            // get message list
            socket.on('messageList', (data) => {
                const message = this.channels.find((item) => item.id === data).message
                this.io.emit('messageList', message)
    
                console.log('messageList', message)
            })

            // notification
            socket.on('notification', (data) => {
                socket.broadcast.to(data.id).emit('notification', data.message)

                console.log('notification', data.message)
            })

            // disconnect
            socket.on('disconnect', () => {
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].id === socket.id) {
                        this.users.splice(i, 1)
                        this.io.emit(`user ${this.users[i]} disconnected`)
                    }
                }
            })
        })
    }

    routesConfig () {
        this.appRoutes()
        this.socketEvents()
    }
}

module.exports = Routes
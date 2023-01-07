const mongoose = require('mongoose')


mongoose.connect('mongodb://ismail_i3:12121212@ac-gfpskwh-shard-00-00.w8r6oh5.mongodb.net:27017,ac-gfpskwh-shard-00-01.w8r6oh5.mongodb.net:27017,ac-gfpskwh-shard-00-02.w8r6oh5.mongodb.net:27017/?ssl=true&replicaSet=atlas-j7xvdm-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true


})
const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const filter = new Filter();
const db = monk(process.env.MONGO_URI || 'localhost/woofer');
const woofs = db.get('woofs');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
     res.json({
         message: 'Woof!'
     });
});

app.get('/woofs', (req, res) => {
    woofs
        .find()
        .then(woofs => {
            res.json(woofs);
        });
})

function isValidWoof(woof) {
    return woof.name && woof.name.toString().trim() !== '' &&
    woof.content && woof.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 30 * 1000, //1 woof per 30 seconds
    max: 1
}));

app.post('/woofs', (req, res) => {

    //validate body of req (woof obj and its contents) before inserting into db
    if(isValidWoof (req.body)) {

        //insert into db
        const woof = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            create: new Date()
        };

        woofs
            .insert(woof)
            .then(createWoof => {
                res.json(createWoof);
            });

    } else {
        res.status(422);
        res.json({
            message: 'Name and Woof are required!'
        })
    }
})

app.listen(5000, () => {
    console.log('Listening on port 5000');
})
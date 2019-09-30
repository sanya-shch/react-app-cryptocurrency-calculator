const router = require('express').Router();
const fs = require('fs');

router.route('/').get((req, res) => {

    try {
        let fsyms = req.query.fsyms;
        let tsyms = req.query.tsyms;

        let rawdata = fs.readFileSync(__dirname + './../crypto.json');
        let data = JSON.parse(rawdata);

        Object.fromEntries = arr => Object.assign({}, ...arr.map( ([k, v]) => ({[k]: v}) ));
        Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));

        const filtered = Object.filter(data, ([name, score]) => {
            const regex = new RegExp(`${name}`, 'i');
            return regex.test(fsyms);
        });

        let secondFilter = {};
        for (let [key, value] of Object.entries(filtered)) {
            secondFilter[key] = Object.filter(value, ([name, score]) => {
                const regex = new RegExp(`${name}`, 'i');
                return regex.test(tsyms);
            });
        }
        res.json(secondFilter);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;
const readFileGenerateInsights = require('./src/shared');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: '*' }));

const port = 3000;

app.get('/api/data', (req, res) => {
    req.query.filename;
    filename = `input/${req.query.filename}.csv`;
    // filename = 'input/demoCompressorWeekData.csv';
    // filename = 'input/demoPumpDayData.csv';
    const insights = readFileGenerateInsights(filename);
    res.send(insights);

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
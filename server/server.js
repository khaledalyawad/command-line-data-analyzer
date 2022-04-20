const readFileGenerateInsights = require('./src/shared');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    filename = 'input/demoCompressorWeekData.csv';
    // filename = 'input/demoPumpDayData.csv';
    const insights = readFileGenerateInsights(filename);
    res.send(insights);

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
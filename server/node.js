const clearTerminal = require('clear-terminal')
const prompts = require('prompts');
const readFileGenerateInsights = require('./src/shared');

function start() {
    (async () => {
        let filename;
        const response = await prompts({
            type: 'text',
            name: 'file',
            message: 'Choose a file to analyse ... type 1 for (demoCompressorWeekData.csv) or 2 (demoPumpDayData.csv)? [1 is default]'
        });
        if (response.file === '1') {
            filename = 'input/demoPumpDayData.csv';
        } else if (response.file === '2') {
            filename = 'input/demoCompressorWeekData.csv';
        } else {
            filename = 'input/demoPumpDayData.csv';
        }

        const insights = readFileGenerateInsights(filename);
        drawOutPutAndPrintAnalysis(insights)
    })();

}

function drawOutPutAndPrintAnalysis(insights) {
    clearTerminal();
    var babar = require('babar');
    console.log(babar(insights.trendLine, {
        width: process.stdout.columns,
        maxY: insights.max
    }));
    console.log(``);
    console.log(`Note: Values in the chart is averaged`);
    console.log(``);
    console.log(`________________________Insights of ${insights.total} eventss__________________________`);
    console.log(`\u001b[1;36m`);
    console.log(insights.message);
    console.log(insights.bounosInsight);
    (async () => {
        const response = await prompts({
            type: 'text',
            name: 'showInsights',
            message: 'Do you want to show more insights? [Engter for YES]'
        });

        console.log(``);
        console.log(`\u001b[1;33m`);
        console.log(`_________________ Days this events has been idle______________________`);
        console.log(``);
        console.log(insights.days_events_on_idel);
        console.log(`_________________ Days this events has been unloaded______________________`);
        console.log(``);
        console.log(insights.days_events_on_unloaded);
    })();

}

start();
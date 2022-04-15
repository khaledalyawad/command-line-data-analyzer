const fs = require('fs');
const papaparse = require('papaparse');
const _ = require('lodash');
const clearTerminal = require('clear-terminal')
const prompts = require('prompts');
const cleanDataNeedFlattening = require('./clean_util/cleanDataNeedFlattening');
const cleanFlatData = require('./clean_util/cleanFlatData');

module.exports = function start() {
    (async () => {
        let filename;
        const response = await prompts({
            type: 'text',
            name: 'file',
            message: 'Choose a file to analyse ... type 1 for (demoCompressorWeekData.csv) or 2 (demoPumpDayData.csv)? [1 is default]'
        });
        if (response.file === '1') {
            filename = 'input/demoPumpDayData.csv'
        } else if (response.file === '2') {
            filename = 'input/demoCompressorWeekData.csv'
        } else {
            filename = 'input/demoPumpDayData.csv';
        }
        const data = fs.readFileSync(filename, 'utf8');
        const json = papaparse.parse(data, { delimiter: ',', header: true });
        main(json.data);
    })();

}


function main(data) {
    const dataType = getDataType(data); //enum values ['flatData', 'needFlattening']
    const cleanedNormalizedData = cleanData(data, dataType);
    const insights = generateInsights(cleanedNormalizedData);
    drawOutPutAndPrintAnalysis(insights);
}

function drawOutPutAndPrintAnalysis(insights) {
    clearTerminal()
    var babar = require('babar');
    console.log(babar(insights.trendLine, {
        width: process.stdout.columns,
        maxY: insights.max
    }));
    console.log(``);
    console.log(`Note: Values in the chart is averaged`);
    console.log(``);
    console.log(`________________________Insights of ${insights.total} devices__________________________`);
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
        console.log(`_________________ Days this device has been idle______________________`);
        console.log(``);
        console.log(insights.days_device_on_idel);
        console.log(`_________________ Days this device has been unloaded______________________`);
        console.log(``);
        console.log(insights.days_device_on_unloaded);
    })();

}

function getDataType(data) {
    if (!data[0].metricid && data[0].metrics) {
        return 'needFlattening';
    }
    if (data[0].metricid) {
        return 'flatData';
    }
    if (data[0].anyotherCheck) { //for future development
        return 'futureDataType';
    }
}

function cleanData(data, dataType) {
    let cleanedData;
    switch (dataType) {
        case 'needFlattening':
            cleanedData = cleanDataNeedFlattening(data);
            break;
        case 'flatData':
            cleanedData = cleanFlatData(data);
            break;

        case 'futureDataType':
            cleanedData = function (data) { return data };
            break;
        default:
            break;
    }
    return cleanedData;
}

function generateInsights(o) {
    const device_on_20_100 = { data: [], values: [], daysAndTime: [] }
    const device_off = { data: [], values: [], daysAndTime: [] };
    const device_on_unloaded = { data: [], values: [], daysAndTime: [] };
    const device_on_idel = { data: [], values: [], daysAndTime: [] };
    const device_on_extreme_load = { data: [], values: [], daysAndTime: [] }; // bounos insight 
    const trendLine = []; // bounos insight 
    o.data = _.sortBy(o.data, [function (o) { return o.timestamp; }]);
    o.data.forEach((item, i) => {
        trendLine.push([item.timestamp, item.value]);
        if (item.value > (o.max * 0.2)) {
            item.insight = 'On - loaded is 20-100+% of operating load.';
            device_on_20_100.data.push(item);
            device_on_20_100.values.push(item.roundedVal);
            device_on_20_100.daysAndTime.push(new Date(item.timestamp));
            if (item.value > (o.max * 0.95)) {
                device_on_extreme_load.data.push(item);
                device_on_extreme_load.values.push(item.roundedVal);
                device_on_extreme_load.daysAndTime.push(new Date(item.timestamp));
            }
        } else if (item.value == 0 || item.value == undefined) {
            item.insight = 'Off is power off';
            device_off.data.push(item);
            device_off.values.push(item.roundedVal);
            device_off.daysAndTime.push(new Date(item.timestamp));
        } else if (item.value <= 3) {
            item.insight = 'On - unloaded';
            device_on_unloaded.data.push(item);
            device_on_unloaded.values.push(item.roundedVal);
            device_on_unloaded.daysAndTime.push(new Date(item.timestamp));
        } else if (item.value <= (o.max * 0.2)) {
            item.insight = 'On - idle is less than 20% of operating load';
            device_on_idel.data.push(item);
            device_on_idel.values.push(item.roundedVal);
            device_on_idel.daysAndTime.push(new Date(item.timestamp));
        }
    });


    return {
        total: o.data.length,
        trendLine,
        max: o.max,
        device_on_20_100,
        device_off,
        device_on_unloaded,
        device_on_idel,
        device_on_extreme_load,
        message: `Average value is: ${o.avgvalue} \nMax value is: ${o.max} \nYou have: ${device_off.data.length} devices off \nYou have ${device_on_20_100.data.length} device functioning at 20-100+% of operating load \nYou have ${device_on_unloaded.data.length} device On but unloaded \nYou have ${device_on_idel.data.length} device idle`,
        bounosInsight: `You have ${device_on_extreme_load.data.length || 0} operating above 95% capacity`,
        days_device_on_idel: device_on_idel.daysAndTime,
        days_device_on_unloaded: device_on_unloaded.daysAndTime,

    };
}
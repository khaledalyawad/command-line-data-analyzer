const fs = require('fs');
const papaparse = require('papaparse');
const _ = require('lodash');

const cleanDataNeedFlattening = require('./clean_util/cleanDataNeedFlattening');
const cleanFlatData = require('./clean_util/cleanFlatData');


module.exports = function readFileGenerateInsights(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const json = papaparse.parse(data, { delimiter: ',', header: true });
    const dataType = getDataType(json.data); //enum values ['flatData', 'needFlattening']
    const cleanedNormalizedData = cleanData(json.data, dataType);
    const insights = generateInsights(cleanedNormalizedData);
    return insights
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
    const events_on_20_100 = { data: [], values: [], daysAndTime: [] }
    const events_off = { data: [], values: [], daysAndTime: [] };
    const events_on_unloaded = { data: [], values: [], daysAndTime: [] };
    const events_on_idel = { data: [], values: [], daysAndTime: [] };
    const events_on_extreme_load = { data: [], values: [], daysAndTime: [] }; // bounos insight 
    const trendLine = []; // bounos insight 
    o.data = _.sortBy(o.data, [function (o) { return o.timestamp; }]);
    o.data.forEach((item, i) => {
        trendLine.push([item.timestamp, item.value]);
        if (item.value > (o.max * 0.2)) {
            item.insight = 'On - loaded is 20-100+% of operating load.';
            events_on_20_100.data.push(item);
            events_on_20_100.values.push(item.roundedVal);
            events_on_20_100.daysAndTime.push(new Date(item.timestamp));
            if (item.value > (o.max * 0.95)) {
                events_on_extreme_load.data.push(item);
                events_on_extreme_load.values.push(item.roundedVal);
                events_on_extreme_load.daysAndTime.push(new Date(item.timestamp));
            }
        } else if (item.value == 0 || item.value == undefined) {
            item.insight = 'Off is power off';
            events_off.data.push(item);
            events_off.values.push(item.roundedVal);
            events_off.daysAndTime.push(new Date(item.timestamp));
        } else if (item.value <= 3) {
            item.insight = 'On - unloaded';
            events_on_unloaded.data.push(item);
            events_on_unloaded.values.push(item.roundedVal);
            events_on_unloaded.daysAndTime.push(new Date(item.timestamp));
        } else if (item.value <= (o.max * 0.2)) {
            item.insight = 'On - idle is less than 20% of operating load';
            events_on_idel.data.push(item);
            events_on_idel.values.push(item.roundedVal);
            events_on_idel.daysAndTime.push(new Date(item.timestamp));
        }
    });


    return {
        total: o.data.length,
        trendLine,
        max: o.max,
        events_on_20_100,
        events_off,
        events_on_unloaded,
        events_on_idel,
        events_on_extreme_load,
        message: `Average value is: ${o.avgvalue} \nMax value is: ${o.max} \nYou have: ${events_off.data.length} eventss off \nYou have ${events_on_20_100.data.length} events functioning at 20-100+% of operating load \nYou have ${events_on_unloaded.data.length} events On but unloaded \nYou have ${events_on_idel.data.length} events idle`,
        bounosInsight: `You have ${events_on_extreme_load.data.length || 0} operating above 95% capacity`,
        days_events_on_idel: events_on_idel.daysAndTime,
        days_events_on_unloaded: events_on_unloaded.daysAndTime,

    };
}
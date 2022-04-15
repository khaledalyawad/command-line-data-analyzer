const _ = require('lodash');

module.exports = cleanFlatData = function cleanFlatData(data) {
    let averageSum = 0;
    let len = 0;
    let max = 0;
    const result = _.filter(data, function (item) {
        if (item.metricid === 'Psum_kW') {
            item.value = parseFloat(item.calcvalue);
            len++
            (item.value > max) && (max = item.value);
            averageSum = averageSum + item.value;
            roundedVal = Math.ceil(item.value / 10) * 10;
            item.timestamp = parseInt(item.timestamp);
            item.roundedVal = roundedVal;
            delete item.calcvalue;
            delete item.deviation;
            delete item.excthlimit;
            delete item.excthreshold;
            delete item.recvalue;
        }
        return item.metricid === 'Psum_kW';
    });
    return { data: result, avgvalue: (averageSum / len), max };
}


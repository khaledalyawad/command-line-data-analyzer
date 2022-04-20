module.exports = function cleanDataNeedFlattening(data) {
    let result = [];
    let averageSum = 0;
    let minSum = 0;
    let maxSum = 0;
    let len = 0;
    let max = 0;
    data.forEach(function (item) {
        if (item.metrics) {
            let avgvalue = parseInt((JSON.parse(item.metrics)).Psum.avgvalue);
            let maxvalue = parseInt((JSON.parse(item.metrics)).Psum.maxvalue);
            let minvalue = parseInt((JSON.parse(item.metrics)).Psum.minvalue);
            (maxvalue > max) && (max = maxvalue);
            averageSum = averageSum + avgvalue;
            maxSum = maxSum + maxvalue;
            minSum = minSum + minvalue;
            roundedVal = Math.ceil(avgvalue / 10) * 10;
            len++
            result.push({
                deviceid: item.deviceid,
                metricid: 'Psum_kW',
                value: avgvalue,
                roundedVal: roundedVal,
                timestamp: ((item.tots / 1000 + item.fromts / 1000) / 2) * 1000
            });
        }
    });

    return { data: result, avgvalue: (averageSum / len), max };
}
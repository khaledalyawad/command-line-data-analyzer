import React, { useState, useEffect } from "react";
import EventDataService from "../services/EventService";
import Response from '../types/Event';
import Select from 'react-select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const EventsList: React.FC = () => {
  const [response, setResponse] = useState({} as Response);
  const [file, setFile] = useState<string>('demoCompressorWeekData');
  const [loading, setLoading] = useState<boolean>(false);
  const [hours, setHours] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [selectedOptionHour, setSelectedOptionHour] = useState<{}| null>(null);
  const [selectedOptionDay, setSelectedOptionDay] = useState<{}| null>(null);
  const [selectedOptionWeek, setSelectedOptionWeek] = useState<{}| null>(null);
  const [chartData, setChartData] = useState<string[]>([]);
  const [chartLabel, setChartLabel] = useState<number[]>([]);
  const [showChart, setShowChart] = useState<boolean>(false);

  useEffect(() => {
    retrieveEvents(file);
  }, [file]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const labels = chartLabel;
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [...chartData]
        ,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const retrieveEvents = (file: any) => {
    setLoading(true);
    EventDataService.get(file)
      .then((res: any) => {
        setResponse(res.data);
        setHours(res.data.hour);        
        setDays(res.data.day);        
        setWeeks(res.data.week);        
        setLoading(false);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const setActiveFile = (file: string) => {
    setLoading(true);
    setFile(file);
  };

  const handleHourChange = function (selectedOption: any) {
    setSelectedOptionHour(selectedOption);
    setSelectedOptionDay(null);
    setSelectedOptionWeek(null);
    filterDisplayData(selectedOption, 'hour');
    renderChart();
    
  }
  const handleDayChange = function (selectedOption: any) {
    setSelectedOptionHour(null);
    setSelectedOptionDay(selectedOption);
    setSelectedOptionWeek(null);
    filterDisplayData(selectedOption, 'day');
    renderChart();
    
  }
  const handleWeekChange = function (selectedOption: any) {
    setSelectedOptionHour(null);
    setSelectedOptionDay(null);
    setSelectedOptionWeek(selectedOption);
    filterDisplayData(selectedOption, 'week');
    renderChart();
    
  }

  const renderChart = function() {
    setShowChart(true);
  }

  const filterDisplayData = function (selectedOption: any, cycle: string) {
    chartData.length = 0;
    setChartData([...chartData]);
    chartLabel.length = 0;
    setChartLabel([...chartLabel]);
    return response.data.filter((item: any, i: number)=>{      
      if (item[cycle].includes(selectedOption.value)){
        chartData.push(item.value);
        setChartData([...chartData]);
        chartLabel.push(i);
        setChartLabel([...chartLabel]);
      }
      return item[cycle].includes(selectedOption.value)
    })    
  }

  return (
    <>
      <div className="list row">
        <div className="col-md-12">
          <h4>Log List</h4>
        </div>
      </div>
      <div className="list row">
        <div className="col-md-12">
          <div>
            <br />
            <div style={{ display: 'flex', 'justifyContent': 'space-between' }}><span>Please choose a file </span>{loading && <>&nbsp; &nbsp; &nbsp; loading ...</>}</div>
            <br />
            <div className="btn-group" role="group">
              <button disabled={loading} onClick={() => setActiveFile('demoCompressorWeekData')} type="button" className={"btn " + (file === "demoCompressorWeekData" ? "btn-dark" : "btn-link")}>demoCompressorWeekData</button>
              <button disabled={loading} onClick={() => setActiveFile('demoPumpDayData')} type="button" className={"btn " + (file === "demoPumpDayData" ? "btn-dark" : "btn-link")}>demoPumpDayData</button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="list row">
        {response.message && <div className="col-md-12">
          {response.message}
        </div>}
      </div>
      <br />
      <div className="list row">
        {response.message && <div className="col-md-12">
          Hour:
          <Select
            value={selectedOptionHour}
            onChange={handleHourChange}
            options={hours}
          />
        </div>}
      </div>
      <br />
      <div className="list row">
        {response.message && <div className="col-md-12">
          Days:
          <Select
            value={selectedOptionDay}
            onChange={handleDayChange}
            options={days}
          />
        </div>}
      </div>
      <br />
      <div className="list row">
        {response.message &&<div className="col-md-12">
          Weeks:
           <Select
            value={selectedOptionWeek}
            onChange={handleWeekChange}
            options={weeks}
          />
        </div>}
      </div>
      <div className="list row">
        {showChart && <div className="col-md-12">
          <Line options={options} data={data} />
        </div>}
      </div>
    </>
  );
};

export default EventsList;

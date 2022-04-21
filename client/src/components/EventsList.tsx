import React, { useState, useEffect } from "react";
import EventDataService from "../services/EventService";
import Response from '../types/Event';
import Select from 'react-select';

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

  useEffect(() => {
    retrieveEvents(file);
  }, [file]);

  const retrieveEvents = (file: any) => {
    setLoading(true);
    EventDataService.get(file)
      .then((res: any) => {
        console.log(res.data);
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
    console.log(filterDisplayData(selectedOption, 'hour'))
  }
  const handleDayChange = function (selectedOption: any) {
    setSelectedOptionHour(null);
    setSelectedOptionDay(selectedOption);
    setSelectedOptionWeek(null);
    console.log(filterDisplayData(selectedOption, 'day'))
  }
  const handleWeekChange = function (selectedOption: any) {
    setSelectedOptionHour(null);
    setSelectedOptionDay(null);
    setSelectedOptionWeek(selectedOption);
    console.log(filterDisplayData(selectedOption, 'week'))
  }

  const filterDisplayData = function (selectedOption: any, cycle: string) {
    return response.data.filter((item: any)=>{      
      return item[cycle].includes(selectedOption.value)
    })    
  }

  return (
    <>
      <div className="list row">
        <div className="col-md-6">
          <h4>Log List</h4>
        </div>

        <div className="col-md-6">
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
        {response.message && <div className="col-md-6">
          {response.message}
        </div>}
      </div>
      <br />
      <div className="list row">
        {response.message && <div className="col-md-6">
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
        {response.message && <div className="col-md-6">
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
        {response.message &&<div className="col-md-6">
          Weeks:
           <Select
            value={selectedOptionWeek}
            onChange={handleWeekChange}
            options={weeks}
          />
        </div>}
      </div>
    </>
  );
};

export default EventsList;

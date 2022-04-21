import React, { useState, useEffect } from "react";
import EventDataService from "../services/EventService";
import Response from '../types/Event';

const EventsList: React.FC = () => {
  const [response, setResponse] = useState<Response>();
  const [file, setFile] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    retrieveEvents();
  }, [file]);

  const retrieveEvents = () => {
    EventDataService.getAll()
      .then((response: any) => {
        setResponse(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const setActiveFile = (file: string) => {
    setLoading(true);
    setFile(file);
  };

  return (
    <div className="list row">
      <div className="col-md-6">
        <h4>Log List</h4>

        <ul className="list-group">
          {/* {events &&
            events.data.map((event, index) => (
              <li
                className={"list-group-item "}
                key={index}
              >
                {event.max}
              </li>
            ))} */}
        </ul>

      </div>

      <div className="col-md-6">
        <div>
          <br />
          <div style={{ display: 'flex', 'justifyContent': 'space-between' }}><span>Please choose a file </span>{loading && <>&nbsp; &nbsp; &nbsp; loading ...</>}</div>
          <ul>

            <li><button onClick={() => setActiveFile('demoCompressorWeekData')} type="button" className="btn btn-link">demoCompressorWeekData</button></li>
            <li><button onClick={() => setActiveFile('demoPumpDayData')} type="button" className="btn btn-link">demoPumpDayData</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventsList;

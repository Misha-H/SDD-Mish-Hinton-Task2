import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import './style.css';

// interface ObjCustomContent {
//   html: string;
//   domNodes: any[];
// }

const weather: Weather = [];

const getWeather = async () => {
  const responce = await (
    await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&hourly=temperature_2m&forecast_days=16&timezone=auto&daily=temperature_2m_max&daily=temperature_2m_min&start_date=2023-03-26&end_date=2023-05-06'
    )
  ).json();
  console.log(responce);
};
(async () => {
  let calendar = new Calendar(document.getElementById('app')!, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    dayCellContent: (renderProps, createElement) => {
      // console.log(renderProps);
      return {
        html: `<div class="datetemp">
        <div class="date"><span>${renderProps.dayNumberText}</span></div>
        <div class="temp"><span></span></div>
      </div>`,
      };
    },
  });
  const getISO = (date: Date) => {
    return calendar.formatIso(date).split('T')[0];
  };
  console.log(calendar.view.activeStart.toISOString(), calendar.view.activeEnd);
  calendar.render();

  console.log(getISO(calendar.view.activeStart));
})();

interface WeatherDay {
  date: number;
  max: number;
  min: number;
}

type Weather = Array<WeatherDay>;

weather[0].max;

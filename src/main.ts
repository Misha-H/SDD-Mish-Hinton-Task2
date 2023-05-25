import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import './style.css';
import tooltip from './tooltip';

interface WeatherDay {
  date: number;
  max: number;
  min: number;
}

type Weather = Array<WeatherDay>;

const weather: Weather = [];

const getWeather = async (startDate: string, endDate: string) => {
  try {
    const response = await (
      await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&hourly=temperature_2m&forecast_days=16&timezone=auto&daily=temperature_2m_max&daily=temperature_2m_min&start_date=${startDate}&end_date=${endDate}`
      )
    ).json();
    console.log(response);
    //checking if the api returns an error, specific to this api.
    if (response.error) {
      return;
    }
    /**
     *
     */
    const dailyTimes: Array<string> = response.daily.time;

    for (let i = 0; i < dailyTimes.length; i++) {
      weather.push({
        date: new Date(dailyTimes[i]).setHours(0, 0, 0, 0),
        max: response.daily.temperature_2m_max[i],
        min: response.daily.temperature_2m_min[i],
      });
    }
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  let calendar = new Calendar(document.getElementById('calendar')!, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    /**
     *
     * @param renderProps
     * @returns Cell content.
     */
    dayCellContent: (renderProps) => {
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

  const startDate = getISO(calendar.view.activeStart);
  const nowDate = new Date().getTime();
  const calendarEndDate = calendar.view.activeEnd.getTime();
  const fortnightFromNow = nowDate + 1209600000;

  const endDate =
    fortnightFromNow > calendarEndDate ? calendarEndDate : fortnightFromNow;

  await getWeather(startDate, getISO(new Date(endDate)));

  console.log(calendar.view.activeStart.toISOString(), calendar.view.activeEnd);
  calendar.render();

  console.log(getISO(calendar.view.activeStart));

  // Initialise tooltip
  tooltip(calendar);
})();

// const toggleToolbar = document.querySelectorAll('.toggle-toolbar');
// const stickyToolbarContainer = document.querySelector(
//   '.sticky-toolbar-container'
// );
// toggleToolbar.forEach(function (element) {
//   element.addEventListener('click', function () {
//     stickyToolbarContainer.classList.toggle('show-toolbar');
//   });
// });

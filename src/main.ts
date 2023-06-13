import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import './style.css';

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
  /**
   * Define available form inputs elements.
   */
  interface FormInputElements extends HTMLFormControlsCollection {
    'event-date': HTMLInputElement;
    'event-title': HTMLInputElement;
  }

  /**
   * @remarks
   * Given:
   * ```html
   * <form>
   *   <input type='text' name="event-date" value='Hello' />
   *   <input type='text' name="event-title" value='World!' />
   * </form>
   * ```
   *
   * Extend `HTMLFormElement` to include HTML `<form>` inputs.
   *
   * @example
   * From: `HTMLFormElement`:
   * ```ts
   * {
   *   elements: {};
   * }
   * ```
   *
   * To: `AddEventFormElement`:
   * ```ts
   * {
   *   elements: {
   *     'event-date': HTMLInputElement;
   *     'event-title': HTMLInputElement;
   *   },
   * }
   * ```
   */
  interface AddEventFormElement extends HTMLFormElement {
    elements: FormInputElements;
  }

  // Change typing of form from HTMLFormElement to AddEventFormElement
  const $form = document.querySelector('form')! as AddEventFormElement;

  // https://fullcalendar.io/docs/event-source-object

  function initModal(event: MouseEvent) {
    // Get access to modal
    const $modal = document.getElementById('add-event-modal')!;
    // Get access to calendar
    const $calendar = document.getElementById('calendar')!;
    // Get access to to all elements in modal with the `modal-exit` class
    const $modalExitBtns = $modal.querySelectorAll('.modal-exit');

    // Prevent browser from performing default actions (like refreshing page)
    event.preventDefault();

    /**
     * Close the active modal.
     */
    function closeModal(event: SubmitEvent | Event) {
      event.preventDefault();
      $modal.classList.remove('active');
      $calendar.classList.remove('hidden');
      $form.removeEventListener('submit', formSubmit);
    }
    /**
     * Submit information / create event
     */
    function formSubmit(event: SubmitEvent) {
      calendar.addEvent({
        id: Math.random().toString(),
        date: $form.elements['event-date'].value,
        title: $form.elements['event-title'].value,
      });

      closeModal(event);
    }

    // Make the calendar invisible
    $calendar.classList.add('hidden');
    // Make the modal visible
    $modal.classList.add('active');

    $modalExitBtns.forEach(($modalExitBtn) => {
      // Close modal on click event
      $modalExitBtn.addEventListener('click', closeModal);
    });

    // Init form
    $form.addEventListener('submit', formSubmit);
  }

  const calendar = new Calendar(document.getElementById('calendar')!, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    customButtons: {
      addEvent: {
        text: 'Add Event',
        click: initModal,
      },
    },
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today addEvent',
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
})();

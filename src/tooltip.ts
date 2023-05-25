import type { Calendar } from '@fullcalendar/core';

export default function (calendar: Calendar) {
  // Get the tooltip list elements from HTML document
  const $tooltipItems = document.getElementsByClassName('tooltip-item')!;

  function createEvent() {
    calendar.addEvent({
      id: Math.random().toString(),
      date: new Date(),
      title: 'Hello',
    });
  }

  // https://fullcalendar.io/docs/event-source-object

  // Add event click listener to each tooltip button list item
  for (let i = 0; i < $tooltipItems.length; i++) {
    // <li class="tooltip-item">
    //   <button>2</button>
    // </li>
    $tooltipItems[i].children[0].addEventListener('click', () => createEvent());
  }
}

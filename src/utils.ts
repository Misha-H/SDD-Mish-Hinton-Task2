import type { Calendar } from '@fullcalendar/core';

export default function (calendar: Calendar) {
  // Get the tooltip list elements from HTML document
  const $addEventBtn = document.getElementById(
    'add-event'
  )! as HTMLButtonElement;
  const $form = document.querySelector('form')!;

  function formAction(event: SubmitEvent) {
    calendar.addEvent({
      id: Math.random().toString(),
      date: $form.elements['event-date'].value,
      title: $form.elements['event-title'].value,
    });

    event.preventDefault();
    console.log($form.elements);
    console.log($form.elements['event-title'].value);
    console.log($form.elements['event-date'].value);
    console.log(new Date($form.elements['event-date'].value));
  }

  // https://fullcalendar.io/docs/event-source-object

  /**
   * Initalise modal element.
   * @param event Click event from modal trigger button.
   */
  function initModal(event: MouseEvent) {
    // Prevent browser from performing default actions (like refreshing page)
    event.preventDefault();
    // Get access to modal
    const $modal = document.getElementById('add-event-modal')!;
    // Hide calendar
    const $calendar = document.getElementById('calendar')!;
    $calendar.classList.add('hidden');
    // Make visible
    $modal.classList.add('active');
    // Attach click listeners to all elements in modal with the `modal-exit` class
    const $modalExitBtns = $modal.querySelectorAll('.modal-exit');
    $modalExitBtns.forEach(($modalExitBtn) => {
      // Close modal on click event
      $modalExitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        $modal.classList.remove('active');
        $calendar.classList.remove('hidden');
        $form.removeEventListener('submit', formAction);
      });
    });
    // Init form
    $form.addEventListener('submit', formAction);
  }

  $addEventBtn.addEventListener('click', initModal);
}

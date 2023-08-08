import { usersDb } from './utils';

import type { AddEventFormElement } from './types';

// Signup form element
const $formSignup: AddEventFormElement<{
  'signup-username': HTMLInputElement;
  'signup-password': HTMLInputElement;
}> = document.querySelector('.signup form')!;

// Login form element
const $formLogin: AddEventFormElement<{
  'login-username': HTMLInputElement;
  'login-password': HTMLInputElement;
}> = document.querySelector('.login form')!;

/**
 * Handle Signup Form
 */
$formSignup.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault();

  usersDb.addUser({
    username: $formSignup.elements['signup-username'].value,
    password: $formSignup.elements['signup-password'].value,
  });
});

/**
 * Handle Login Form
 */
$formLogin.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault();
  console.log($formLogin.elements);

  const user = usersDb.login(
    $formLogin.elements['login-username'].value,
    $formLogin.elements['login-password'].value
  );

  if (user) {
    // User does exist in database
    // window.location.href = `/calendar`
  } else {
    // User does not exist in database
  }
});

import { signIn, getUser } from '../js/auth';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    signIn();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    return;
  }

  loginBtn.disabled = true;
  userSection.hidden = false;
  userSection.querySelector('.username').innerText = user.username;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
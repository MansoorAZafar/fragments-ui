import { signIn, getUser } from '../js/auth';
import { getUserFragments } from '../js/api';

async function init() {
  // Get our UI elements
  const hiddenContent = document.querySelector('#hidden-content');
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

  console.log(await getUserFragments(user));

  loginBtn.disabled = true;
  hiddenContent.hidden = false;
  hiddenContent.querySelector('.username').innerText = user.username;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);

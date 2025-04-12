let apiUrl = process.env.API_URL || 'http://localhost:8080';
/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function getUserFragmentsExpanded(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

/**
 * Creates a new fragment for the authenticated user by sending a POST request
 * to the fragments microservice.
 *
 * @param {Object} user - The authenticated user object (must include `authorizationHeaders()`).
 * @param {Buffer} data - The binary data to store as a fragment.
 * @param {string} contentType - The MIME type of the data (e.g., 'text/plain', 'application/json').
 * @returns {Object} - The created fragment's details if successful, otherwise `null`.
 */
export async function createUserFragment(user, data, contentType) {
  console.log('Creating a new user fragment...');
  console.log(`data is: `, data);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: {
        ...user.authorizationHeaders(),
        'Content-Type': contentType,
      },
      body: data,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const responseData = await res.json();
    console.log('Successfully created user fragment', responseData);
    return responseData;
  } catch (err) {
    console.error('Unable to create fragment', { err });
    throw new Error('invalid content for this fragment type');
  }
}

/**
 * Deletes a fragment by their ID
 *
 * @param {Object} user - The authenticated user object (must include `authorizationHeaders()`).
 * @param {Number} fragmentID - the fragment ID.
 * @returns {Object} - The created fragment's details if successful, otherwise `null`.
 */
export async function deleteFragment(user, fragmentID) {
  console.log(`Deleting a fragment...`);

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentID}`, {
      method: 'DELETE',
      headers: {
        ...user.authorizationHeaders(),
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const responseData = await res.json();
    console.log('Successfully deleted user fragment', responseData);

    return responseData;
  } catch (err) {
    console.error('Unable to delete fragment', { err });
    return null;
  }
}

export async function updateFragment(user, fragmentID, body, currentType) {
  console.log(`Updating a fragment...`);

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentID}`, {
      method: 'PUT',
      headers: {
        ...user.authorizationHeaders(),
        'Content-Type': currentType,
      },
      body: body,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const responseData = await res.json();
    console.log('Successfully updated user fragment', responseData);

    return responseData;
  } catch (err) {
    console.error('Unable to update fragment', { err });
    return null;
  }
}

export async function convertAndGetData(user, fragmentId, extension) {
  console.log(`Converting a fragment...`);

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}.${extension}`, {
      method: 'GET',
      headers: {
        ...user.authorizationHeaders(),
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const responseData = await res.text();
    console.log('Successfully converted user fragment', responseData);

    return responseData;
  } catch (err) {
    console.error('Unable to convert fragment', { err });
    return null;
  }
}

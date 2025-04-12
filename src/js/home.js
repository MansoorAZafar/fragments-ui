import {
  getUserFragmentsExpanded,
  getUserFragments,
  createUserFragment,
  deleteFragment,
  updateFragment,
  convertAndGetData,
} from '../js/api';
import { getUser } from '../js/auth';

async function loadFragments() {
  const container = document.getElementById('fragments-container');
  const getFragmentsButton = document.getElementById('load-frag-btn');

  console.log(container.innerHTML.length);
  if (container.innerHTML.length < 10) {
    getFragmentsButton.innerHTML = 'Hide Fragments';

    const user = await getUser();
    if (!user) {
      alert('You need to log in to get fragments.');
      return;
    }

    const userFragments = await getUserFragmentsExpanded(user);
    // console.log('user fragments: ', userFragments.fragments);
    renderFragments(userFragments);
  } else {
    container.innerHTML = '';
    getFragmentsButton.innerHTML = 'Show Fragments Details';
  }
}

async function renderFragments(userFragments) {
  const user = await getUser();
  if (!user) {
    alert('You need to log in to create a fragment.');
    return;
  }

  const container = document.getElementById('fragments-container');
  container.innerHTML = ''; // Clear existing fragments

  const fragments = userFragments.fragments; // Access the fragments array
  console.log('fragments: ', fragments);

  fragments.forEach((fragment) => {
    const card = document.createElement('div');
    card.classList.add(
      'fragment-card',
      'bg-white',
      'shadow-md',
      'rounded-lg',
      'p-4',
      'cursor-pointer',
      'transition-all',
      'duration-300',
      'hover:shadow-lg'
    );

    // DELETE BUTTON
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2 mt-4';
    deleteBtn.onclick = async () => {
      await deleteFragment(user, fragment.id);
      loadFragments(); // Refresh after deletion
    };

    // UPDATE BUTTON + POPUP
    const updateBtn = document.createElement('button');
    updateBtn.innerText = 'Update';
    updateBtn.className =
      'bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2 mt-4';
    updateBtn.onclick = () => showUpdatePopup(fragment.id, fragment.type);

    // CONVERT TO
    const convertSelect = document.createElement('select');
    convertSelect.className = 'mt-2 p-2 border border-gray-300 rounded-md';

    [
      'txt',
      'md',
      'html',
      'csv',
      'json',
      'yml',
      'yaml',
      'png',
      'jpg',
      'webp',
      'gif',
      'avif',
    ].forEach((type) => {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = type;
      convertSelect.appendChild(opt);
    });

    const convertBtn = document.createElement('button');
    convertBtn.innerText = 'Convert';
    convertBtn.className = 'bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 mt-2';
    convertBtn.onclick = async () => {
      const targetType = convertSelect.value;
      console.log(targetType);

      try {
        const updatedContent = await convertAndGetData(user, fragment.id, targetType);
        if (updatedContent == null) {
          throw new Error('cannot convert these 2 fragments');
        }

        console.log('successfully converted fragment');
        alert(`Converted Content:\n${updatedContent}`);
      } catch (err) {
        console.log('couldnt convert fragment', { err });
        alert(`${fragment.type} cannot be converted to type ${targetType}`);
      }

      // const res = await fetch(`/v1/fragments/${fragment.id}.${targetType.split('/')[1]}`, {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //     Accept: targetType,
      //   },
      // });
      // const converted = await res.text(); // or blob for images
      // alert(`Converted content:\n\n${converted}`);
    };

    card.appendChild(deleteBtn);
    card.appendChild(updateBtn);
    card.appendChild(convertSelect);
    card.appendChild(convertBtn);

    // Create title
    const title = document.createElement('h3');
    title.classList.add('text-lg', 'font-semibold');
    title.innerText = `Fragment (${fragment.type}):\t ${fragment.id.slice(0, 6)}`;

    // Create content (always visible now)
    const content = document.createElement('p');
    content.classList.add('text-gray-600', 'mt-2'); // Removed "hidden" class
    content.innerText = `ID: ${fragment.id} \nSize: ${fragment.size} bytes \nCreated: ${new Date(fragment.created).toLocaleString()}\nUpdated: ${new Date(fragment.updated).toLocaleString()}`;

    // Append elements
    card.appendChild(title);
    card.appendChild(content);
    container.appendChild(card);
  });
}

async function showUpdatePopup(fragmentId, currentType) {
  const user = await getUser();

  const popup = document.createElement('div');
  popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
  popup.innerHTML = `
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h3 class="text-lg font-bold mb-2">Update Fragment</h3>
      <textarea id="update-text" class="w-full h-40 p-2 border mb-2" placeholder="New content"></textarea>
      <input type="file" id="update-file" class="mb-2">
      <div class="flex justify-end gap-2">
        <button id="cancel-popup" class="bg-gray-300 px-3 py-1 rounded">Cancel</button>
        <button id="confirm-update" class="bg-green-500 text-white px-3 py-1 rounded">Update</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('cancel-popup').onclick = () => popup.remove();

  document.getElementById('confirm-update').onclick = async () => {
    const file = document.getElementById('update-file').files[0];
    let body;

    if (file) {
      body = file;
    } else {
      const text = document.getElementById('update-text').value;
      body = text;
    }

    console.log(body);

    try {
      const updatedFragment = await updateFragment(user, fragmentId, body, currentType);
      // Call the API function to create the fragment
      // const createdFragment = await createUserFragment(user, contentToSend, type);
      if (updatedFragment == null) {
        throw new Error('Invalid content');
      }
      console.log('Updated Fragment:');

      // Optionally, you can update the UI or clear the form
      alert('Fragment Updated successfully!');

      // Clear the form
    } catch (error) {
      console.error('Error Updating fragment:', error);
      alert('Please ensure the content is correct for this type of fragment.');
    }

    popup.remove();
    loadFragments();
  };
}

async function createFragment() {
  const user = await getUser();
  if (!user) {
    alert('You need to log in to create a fragment.');
    return;
  }

  const type = document.getElementById('frag_type').value;
  const content = document.querySelector('textarea').value;
  const file = document.getElementById('frag_file').files[0];
  let contentToSend = content;

  if (file) {
    contentToSend = file;
  } else if (content.length > 0) {
    contentToSend = content;
  } else {
    alert('Please enter some content for your fragment.');
    return;
  }

  try {
    // Call the API function to create the fragment
    const createdFragment = await createUserFragment(user, contentToSend, type);
    if (createFragment == null) {
      throw new Error('Invalid content');
    }
    console.log('Created Fragment:', createdFragment);

    // Optionally, you can update the UI or clear the form
    alert('Fragment created successfully!');

    // Optionally, load the fragments again after creation
    loadFragments();

    // Clear the form
    document.querySelector('textarea').value = '';
  } catch (error) {
    console.error('Error creating fragment:', error);
    alert('Please ensure the content is correct for this type of fragment.');
  }
}

async function loadFragmentsBasic() {
  const fragmentsList = document.getElementById('fragments-list');
  fragmentsList.innerHTML = ''; // Clear existing list items

  const user = await getUser();
  const fragments = await getUserFragments(user);
  const fragmentsArr = fragments.fragments;

  fragmentsArr.forEach((fragment) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'bg-white',
      'shadow-md',
      'rounded-lg',
      'p-4',
      'cursor-pointer',
      'transition-all',
      'duration-300',
      'hover:shadow-lg'
    );

    // Add fragment details to the list item
    listItem.innerHTML = `
            Fragment ID: ${fragment} <br>    
        `;

    // Append the list item to the ul
    fragmentsList.appendChild(listItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const loadFragmentsButton = document.getElementById('load-frag-btn');
  const createFragmentsButton = document.getElementById('create-frags-btn');
  loadFragmentsButton.addEventListener('click', loadFragments);
  createFragmentsButton.addEventListener('click', createFragment);

  loadFragmentsBasic();
});

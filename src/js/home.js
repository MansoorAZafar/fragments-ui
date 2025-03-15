import { getUserFragmentsExpanded, getUserFragments, createUserFragment } from "../js/api";
import { getUser } from '../js/auth';

async function loadFragments() {
    const container = document.getElementById("fragments-container");
    const getFragmentsButton = document.getElementById("load-frag-btn")
    
    console.log(container.innerHTML.length)
    if(container.innerHTML.length < 10) {
        getFragmentsButton.innerHTML = "Hide Fragments"

        const user = await getUser();
        if (!user) {
            alert("You need to log in to get fragments.");
            return;
        }

        const userFragments = await getUserFragmentsExpanded(user);
        renderFragments(userFragments);
    } else {
        container.innerHTML = "";
        getFragmentsButton.innerHTML = "Show Fragments Details"
    }   
}


function renderFragments(userFragments) {
    const container = document.getElementById("fragments-container");
    container.innerHTML = ""; // Clear existing fragments

    const fragments = userFragments.fragments; // Access the fragments array

    fragments.forEach(fragment => {
        const card = document.createElement("div");
        card.classList.add(
            "fragment-card",
            "bg-white",
            "shadow-md",
            "rounded-lg",
            "p-4",
            "cursor-pointer",
            "transition-all",
            "duration-300",
            "hover:shadow-lg"
        );

        // Create title
        const title = document.createElement("h3");
        title.classList.add("text-lg", "font-semibold");
        title.innerText = `Fragment (${fragment.type}):\t ${fragment.id.slice(0,6)}`;

        // Create content (always visible now)
        const content = document.createElement("p");
        content.classList.add("text-gray-600", "mt-2"); // Removed "hidden" class
        content.innerText = `ID: ${fragment.id} \nSize: ${fragment.size} bytes \nCreated: ${new Date(fragment.created).toLocaleString()}\nUpdated: ${new Date(fragment.updated).toLocaleString()}`;

        // Append elements
        card.appendChild(title);
        card.appendChild(content);
        container.appendChild(card);
    });
}


async function createFragment() {
    const user = await getUser();
    if (!user) {
        alert("You need to log in to create a fragment.");
        return;
    }

    const type = document.getElementById("frag_type").value;
    const content = document.querySelector("textarea").value;

    if (!content.trim()) {
        alert("Please enter some content for your fragment.");
        return;
    }

    try {
        // Call the API function to create the fragment
        const createdFragment = await createUserFragment(user, content, type);
        console.log("Created Fragment:", createdFragment);

        // Optionally, you can update the UI or clear the form
        alert("Fragment created successfully!");

        // Optionally, load the fragments again after creation
        loadFragments();

        // Clear the form
        document.querySelector("textarea").value = "";
    } catch (error) {
        console.error("Error creating fragment:", error);
        alert("There was an error creating the fragment.");
    }
}

async function loadFragmentsBasic() {
    const fragmentsList = document.getElementById("fragments-list");
    fragmentsList.innerHTML = ""; // Clear existing list items

    const user = await getUser();
    const fragments = await getUserFragments(user);
    const fragmentsArr = fragments.fragments;

    fragmentsArr.forEach(fragment => {
        const listItem = document.createElement("li");
        listItem.classList.add("bg-white", "shadow-md", "rounded-lg", "p-4", "cursor-pointer", "transition-all", "duration-300", "hover:shadow-lg");

        // Add fragment details to the list item
        listItem.innerHTML = `
            Fragment ID: ${fragment} <br>    
        `;

        // Append the list item to the ul
        fragmentsList.appendChild(listItem);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const loadFragmentsButton = document.getElementById("load-frag-btn");
    const createFragmentsButton = document.getElementById("create-frags-btn");
    loadFragmentsButton.addEventListener("click", loadFragments);
    createFragmentsButton.addEventListener("click", createFragment);

    loadFragmentsBasic();
});

import { messagesRef, push, onChildAdded } from './FireBase.js';


document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const modal = document.getElementById('rules-modal');
    const acceptButton = document.getElementById('accept-rules');
    const inputArea = document.getElementById('message-input');
    const postButton = document.getElementById('post-button');
    const messagesContainer = document.getElementById('messages-container');
    
    // --- NEW: Generate a unique ID for the current user's session ---
    let currentUserId = localStorage.getItem('chatUserId');
    if (!currentUserId) {
        // Generate a simple, unique ID (e.g., using a random number)
        currentUserId = 'user_' + Math.random().toString(36).substring(2, 9) + Date.now();
        localStorage.setItem('chatUserId', currentUserId);
    }

    // --- Modal Logic ---

    // Show modal on load
    modal.classList.remove('hidden');

    // Handle 'Accept' button click
    acceptButton.addEventListener('click', () => {
        // Hide the modal with a smooth transition
        modal.classList.add('hidden');
        // Optional: remove modal from DOM after transition for cleanliness
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Matches CSS transition time
        inputArea.focus(); // Focus on the input box
    });

    // --- Firebase Placeholder Setup ---

    // NOTE: Replace this with your actual Firebase config
    // const firebaseConfig = {
    //     apiKey: "YOUR_API_KEY",
    //     authDomain: "YOUR_AUTH_DOMAIN",
    //     databaseURL: "YOUR_DATABASE_URL",
    //     projectId: "YOUR_PROJECT_ID",
    //     storageBucket: "YOUR_STORAGE_BUCKET",
    //     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    //     appId: "YOUR_APP_ID"
    // };

    // Initialize Firebase (Uncomment and configure when ready)
    // if (typeof firebase !== 'undefined') {
    //     firebase.initializeApp(firebaseConfig);
    //     var db = firebase.database();
    //     var messagesRef = db.ref('messages');
    // }

    // --- Message Management Functions ---

    // The emoji checker function has been removed as requested.
    // Messages will now be posted regardless of content.

    // Function to create and append a message element
    function createMessageElement(messageText, isCurrentUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';


    if (isCurrentUser === false) {
        // If it's NOT the current user, add the 'other-user' class
        messageDiv.classList.add('other-user'); 
    }

        messageDiv.textContent = messageText;
        // Append to container
        messagesContainer.appendChild(messageDiv);

        // Scroll to the bottom to show the new message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return messageDiv;
    }

    // Function to handle the ephemeral lifecycle of a message (30 seconds)
    function startMessageLifecycle(messageDiv) {
        // Wait for 30 seconds (30000 milliseconds)
        const LIFETIME = 30000;
        const DISAPPEAR_TIME = 1000; // Matches CSS transition duration

        setTimeout(() => {
            // Start the smooth upward disappearance animation
            messageDiv.classList.add('disappearing');

            // After the animation finishes, remove the element from the DOM
            setTimeout(() => {
                messageDiv.remove();
            }, DISAPPEAR_TIME);

        }, LIFETIME);
    }

    // Function to handle posting a message
    function postMessage() {
        const text = inputArea.value.trim();

        if (text) {
            // // 1. Local UI Update (Instant feedback)
            // Removed
            // const messageDiv = createMessageElement(text);
            // startMessageLifecycle(messageDiv);

            const tempMessageDiv = createMessageElement(
              'Posting...', 
              true // isCurrentUser is true
            ); 

            tempMessageDiv.classList.add('feedback-message');

            inputArea.value = ''; 
            
            // 2. *** NEW MODULAR FIREBASE PUSH CODE ***
            push(messagesRef, { // <-- Use the imported 'push' function
                content: text,
                timestamp: serverTimestamp(),
                senderId: currentUserId
            })
            .then(() => {
                tempMessageDiv.remove();
                console.log("Successfully pushed message to RTDB.");
            })
            .catch((error) => {
                // If this logs, it's a Security Rules error
                console.error("Failed to write to RTDB:", error);

                // 3. (NEW) Update the temporary message to show the error
                tempMessageDiv.textContent = '❌ Format Error: Must be Emoji-Only!';
                tempMessageDiv.classList.remove('message'); // Remove blue style
                tempMessageDiv.classList.add('error-message'); // Add a red/error style (see CSS below)
            
                // Start the message lifecycle for the error message so it disappears
                startMessageLifecycle(tempMessageDiv);
            });
            // ***************************************
        }
        // If text is empty, nothing happens.
    }

    // --- Event Listeners ---

    // Post button click
    postButton.addEventListener('click', postMessage);

    // Enter key press in the input box
    inputArea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            postMessage();
        }
    });
    
    // *** NEW MODULAR FIREBASE LISTENER CODE ***
    onChildAdded(messagesRef, (snapshot) => { // <-- Use the imported 'onChildAdded' function
        const data = snapshot.val();

        const isCurrentUser = (data.senderId === currentUserId);
        
        // Ensure you don't double-post if you removed the local UI update above
        // For now, let's keep the listener logic simple:
        const messageDiv = createMessageElement(data.content, isCurrentUser);
        startMessageLifecycle(messageDiv);
    });
    // ***************************************
    
});

document.getElementById('share-button').addEventListener('click', async () => {
    // 1. Check if the Web Share API is supported by the user's browser
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Check out my awesome app!', // Title for the share dialog
                text: 'Come join the discussion on this ephemeral chat app.', // Text content
                url: window.location.href, // The URL to share (the current page)
            });
            console.log('Content shared successfully');
        } catch (error) {
            // User cancelled the share or other error occurred
            console.error('Error sharing:', error);
        }
    } else {
        // 2. Fallback for browsers that don't support the API (e.g., desktop Firefox)
        // A common fallback is to copy the link to the clipboard.
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Could not copy link:', err));
    }
});
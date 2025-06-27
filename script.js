document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const submitBtn = document.getElementById('submitBtn'); // Renamed from getRecommendationBtn
    const resetBtn = document.getElementById('resetBtn');
    const recommendationOutput = document.getElementById('recommendationOutput');
    const recommendationHistoryList = document.getElementById('recommendationHistoryList');
    const errorModalOverlay = document.getElementById('errorModalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModalOverlay = document.getElementById('aboutModalOverlay');
    const aboutCloseBtn = document.getElementById('aboutCloseBtn');

    /**
     * Shows a custom modal with a given title and message.
     * @param {HTMLElement} modalOverlay - The overlay element of the modal to show.
     * @param {string} title - The title for the modal.
     * @param {string} message - The message content for the modal (only for error modal).
     */
    function showModal(modalOverlay, title, message = '') {
        if (modalOverlay === errorModalOverlay) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
        }
        // For about modal, title and content are static in HTML, just show it.
        modalOverlay.classList.add('visible');
    }

    /**
     * Hides a custom modal.
     * @param {HTMLElement} modalOverlay - The overlay element of the modal to hide.
     */
    function hideModal(modalOverlay) {
        modalOverlay.classList.remove('visible');
    }

    // Event listeners for modals
    modalCloseBtn.addEventListener('click', () => hideModal(errorModalOverlay));
    errorModalOverlay.addEventListener('click', (event) => {
        // Hide modal only if the click is directly on the overlay, not its content
        if (event.target === errorModalOverlay) {
            hideModal(errorModalOverlay);
        }
    });

    aboutBtn.addEventListener('click', () => showModal(aboutModalOverlay));
    aboutCloseBtn.addEventListener('click', () => hideModal(aboutModalOverlay));
    aboutModalOverlay.addEventListener('click', (event) => {
        // Hide modal only if the click is directly on the overlay, not its content
        if (event.target === aboutModalOverlay) {
            hideModal(aboutModalOverlay);
        }
    });

    /**
     * Resets all radio button selections and the recommendation output.
     */
    function resetSelections() {
        // Uncheck all radio buttons by iterating over them
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });

        // Reset the recommendation output text and styling to initial state
        recommendationOutput.textContent = 'Your delicious recommendation will appear here!';
        recommendationOutput.className = 'recommendation-output'; // Ensure only base class is applied
    }

    // Event listener for the Reset button
    resetBtn.addEventListener('click', resetSelections);

    /**
     * Adds a new recommendation entry to the history list.
     * Includes the recommendation text, selected mood, age, time, and a timestamp.
     * @param {string} recommendationText - The food recommendation text.
     * @param {string} mood - The selected mood.
     * @param {string} age - The selected age group.
     * @param {string} time - The selected time of day.
     */
    function addRecommendationToHistory(recommendationText, mood, age, time) {
        // Check if the "No recommendations yet" message exists and remove it if so
        const emptyMessage = recommendationHistoryList.querySelector('.empty-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        // Create a new list item element for the history
        const listItem = document.createElement('li');
        const now = new Date();
        // Format the timestamp for display (e.g., "03:45 PM")
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Format the date for display (e.g., "7/27/2025")
        const date = now.toLocaleDateString();

        // Populate the list item with recommendation details and timestamp
        listItem.innerHTML = `
            <span><strong>${recommendationText}</strong> for ${mood} (${age}, ${time})</span>
            <span class="timestamp">${date} ${timestamp}</span>
        `;
        // Add the new item to the beginning of the list (most recent first)
        recommendationHistoryList.prepend(listItem);
    }

    // Event listener for the main "Submit" button
    submitBtn.addEventListener('click', () => {
        // Retrieve the value of the selected radio button for each category
        const selectedMood = document.querySelector('input[name="mood"]:checked')?.value;
        const selectedAge = document.querySelector('input[name="age"]:checked')?.value;
        const selectedTime = document.querySelector('input[name="time"]:checked')?.value;

        // --- Input Validation ---
        // If any selection is missing, show an error modal and stop processing
        if (!selectedMood || !selectedAge || !selectedTime) {
            showModal(errorModalOverlay, 'Missing Information!', 'Please make sure to select an option for Mood, Age Group, and Time of Day.');
            // Also reset the recommendation output display in case a previous recommendation was shown
            recommendationOutput.textContent = 'Your delicious recommendation will appear here!';
            recommendationOutput.className = 'recommendation-output'; // Reset styling
            return; // Exit the function
        }

        // --- Visual Feedback: Loading State ---
        // Update the output area to indicate processing is underway
        recommendationOutput.textContent = 'Thinking...';
        // Add a specific CSS class to apply loading styles (e.g., yellow background)
        recommendationOutput.className = 'recommendation-output loading';

        // Simulate an asynchronous operation (e.g., fetching data from a server)
        setTimeout(() => {
            let recommendation = '';

            // --- Core Recommendation Logic (based on flowchart rules) ---
            // This section implements the conditional logic to determine the food recommendation
            // based on the user's selected mood, age group, and time of day.
            if (selectedMood === 'happy') {
                if (selectedAge === 'young') {
                    if (selectedTime === 'morning') {
                        recommendation = 'Burger 🍔';
                    } else { // Evening
                        recommendation = 'Lahmacun 🍕';
                    }
                } else { // Middle-aged
                    if (selectedTime === 'morning') {
                        recommendation = 'Healthy bowl 🥗';
                    } else { // Evening
                        recommendation = 'Adana Kebab 🌶️';
                    }
                }
            } else { // Sad Mood
                if (selectedAge === 'young') {
                    if (selectedTime === 'morning') {
                        recommendation = 'Simit 🥯';
                    } else { // Evening
                        recommendation = 'Just coffee ☕';
                    }
                } else { // Middle-aged
                    if (selectedTime === 'morning') {
                        recommendation = 'Bread and cheese 🍞🧀';
                    } else { // Evening
                        recommendation = 'Soup 🍲';
                    }
                }
            }

            // --- Display Result ---
            // Update the output area with the determined recommendation
            recommendationOutput.textContent = recommendation;
            // Reset the CSS class to its default state, removing any loading/error styles
            recommendationOutput.className = 'recommendation-output';

            // --- Update History ---
            // Add the just-generated recommendation to the history list
            addRecommendationToHistory(recommendation, selectedMood, selectedAge, selectedTime);

        }, 700); // The delay is set to 700 milliseconds to simulate processing time
    });
});

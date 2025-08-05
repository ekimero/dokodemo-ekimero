// Track play counts for all audio elements on the page
document.addEventListener('DOMContentLoaded', function() {
  // Function to update the play count in Firebase
  function incrementPlayCount() {
    const counterRef = firebase.database().ref("totalPlays");
    counterRef.transaction((currentCount) => {
      return (currentCount || 0) + 1;
    });
  }

  // Attach event listeners to all audio elements
  function setupAudioListeners() {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      // Only add listener if not already added
      if (!audio.dataset.playListenerAdded) {
        audio.addEventListener('play', incrementPlayCount);
        audio.dataset.playListenerAdded = 'true';
      }
    });
  }

  // Initial setup
  setupAudioListeners();

  // Also set up a MutationObserver to catch dynamically added audio elements
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        setupAudioListeners();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
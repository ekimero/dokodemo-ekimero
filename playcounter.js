// Initialize Firebase (only if not already done in HTML)
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyBrgf00OFxksjZuFOQxgB1qUjZmLSG7yqk",
    authDomain: "dokodemo-ekimero.firebaseapp.com",
    databaseURL: "https://dokodemo-ekimero-default-rtdb.firebaseio.com",
    projectId: "dokodemo-ekimero",
    storageBucket: "dokodemo-ekimero.firebasestorage.app",
    messagingSenderId: "189766315545",
    appId: "1:189766315545:web:e88fb50dc039f7d2f28488",
    measurementId: "G-EPCBNCPN4F"
  };
  firebase.initializeApp(firebaseConfig);
}

// Track last play time
let lastPlayTime = 0;

function safeIncrement() {
  const now = Date.now();
  
  // 10-second cooldown
  if (now - lastPlayTime < 10000) {
    console.log("Please wait 10 seconds between plays");
    return;
  }
  
  lastPlayTime = now;
  
  // Update Firebase
  const counterRef = firebase.database().ref("totalPlays");
  counterRef.transaction((current) => {
    return (current || 0) + 1;
  }).then(() => {
    console.log("Play counted!");
  }).catch((error) => {
    console.error("Error updating counter:", error);
  });
}

// Attach to ALL play buttons
document.querySelectorAll(".play-button").forEach(button => {
  button.addEventListener("click", safeIncrement);
});
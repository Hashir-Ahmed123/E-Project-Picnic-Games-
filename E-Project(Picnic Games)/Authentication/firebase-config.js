// Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
 apiKey: "YOUR_KEY",
 authDomain: "YOUR_DOMAIN",
 projectId: "YOUR_PROJECT_ID",
 storageBucket: "YOUR_BUCKET",
 messagingSenderId: "YOUR_SENDER_ID",
 appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Export for use in other files
window.firebaseAuth = {
  auth: auth,
  googleProvider: googleProvider,
  signInWithEmailAndPassword: (email, password) => auth.signInWithEmailAndPassword(email, password),
  createUserWithEmailAndPassword: (email, password) => auth.createUserWithEmailAndPassword(email, password),
  signInWithGoogle: () => auth.signInWithPopup(googleProvider),
  signOut: () => auth.signOut(),
  onAuthStateChanged: (callback) => auth.onAuthStateChanged(callback),
  currentUser: () => auth.currentUser
};

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyBZhdYcTJnqCYMtuSrLgzwx6Yr99sKaqoo",
  authDomain: "chan-37d36.firebaseapp.com",
  projectId: "chan-37d36",
  storageBucket: "chan-37d36.appspot.com",
  messagingSenderId: "1048879389879",
  appId: "1:1048879389879:web:8660ec07117da0a4238132"
};

// --- Initialize Firebase (compat style for script tags) ---
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// --- DOM Elements ---
const postButton = document.getElementById('postButton');
const textInput = document.getElementById('textInput');
const imageInput = document.getElementById('imageInput');
const postsDiv = document.getElementById('posts');

// --- Post Button Logic ---
postButton.addEventListener('click', async () => {
  const text = textInput.value;
  const file = imageInput.files[0];
  let imageUrl = "";

  if (file) {
    const storageRef = storage.ref('images/' + file.name);
    await storageRef.put(file);
    imageUrl = await storageRef.getDownloadURL();
  }

  await db.collection('posts').add({
    text: text,
    image: imageUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Clear inputs
  textInput.value = "";
  imageInput.value = "";
});

// --- Display Posts Live ---
db.collection('posts').orderBy('timestamp', 'desc')
.onSnapshot((snapshot) => {
  postsDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const post = doc.data();
    const postEl = document.createElement('div');
    postEl.className = "post";
    postEl.innerHTML = `
      ${post.image ? `<img src="${post.image}" alt="image post">` : ''}
      <p>${post.text}</p>
      <hr>
    `;
    postsDiv.appendChild(postEl);
  });
});


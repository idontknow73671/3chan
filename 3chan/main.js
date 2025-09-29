// --- Firebase Setup ---
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBZhdYcTJnqCYMtuSrLgzwx6Yr99sKaqoo",
  authDomain: "chan-37d36.firebaseapp.com",
  projectId: "chan-37d36",
  storageBucket: "chan-37d36.appspot.com",
  messagingSenderId: "1048879389879",
  appId: "1:1048879389879:web:8660ec07117da0a4238132"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// --- Post Button ---
const postButton = document.getElementById('postButton');
const textInput = document.getElementById('textInput');
const imageInput = document.getElementById('imageInput');
const postsDiv = document.getElementById('posts');

postButton.addEventListener('click', async () => {
  const text = textInput.value;
  const file = imageInput.files[0];
  let imageUrl = "";

  if (file) {
    const storageRef = ref(storage, 'images/' + file.name);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, 'posts'), {
    text: text,
    image: imageUrl,
    timestamp: serverTimestamp()
  });

  // Clear inputs
  textInput.value = "";
  imageInput.value = "";
});

// --- Display Posts Live ---
const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
onSnapshot(postsQuery, (snapshot) => {
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

// Firebase config (your keys)
const firebaseConfig = {
  apiKey: "AIzaSyBZhdYcTJnqCYMtuSrLgzwx6Yr99sKaqoo",
  authDomain: "chan-37d36.firebaseapp.com",
  projectId: "chan-37d36",
  storageBucket: "chan-37d36.appspot.com",
  messagingSenderId: "1048879389879",
  appId: "1:1048879389879:web:8660ec07117da0a4238132"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Post a message
function postMessage() {
  const text = document.getElementById("postText").value;
  const file = document.getElementById("imageUpload").files[0];

  if (!text && !file) return alert("Write something or choose an image!");

  if (file) {
    const storageRef = storage.ref("images/" + file.name);
    storageRef.put(file).then(() => {
      storageRef.getDownloadURL().then((url) => {
        db.collection("posts").add({
          text: text || "",
          image: url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    });
  } else {
    db.collection("posts").add({
      text: text,
      image: "",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  document.getElementById("postText").value = "";
  document.getElementById("imageUpload").value = "";
}

// Display posts
db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<p>${data.text}</p>` + (data.image ? `<img src="${data.image}" />` : "");
    postsDiv.appendChild(div);
  });
});



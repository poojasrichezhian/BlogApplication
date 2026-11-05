const storageKey = "blog-app-posts";

function getPosts() {
  return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

function showPosts() {
  const container = document.querySelector("#posts");
  if (!container) return;

  const posts = getPosts();
  if (posts.length === 0) {
    container.textContent = "No blogs yet. Create the first one!";
    return;
  }

  posts.forEach((post) => {
    const article = document.createElement("article");
    article.className = "card";
    const image = document.createElement("img");
    image.className = "post-image";
    image.src = `https://picsum.photos/seed/${encodeURIComponent(post.title)}/800/450`;
    image.alt = "Decorative blog cover";
    image.loading = "lazy";


    const title = document.createElement("h2");
    title.textContent = post.title;

    const date = document.createElement("small");
    date.textContent = post.date;

    const content = document.createElement("p");
    content.textContent = post.content;

    article.append(image, title, date, content);

    container.append(article);
  });
}

const createForm = document.querySelector("#create-form");

if (createForm) {
  createForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const post = {
      title: createForm.elements.title.value.trim(),
      content: createForm.elements.content.value.trim(),
      date: new Date().toLocaleDateString()
    };

    if (!post.title || !post.content) return;

    const posts = getPosts();
    posts.unshift(post);
    localStorage.setItem(storageKey, JSON.stringify(posts));
    window.location.href = "dashboard.html";
  });
}

document.querySelectorAll(".demo-auth").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.querySelector(".form-message").textContent =
      "This is a frontend demo. Account authentication is not connected yet.";
  });
});

showPosts();

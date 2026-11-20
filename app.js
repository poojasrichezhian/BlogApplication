const API_URL = "http://localhost:5000/api";


// =====================================
// 1. USER REGISTRATION AND LOGIN
// =====================================

document.querySelectorAll(".demo-auth").forEach((form) => {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const message = form.querySelector(".form-message");

        const name = form.elements.name?.value.trim();
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;

        const isRegister = Boolean(name);

        const endpoint = isRegister
            ? "/auth/register"
            : "/auth/login";

        const requestBody = isRegister
            ? { name, email, password }
            : { email, password };

        try {

            message.textContent = "Please wait...";

            const response = await fetch(API_URL + endpoint, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(requestBody)

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            if (isRegister) {

                message.textContent =
                    "Registration successful! Please login.";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);

            } else {

                localStorage.setItem("blog-token", data.token);

                localStorage.setItem(
                    "blog-user",
                    JSON.stringify(data.user)
                );

                message.textContent = "Login successful!";

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);

            }

        } catch (error) {

            message.textContent = error.message;

        }

    });

});


// =====================================
// 2. DISPLAY ALL BLOGS
// =====================================

async function showPosts() {

    const container = document.querySelector("#posts");

    if (!container) return;

    container.textContent = "Loading blogs...";

    try {

        const response = await fetch(API_URL + "/blogs");

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        container.innerHTML = "";

        const posts = data.blogs;

        if (posts.length === 0) {

            container.textContent =
                "No blogs yet. Create the first one!";

            return;
        }

        posts.forEach((post) => {

            const article = document.createElement("article");

            article.className = "card";

            const image = document.createElement("img");

            image.className = "post-image";

            image.src =
                `https://picsum.photos/seed/${encodeURIComponent(post.title)}/800/450`;

            image.alt = "Decorative blog cover";

            image.loading = "lazy";


            const title = document.createElement("h2");

            // Title links to the Blog Details page
            const titleLink = document.createElement("a");

            titleLink.href = "blog-details.html?id=" + post._id;

            titleLink.textContent = post.title;

            title.append(titleLink);


            const date = document.createElement("small");

            date.textContent =
                new Date(post.createdAt).toLocaleDateString();


            const content = document.createElement("p");

            content.textContent = post.content;


            const author = document.createElement("small");

            author.textContent = "By " + post.author;


            const readMore = document.createElement("a");

            readMore.className = "read-more";

            readMore.href = "blog-details.html?id=" + post._id;

            readMore.textContent = "Read more →";


            article.append(
                image,
                title,
                date,
                content,
                author,
                readMore
            );

            container.append(article);

        });

    } catch (error) {

        container.textContent =
            "Unable to load blogs: " + error.message;

    }

}


// =====================================
// 3. CREATE NEW BLOG
// =====================================

const createForm = document.querySelector("#create-form");

if (createForm) {

    createForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const token = localStorage.getItem("blog-token");

        if (!token) {

            alert("Please login first!");

            window.location.href = "login.html";

            return;
        }

        const title = createForm.elements.title.value.trim();

        const content = createForm.elements.content.value.trim();

        if (!title || !content) return;

        try {

            const response = await fetch(API_URL + "/blogs", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    title,
                    content
                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert("Blog published successfully!");

            window.location.href = "dashboard.html";

        } catch (error) {

            alert(error.message);

        }

    });

}


// =====================================
// 4. SHOW ONE BLOG (Blog Details page)
// =====================================

async function showBlogDetails() {

    const container = document.querySelector("#blog-details");

    if (!container) return;

    // Read the blog ID from the page address, e.g. blog-details.html?id=abc123
    const blogId = new URLSearchParams(window.location.search).get("id");

    if (!blogId) {

        container.textContent = "No blog selected.";

        return;
    }

    container.textContent = "Loading blog...";

    try {

        const response = await fetch(API_URL + "/blogs/" + blogId);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const post = data.blog;

        container.innerHTML = "";

        document.title = post.title + " | My Blog";

        const image = document.createElement("img");

        image.className = "post-image";

        image.src =
            `https://picsum.photos/seed/${encodeURIComponent(post.title)}/800/450`;

        image.alt = "Decorative blog cover";


        const title = document.createElement("h1");

        title.textContent = post.title;


        const meta = document.createElement("small");

        meta.textContent =
            "By " + post.author + " · " +
            new Date(post.createdAt).toLocaleDateString();


        const content = document.createElement("p");

        content.className = "blog-content";

        content.textContent = post.content;


        const back = document.createElement("a");

        back.className = "read-more";

        back.href = "dashboard.html";

        back.textContent = "← Back to all blogs";


        container.append(image, title, meta, content, back);

    } catch (error) {

        container.textContent =
            "Unable to load blog: " + error.message;

    }

}


// =====================================
// 5. LOAD BLOGS WHEN PAGE OPENS
// =====================================

showPosts();

showBlogDetails();

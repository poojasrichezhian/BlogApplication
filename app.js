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

    // Read the search box and category filter (if they exist on this page)
    const search = document.querySelector("#search-input")?.value.trim() || "";

    const category = document.querySelector("#category-filter")?.value || "All";

    const params = new URLSearchParams();

    if (search) params.set("search", search);

    if (category !== "All") params.set("category", category);

    const query = params.toString() ? "?" + params.toString() : "";

    try {

        const response = await fetch(API_URL + "/blogs" + query);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        container.innerHTML = "";

        const posts = data.blogs;

        if (posts.length === 0) {

            container.textContent = (search || category !== "All")
                ? "No blogs match your search."
                : "No blogs yet. Create the first one!";

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


            const tag = document.createElement("span");

            tag.className = "category-tag";

            tag.textContent = post.category || "General";


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
                tag,
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

// If the address has ?id=..., this page is in EDIT mode
const editId = new URLSearchParams(window.location.search).get("id");

if (createForm && editId) {

    loadBlogForEditing(createForm, editId);

}

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

        const category = createForm.elements.category.value;

        if (!title || !content) return;

        try {

            // EDIT mode: update the blog (PUT). CREATE mode: new blog (POST)
            const url = editId
                ? API_URL + "/blogs/" + editId
                : API_URL + "/blogs";

            const response = await fetch(url, {

                method: editId ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    title,
                    content,
                    category
                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            if (editId) {

                alert("Blog updated successfully!");

                window.location.href = "blog-details.html?id=" + editId;

            } else {

                alert("Blog published successfully!");

                window.location.href = "dashboard.html";

            }

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


        const tag = document.createElement("span");

        tag.className = "category-tag";

        tag.textContent = post.category || "General";


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


        container.append(image, tag, title, meta, content);

        // Show Edit and Delete buttons only to the blog's author
        const currentUser = JSON.parse(localStorage.getItem("blog-user") || "null");

        if (currentUser && currentUser.id === post.authorId) {

            const actions = document.createElement("div");

            actions.className = "blog-actions";

            const editButton = document.createElement("a");

            editButton.className = "edit-button";

            editButton.href = "create.html?id=" + post._id;

            editButton.textContent = "✏️ Edit";

            const deleteButton = document.createElement("button");

            deleteButton.className = "delete-button";

            deleteButton.type = "button";

            deleteButton.textContent = "🗑️ Delete";

            deleteButton.addEventListener("click", () => deleteBlog(post._id));

            actions.append(editButton, deleteButton);

            container.append(actions);

        }

        container.append(back);

    } catch (error) {

        container.textContent =
            "Unable to load blog: " + error.message;

    }

}


// =====================================
// 5. EDIT BLOG: fill the form with the existing blog
// =====================================

async function loadBlogForEditing(form, blogId) {

    document.querySelector("#form-heading").textContent = "Edit your blog";

    document.querySelector("#form-button").textContent = "Save changes →";

    document.title = "Edit Blog | My Blog";

    try {

        const response = await fetch(API_URL + "/blogs/" + blogId);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        form.elements.title.value = data.blog.title;

        form.elements.content.value = data.blog.content;

        form.elements.category.value = data.blog.category || "General";

    } catch (error) {

        alert("Unable to load blog: " + error.message);

    }

}


// =====================================
// 6. DELETE BLOG
// =====================================

async function deleteBlog(blogId) {

    const sure = confirm("Are you sure you want to delete this blog?");

    if (!sure) return;

    const token = localStorage.getItem("blog-token");

    if (!token) {

        alert("Please login first!");

        window.location.href = "login.html";

        return;
    }

    try {

        const response = await fetch(API_URL + "/blogs/" + blogId, {

            method: "DELETE",

            headers: {
                "Authorization": "Bearer " + token
            }

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert("Blog deleted successfully!");

        window.location.href = "dashboard.html";

    } catch (error) {

        alert(error.message);

    }

}


// =====================================
// 7. LOAD BLOGS WHEN PAGE OPENS
// =====================================

showPosts();

showBlogDetails();


// =====================================
// 8. SEARCH AND CATEGORY FILTER (Dashboard)
// =====================================

const searchInput = document.querySelector("#search-input");

const categoryFilter = document.querySelector("#category-filter");

let searchTimer;

if (searchInput) {

    // Wait until the user stops typing for 0.4 seconds, then search
    searchInput.addEventListener("input", () => {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(showPosts, 400);

    });

}

if (categoryFilter) {

    categoryFilter.addEventListener("change", showPosts);

}

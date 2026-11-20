const API_URL = "http://localhost:5000/api";


// =====================================
// 0. LOGIN HELPERS, LOGOUT, NAVIGATION & PAGE PROTECTION (Module 05)
// =====================================

// Read the saved JWT token
function getToken() {

    return localStorage.getItem("blog-token");

}

// Check if the token exists and has not expired
function isLoggedIn() {

    const token = getToken();

    if (!token) return false;

    try {

        // The middle part of a JWT contains the data (including "exp" = expiry time)
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        return payload.exp * 1000 > Date.now();

    } catch (error) {

        return false;

    }

}

// Logout: remove the saved token and user, then go to the Login page
function logout(message) {

    localStorage.removeItem("blog-token");

    localStorage.removeItem("blog-user");

    if (message) alert(message);

    window.location.href = "login.html";

}

// If the server says the token is invalid/expired (401), log the user out
function handleUnauthorized(response) {

    if (response.status === 401) {

        logout("Your session has expired. Please login again.");

        return true;
    }

    return false;

}

// Protect private pages: <body data-private="true">
if (document.body.dataset.private === "true" && !isLoggedIn()) {

    localStorage.removeItem("blog-token");

    localStorage.removeItem("blog-user");

    alert("Please login to continue.");

    window.location.replace("login.html");

}

// Update the navigation bar depending on login status
function updateNavigation() {

    const nav = document.querySelector(".site-header nav");

    if (!nav) return;

    const loggedIn = isLoggedIn();

    nav.querySelectorAll("a").forEach((link) => {

        const page = link.getAttribute("href");

        // Logged in: hide Login and Register
        if (loggedIn && (page === "login.html" || page === "register.html")) {
            link.style.display = "none";
        }

        // Logged out: hide private pages
        if (!loggedIn && (page === "dashboard.html" || page === "create.html")) {
            link.style.display = "none";
        }

    });

    if (loggedIn) {

        const profileLink = document.createElement("a");

        profileLink.href = "profile.html";

        profileLink.textContent = "Profile";

        const logoutLink = document.createElement("a");

        logoutLink.href = "#";

        logoutLink.className = "logout-link";

        logoutLink.textContent = "Logout";

        logoutLink.addEventListener("click", (event) => {

            event.preventDefault();

            logout();

        });

        nav.append(profileLink, logoutLink);

    }

}

updateNavigation();


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

    // Dashboard (data-mine="true") shows only MY blogs; Home shows all blogs
    const onlyMine = container.dataset.mine === "true";

    // Not logged in: the page is already redirecting to Login
    if (onlyMine && !isLoggedIn()) return;

    try {

        const response = onlyMine
            ? await fetch(API_URL + "/blogs/my" + query, {
                headers: { "Authorization": "Bearer " + getToken() }
            })
            : await fetch(API_URL + "/blogs" + query);

        if (onlyMine && handleUnauthorized(response)) return;

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        container.innerHTML = "";

        const posts = data.blogs;

        if (posts.length === 0) {

            container.textContent = (search || category !== "All")
                ? "No blogs match your search."
                : onlyMine
                    ? "You haven't written any blogs yet. Click \"Write a new blog\" to start!"
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

            if (handleUnauthorized(response)) return;

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

        if (isLoggedIn() && currentUser && currentUser.id === post.authorId) {

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

        if (handleUnauthorized(response)) return;

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
// 8. PROFILE PAGE
// =====================================

async function showProfile() {

    const container = document.querySelector("#profile");

    if (!container || !isLoggedIn()) return;

    container.textContent = "Loading profile...";

    try {

        const response = await fetch(API_URL + "/auth/me", {
            headers: { "Authorization": "Bearer " + getToken() }
        });

        if (handleUnauthorized(response)) return;

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const user = data.user;

        container.innerHTML = "";

        const avatar = document.createElement("div");

        avatar.className = "profile-avatar";

        avatar.textContent = user.name.charAt(0).toUpperCase();

        const name = document.createElement("h1");

        name.textContent = user.name;

        const details = document.createElement("dl");

        details.className = "profile-details";

        const rows = [
            ["📧 Email", user.email],
            ["📅 Joined", new Date(user.joinedAt).toLocaleDateString()],
            ["📝 Blogs written", user.blogCount]
        ];

        rows.forEach(([label, value]) => {

            const dt = document.createElement("dt");

            dt.textContent = label;

            const dd = document.createElement("dd");

            dd.textContent = value;

            details.append(dt, dd);

        });

        const actions = document.createElement("div");

        actions.className = "blog-actions";

        const myBlogs = document.createElement("a");

        myBlogs.className = "edit-button";

        myBlogs.href = "dashboard.html";

        myBlogs.textContent = "📚 My blogs";

        const logoutButton = document.createElement("button");

        logoutButton.className = "delete-button";

        logoutButton.type = "button";

        logoutButton.textContent = "🚪 Logout";

        logoutButton.addEventListener("click", () => logout());

        actions.append(myBlogs, logoutButton);

        container.append(avatar, name, details, actions);

    } catch (error) {

        container.textContent = "Unable to load profile: " + error.message;

    }

}

showProfile();


// =====================================
// 9. SEARCH AND CATEGORY FILTER (Dashboard)
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

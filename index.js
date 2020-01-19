function getInfo(page) {
    return fetch("https://picsum.photos/v2/list?page=" + page).then(response =>
        response.json()
    );
}

function getSidebarImage(url) {
    const parts = url.split("/");

    return parts
        .slice(0, parts.length - 2)
        .concat("200", "200")
        .join("/");
}

function createImage(src) {
    const img = document.createElement("img");
    img.src = src;
    return img;
}

function attachImages(info) {
    info.forEach(element => {
        const img = createImage(getSidebarImage(element.download_url));
        img.addEventListener("click", imageClickHandler(element));

        document.getElementById("sidebar").appendChild(img);
    });
}

function imageClickHandler({ author, width, height, download_url }) {
    return () => {
        const previewImage = document.getElementById("previewImage");
        previewImage.src = download_url;
        previewImage.style.display = "block";

        document.getElementById(
            "previewInfo"
        ).textContent = `${author} ${width}x${height}px`;
    };
}

function loadImages(page = 1) {
    return getInfo(page).then(attachImages);
}

function scrollHandler() {
    let loadingMore = false;
    let currentPage = 1;

    document.getElementById("sidebar").addEventListener("scroll", evt => {
        sidebar = evt.target;
        const totalScroll = sidebar.scrollTop + sidebar.clientHeight;

        if (totalScroll > sidebar.scrollHeight * 0.8 && !loadingMore) {
            loadingMore = true;
            loadImages(currentPage + 1)
                .then(() => {
                    loadingMore = false;
                    currentPage++;
                })
                .catch(e => console.error(e));
        }
    });
}

function loadApp() {
    scrollHandler();

    loadImages().catch(e => {
        console.error(e);
        alert("Requesting information from API failed!");
    });
}

loadApp();

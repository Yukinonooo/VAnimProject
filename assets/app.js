(function () {
  const allVideos = (window.VANIM_VIDEOS || []).slice().sort((a, b) => a.id - b.id);
  const featuredGrid = document.getElementById("featured-grid");
  const galleryGrid = document.getElementById("gallery-grid");
  const stats = document.getElementById("stats");
  const search = document.getElementById("search");
  const autoplayToggle = document.getElementById("autoplay-toggle");
  const bibtex = document.getElementById("bibtex");
  const copyCitation = document.getElementById("copy-citation");

  let isAutoplay = true;
  let observer = null;

  function videoPath(file) {
    return "assets/videos/" + file;
  }

  function createVideoCard(item) {
    const card = document.createElement("article");
    card.className = "video-card";

    const video = document.createElement("video");
    video.controls = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "none";
    video.dataset.src = videoPath(item.file);

    if (isAutoplay) {
      video.autoplay = true;
    }

    const frame = document.createElement("div");
    frame.className = "video-frame";
    frame.appendChild(video);

    const meta = document.createElement("div");
    meta.className = "video-meta";
    meta.innerHTML =
      '<p class="video-title">' +
      item.title +
      '</p><span class="badge">#' +
      String(item.id).padStart(2, "0") +
      "</span>";

    card.appendChild(frame);
    card.appendChild(meta);
    return card;
  }

  function mountVideo(video) {
    if (!video || video.dataset.loaded === "true") {
      return;
    }

    const source = document.createElement("source");
    source.src = video.dataset.src;
    source.type = "video/mp4";
    video.appendChild(source);
    video.load();
    video.dataset.loaded = "true";
  }

  function refreshPlayback(video) {
    if (!video) {
      return;
    }

    if (!isAutoplay) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }

    video.setAttribute("autoplay", "autoplay");

    if (video.dataset.loaded === "true") {
      const maybePromise = video.play();
      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(function () {});
      }
    }
  }

  function observeVideos(container) {
    const videos = container.querySelectorAll("video");

    if (!("IntersectionObserver" in window)) {
      videos.forEach(function (video) {
        mountVideo(video);
        refreshPlayback(video);
      });
      return;
    }

    if (!observer) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            const video = entry.target;
            if (entry.isIntersecting) {
              mountVideo(video);
              refreshPlayback(video);
            } else if (isAutoplay) {
              video.pause();
            }
          });
        },
        {
          rootMargin: "180px 0px",
          threshold: 0.2
        }
      );
    }

    videos.forEach(function (video) {
      observer.observe(video);
    });
  }

  function resetObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function renderFeatured() {
    featuredGrid.innerHTML = "";
    allVideos.slice(0, 6).forEach(function (item) {
      featuredGrid.appendChild(createVideoCard(item));
    });
  }

  function renderGallery(videos) {
    galleryGrid.innerHTML = "";
    stats.textContent = "Showing " + videos.length + " of " + allVideos.length + " demos";

    if (!videos.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "No cases matched that search. Try a case number such as 12 or 37.";
      galleryGrid.appendChild(empty);
      return;
    }

    videos.forEach(function (item) {
      galleryGrid.appendChild(createVideoCard(item));
    });
  }

  function filterVideos() {
    const query = search.value.trim().toLowerCase();
    let filtered = allVideos;

    if (query) {
      filtered = allVideos.filter(function (item) {
        return String(item.id).includes(query) || item.title.toLowerCase().includes(query);
      });
    }

    resetObserver();
    renderGallery(filtered);
    observeVideos(featuredGrid);
    observeVideos(galleryGrid);
  }

  autoplayToggle.addEventListener("click", function () {
    isAutoplay = !isAutoplay;
    autoplayToggle.textContent = "Autoplay: " + (isAutoplay ? "On" : "Off");

    document.querySelectorAll("video").forEach(function (video) {
      refreshPlayback(video);
    });
  });

  search.addEventListener("input", filterVideos);

  if (copyCitation && bibtex) {
    copyCitation.addEventListener("click", function () {
      const text = bibtex.textContent.trim();

      if (!navigator.clipboard) {
        copyCitation.textContent = "Clipboard Unavailable";
        return;
      }

      navigator.clipboard.writeText(text).then(
        function () {
          copyCitation.textContent = "Copied";
          window.setTimeout(function () {
            copyCitation.textContent = "Copy BibTeX";
          }, 1400);
        },
        function () {
          copyCitation.textContent = "Copy Failed";
        }
      );
    });
  }

  renderFeatured();
  filterVideos();
})();

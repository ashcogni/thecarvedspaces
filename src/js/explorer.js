export function initExplorer() {
    const explorer = document.getElementById('project-explorer');
    const closeExplorerBtn = document.querySelector('.close-explorer');
    const categoryView = document.getElementById('category-view');
    const detailView = document.getElementById('project-detail-view');
    const explorerTitle = document.getElementById('explorer-title');
    const projectGrid = document.getElementById('project-grid');
    const projectTitle = document.getElementById('project-title');
    const projectGallery = document.getElementById('project-gallery');
    const backBtn = document.querySelector('.back-to-category');
    const segmentCards = document.querySelectorAll('.segment-card');

    let projectsData = {};
    const segmentThumbnailMap = new Map();
    const pendingThumbnailSegments = new Set();

    function setupSegmentCardThumbnails() {
        segmentCards.forEach(card => {
            const thumbnail = card.querySelector('.segment-thumb');
            if (!thumbnail) return;

            const category = card.dataset.segment || card.querySelector('h3')?.innerText?.trim();
            if (!category) return;

            const sanitizedCategory = category.replace(/\s+/g, '_');
            if (!thumbnail.getAttribute('src')) {
                thumbnail.src = `/resources/${sanitizedCategory}/thumbnail.png`;
            }

            segmentThumbnailMap.set(category, thumbnail);

            thumbnail.addEventListener('error', () => handleSegmentThumbnailError(category, thumbnail));
        });
    }

    function handleSegmentThumbnailError(category, img) {
        if (img.dataset.thumbnailState === 'fallback') {
            img.dataset.thumbnailState = 'missing';
            img.classList.add('segment-thumb--missing');
            return;
        }

        img.dataset.thumbnailState = 'pending';
        img.classList.add('segment-thumb--missing');
        pendingThumbnailSegments.add(category);
        applySegmentThumbnailFallback(category);
    }

    function applySegmentThumbnailFallback(category) {
        const thumbnailEl = segmentThumbnailMap.get(category);
        if (!thumbnailEl) return;

        const fallbackProject = (projectsData[category] || [])[0];
        if (!fallbackProject?.thumbnail) return;

        thumbnailEl.dataset.thumbnailState = 'fallback';
        thumbnailEl.classList.remove('segment-thumb--missing');
        thumbnailEl.src = fallbackProject.thumbnail;
        pendingThumbnailSegments.delete(category);
    }

    setupSegmentCardThumbnails();

    // Fetch Projects Data
    fetch('/projects.json')
        .then(response => {
            if (!response.ok) return {};
            return response.json();
        })
        .then(data => {
            projectsData = data;
            console.log('Projects loaded:', projectsData);
            pendingThumbnailSegments.forEach(category => applySegmentThumbnailFallback(category));
        })
        .catch(err => console.error('Error loading projects:', err));

    // Open Explorer (Expertise Cards)
    segmentCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.segment || card.querySelector('h3')?.innerText;
            if (category) {
                openCategory(category);
            }
        });
    });

    // Close Explorer
    if (closeExplorerBtn) {
        closeExplorerBtn.addEventListener('click', () => {
            explorer.classList.remove('active');
            // Reset views
            setTimeout(() => {
                categoryView.classList.add('active');
                detailView.classList.remove('active');
            }, 400);
        });
    }

    // Back Button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            detailView.classList.remove('active');
            categoryView.classList.add('active');
        });
    }

    function openCategory(category) {
        if (!explorerTitle || !projectGrid || !explorer) return;

        explorerTitle.innerText = category;
        projectGrid.innerHTML = ''; // Clear previous

        const projects = projectsData[category] || [];

        if (projects.length === 0) {
            projectGrid.innerHTML = '<p style="font-size: 1.5rem; text-align: center; grid-column: 1/-1;">No projects found. Please add folders to public/resources/' + category + '</p>';
        } else {
            projects.forEach(project => {
                const item = document.createElement('div');
                item.className = 'explorer-item';
                item.innerHTML = `
                    <div class="explorer-thumb" style="background-image: url('${project.thumbnail}')"></div>
                    <h3>${project.name}</h3>
                `;
                item.addEventListener('click', () => openProject(project));
                projectGrid.appendChild(item);
            });
        }

        explorer.classList.add('active');
    }

    function openProject(project) {
        if (!projectTitle || !projectGallery) return;

        projectTitle.innerText = project.name;
        projectGallery.innerHTML = ''; // Clear previous

        project.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'gallery-image';
            img.loading = 'lazy';
            projectGallery.appendChild(img);
        });

        categoryView.classList.remove('active');
        detailView.classList.add('active');
    }
}

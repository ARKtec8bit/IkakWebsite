async function fetchData() {
    const response = await fetch('data.xml');
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    return xml;
}

async function populateCategories() {
    const xml = await fetchData();
    const categories = xml.querySelectorAll('category');
    const categorySelect = document.getElementById('categorySelect');
    
    categories.forEach(category => {
        let option = document.createElement('option');
        option.value = category.getAttribute('name');
        option.textContent = category.getAttribute('name');
        categorySelect.appendChild(option);
    });
}

async function updateNames() {
    const xml = await fetchData();
    const categorySelect = document.getElementById('categorySelect');
    const nameSelect = document.getElementById('nameSelect');
    nameSelect.innerHTML = '<option value="">Select Name</option>'; // Reset name options

    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
        const items = xml.querySelectorAll(`category[name="${selectedCategory}"] item`);
        items.forEach(item => {
            let option = document.createElement('option');
            option.value = item.querySelector('name').textContent;
            option.textContent = item.querySelector('name').textContent;
            nameSelect.appendChild(option);
        });

        // Update <h1> with selected category
        document.getElementById('selectedCategory').innerText = selectedCategory;
    }
}

async function showDetails() {
    const xml = await fetchData();
    const categorySelect = document.getElementById('categorySelect');
    const nameSelect = document.getElementById('nameSelect');
    const detailsDiv = document.getElementById('details');

    const selectedCategory = categorySelect.value;
    const selectedName = nameSelect.value;

    if (selectedCategory && selectedName) {
        const category = xml.querySelector(`category[name="${selectedCategory}"]`);
        const selectedItem = Array.from(category.querySelectorAll('item')).find(item => item.querySelector('name').textContent === selectedName);

        let stepsList = '';
        const steps = selectedItem.querySelector('steps ol');
        if (steps) {
            stepsList = '<ol>';
            steps.querySelectorAll('li').forEach(step => {
                stepsList += `<li>${step.textContent}</li>`;
            });
            stepsList += '</ol>';
        }

        detailsDiv.innerHTML = `
            <h1>${selectedItem.querySelector('name').textContent}</h1>
            <h2>${selectedItem.querySelector('level').textContent}</h2>
            <p><strong>Description:</strong> ${selectedItem.querySelector('description').textContent}</p>
            ${selectedItem.querySelector('video_link').textContent ? `<iframe width="560" height="315" src="${selectedItem.querySelector('video_link').textContent}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` : ''}
            ${stepsList}
        `;
    } else {
        detailsDiv.innerHTML = '<p>Select a category and name to see the details.</p>';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed');
    
    const collapseBtn = document.querySelector('.collapse-btn');
    if (sidebar.classList.contains('collapsed')) {
        collapseBtn.innerHTML = '&#9654;'; // Right arrow
    } else {
        collapseBtn.innerHTML = '&#9664;'; // Left arrow
    }
}

// Initialize categories on page load (only if categories exist on the page)
window.onload = () => {
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        populateCategories();
    }
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
};

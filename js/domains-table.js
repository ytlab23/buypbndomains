// Function to generate a random domain with only TLD visible
function generateDomain(tld) {
    // Generate a random number of asterisks (8-12) followed by the TLD
    const asteriskCount = Math.floor(Math.random() * 5) + 8;
    return '*'.repeat(asteriskCount) + tld;
}

// Function to calculate price based on DA, backlinks, and age
function calculatePrice(da, backlinks, age) {
    const basePrice = da * 10; // Base price increases with DA
    const backlinkValue = backlinks * 0.1; // Each backlink adds some value
    const ageBonus = age * 5; // Older domains are more valuable
    return Math.floor(basePrice + backlinkValue + ageBonus);
}

// Function to generate realistic backlinks based on DA
function generateBacklinks(da) {
    // Higher DA domains have more backlinks
    const minLinks = Math.max(100, (da - 15) * 200);
    const maxLinks = Math.max(500, da * 100);
    return Math.floor(Math.random() * (maxLinks - minLinks + 1)) + minLinks;
}

// Generate 50+ domains with realistic data
const domainsData = [];
const niches = [
    'Health', 'Finance', 'Technology', 'Lifestyle', 'Business', 
    'Travel', 'Fitness', 'Food', 'Fashion', 'Real Estate',
    'Education', 'Sports', 'Gaming', 'Music', 'Photography',
    'Marketing', 'Design', 'Crypto', 'Automotive', 'Pets',
    'Home Improvement', 'Beauty', 'Parenting', 'Dating', 'Finance'
];

const tlds = ['.com', '.net', '.org', '.io', '.co', '.biz'];

// Generate 60 domains for good measure
for (let i = 0; i < 60; i++) {
    const niche = niches[Math.floor(Math.random() * niches.length)];
    const tld = tlds[Math.floor(Math.random() * tlds.length)];
    
    // Generate DA between 20 and 65 with weighted distribution (more lower DA)
    let da;
    const rand = Math.random();
    if (rand < 0.6) {
        // 60% chance for DA 20-40
        da = Math.floor(Math.random() * 21) + 20;
    } else if (rand < 0.9) {
        // 30% chance for DA 41-55
        da = Math.floor(Math.random() * 15) + 41;
    } else {
        // 10% chance for DA 56-65 (premium)
        da = Math.floor(Math.random() * 10) + 56;
    }
    
    // Generate backlinks based on DA with some randomness
    const backlinks = generateBacklinks(da);
    
    // Generate age between 1 and 15 years (older for higher DA)
    const age = Math.min(15, Math.max(1, Math.floor(da / 5) + Math.floor(Math.random() * 5)));
    
    // Generate domain name with only TLD visible
    const domain = generateDomain(tld);
    
    // Calculate price
    const price = calculatePrice(da, backlinks, age);
    
    domainsData.push({
        domain,
        da,
        backlinks,
        age,
        niche,
        price
    });
}

// Sort domains by DA (highest first) by default
domainsData.sort((a, b) => b.da - a.da);

// DOM Elements
let tableBody;
let searchInput;
let categoryFilter;
let daFilter;
let ageFilter;
let tableCount;

// Table state
let currentPage = 1;
const rowsPerPage = 1000; // Show all domains at once
let filteredDomains = [];
let sortColumn = 'da';
let sortDirection = 'desc';

// Initialize the table
function initTable() {
    console.log('Initializing table...');
    
    // Populate category filter with unique categories from domains data
    const categories = [...new Set(domainsData.map(domain => domain.niche))].sort();
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Set up DA filter options
    const daRanges = [
        { value: '0', text: 'All DA Scores' },
        { value: '20', text: 'DA 20+' },
        { value: '30', text: 'DA 30+' },
        { value: '40', text: 'DA 40+' },
        { value: '50', text: 'DA 50+' },
        { value: '60', text: 'DA 60+' }
    ];
    
    daFilter.innerHTML = daRanges.map(range => 
        `<option value="${range.value}">${range.text}</option>`
    ).join('');
    
    // Set up age filter options
    const ageRanges = [
        { value: '', text: 'All Ages' },
        { value: '1-2', text: '1-2 years' },
        { value: '3-5', text: '3-5 years' },
        { value: '5-10', text: '5-10 years' },
        { value: '10-15', text: '10-15 years' }
    ];
    
    ageFilter.innerHTML = ageRanges.map(range => 
        `<option value="${range.value}">${range.text}</option>`
    ).join('');
    
    // Set up event listeners
    searchInput.addEventListener('input', filterDomains);
    categoryFilter.addEventListener('change', filterDomains);
    daFilter.addEventListener('change', filterDomains);
    ageFilter.addEventListener('change', filterDomains);
    
    // Set up column sorting
    document.querySelectorAll('th[data-sort]').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-sort');
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            updateTable();
        });
    });
    
    // Initial render
    console.log('Setting initial filtered domains...');
    filteredDomains = [...domainsData];
    console.log('Filtered domains count:', filteredDomains.length);
    updateTable();
}

// Filter domains based on search and filters
function filterDomains() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : '';
    const daMin = daFilter && daFilter.value ? parseInt(daFilter.value) : 0;
    const [ageMin, ageMax] = ageFilter && ageFilter.value ? ageFilter.value.split('-').map(Number) : [0, 100];
    
    filteredDomains = domainsData.filter(domain => {
        const matchesSearch = searchTerm === '' || 
                           domain.domain.toLowerCase().includes(searchTerm) || 
                           domain.niche.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || domain.niche === category;
        const matchesDa = domain.da >= daMin;
        const matchesAge = ageFilter.value === '' || 
                         (domain.age >= ageMin && 
                         (isNaN(ageMax) ? domain.age >= ageMin : domain.age <= ageMax));
        
        return matchesSearch && matchesCategory && matchesDa && matchesAge;
    });
    
    // Reset to first page when filters change
    currentPage = 1;
    updateTable();
}

// Sort domains
function sortDomains() {
    filteredDomains.sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];
        
        // Handle numeric comparison
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        // Handle string comparison
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

// Update the table with current data
function updateTable() {
    if (!tableBody) return;
    
    // Sort domains
    sortDomains();
    
    // Show all domains (no pagination)
    const currentDomains = [...filteredDomains];
    
    // Update table body
    tableBody.innerHTML = '';
    
    if (currentDomains.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center">No domains found matching your criteria</td>`;
        tableBody.appendChild(row);
    } else {
        currentDomains.forEach(domain => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${domain.domain}</td>
                <td>${domain.da}</td>
                <td>${domain.backlinks.toLocaleString()}</td>
                <td>${domain.age} year${domain.age !== 1 ? 's' : ''}</td>
                <td>${domain.niche}</td>
                <td>$${domain.price}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Update table count if element exists
    if (tableCount) {
        tableCount.textContent = `Showing ${filteredDomains.length} domains`;
    }
    
    // Update sort indicators
    const sortHeaders = document.querySelectorAll('th[data-sort]');
    if (sortHeaders.length > 0) {
        sortHeaders.forEach(header => {
            const icon = header.querySelector('i');
            if (icon) {
                if (header.getAttribute('data-sort') === sortColumn) {
                    icon.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
                } else {
                    icon.className = 'fas fa-sort';
                }
            }
        });
    }
}

// Navigation functions
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
        window.scrollTo({ top: tableBody.offsetTop - 100, behavior: 'smooth' });
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(filteredDomains.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTable();
        window.scrollTo({ top: tableBody.offsetTop - 100, behavior: 'smooth' });
    }
}

// Initialize the table when the DOM is fully loaded
function init() {
    // Get DOM elements
    tableBody = document.getElementById('domainsTableBody');
    searchInput = document.querySelector('.search-container input');
    categoryFilter = document.getElementById('categoryFilter');
    daFilter = document.getElementById('daFilter');
    ageFilter = document.getElementById('ageFilter');
    tableCount = document.getElementById('tableCount');
    
    // Check if all required elements exist
    if (!tableBody || !searchInput || !categoryFilter || !daFilter || !ageFilter || !tableCount) {
        console.error('One or more required DOM elements not found');
        return;
    }
    
    console.log('All DOM elements found, initializing table...');
    initTable();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    // Document is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Document is already loaded, run immediately
    init();
}

/**
 * Component Loader - Loads reusable HTML components
 * Usage: Add <include src="component.html"></include> in your HTML
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all include tags
    const includes = document.querySelectorAll('include');
    let loadedCount = 0;
    
    includes.forEach(include => {
        const src = include.getAttribute('src');
        if (src) {
            // Fetch the component file
            fetch(src)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load component: ${src}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Trim whitespace from HTML
                    html = html.trim();
                    
                    // Create a temporary container
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    
                    // Get the actual element (skip text nodes)
                    let element = null;
                    for (let child of temp.childNodes) {
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            element = child;
                            break;
                        }
                    }
                    
                    if (element) {
                        // Replace the include tag with the loaded element
                        include.parentNode.replaceChild(element, include);
                        console.log(`Component loaded and inserted: ${src}`);
                    } else {
                        console.error(`No element found in component: ${src}`);
                    }
                    
                    loadedCount++;
                    
                    // Fire event when all components are loaded
                    if (loadedCount === includes.length) {
                        window.dispatchEvent(new Event('componentsLoaded'));
                        console.log('All components loaded and inserted');
                    }
                })
                .catch(error => {
                    console.error('Component Loader Error:', error);
                    include.remove();
                    loadedCount++;
                    
                    if (loadedCount === includes.length) {
                        window.dispatchEvent(new Event('componentsLoaded'));
                    }
                });
        }
    });
});



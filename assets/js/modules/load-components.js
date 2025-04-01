export async function loadComponent(path, containerId, callback) {
  console.log(`Trying to load: ${path}`); // اضافه کردن این خط
  
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status} for ${path}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`Fetched content for ${path}`); // اضافه کردن این خط
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found in DOM`);
      return;
    }
    
    container.innerHTML = html;
    
    if (callback) {
      console.log(`Executing callback for ${path}`);
      callback();
    }
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `Error loading component: ${path}`;
    }
  }
}
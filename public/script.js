document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/projects')
    .then(res => res.json())
    .then(projects => {
      const container = document.getElementById('project-list');
      projects.forEach(p => {
        const div = document.createElement('div');
        div.className = 'project';
        div.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p>`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error(err));
});

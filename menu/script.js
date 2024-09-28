document.addEventListener('DOMContentLoaded', () => {
    fetch('https://pizzeria-l6im.onrender.com/menu') 
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById('pizza-items');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="name">${item.name} <span class="value">$${item.value}</span></div>
                    <div class="ingredients">${item.ingredients}</div>
                `;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar os itens:', error));
});

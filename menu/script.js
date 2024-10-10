document.addEventListener('DOMContentLoaded', () => {
    fetch('https://pizzeria-l6im.onrender.com/menu')
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById('pizza-items');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="name">${item.name}
                        <span class="value">$${Number(item.b).toFixed(2)}</span> 
                        <span class="value">$${Number(item.g).toFixed(2)}</span> 
                        <span class="value">$${Number(item.m).toFixed(2)}</span> 
                        <span class="value">$${Number(item.p).toFixed(2)}</span></div>
                    <div class="ingredients">${item.ingredients}</div>
                `;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar os itens:', error));

    fetch('https://pizzeria-l6im.onrender.com/items/portion')
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById('portion-items');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="name">${item.name}
                        <span class="value" style="padding-right: 3%">$${Number(item.value).toFixed(2)}</span> 
                    </div>
                `;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar os itens:', error));

    fetch('https://pizzeria-l6im.onrender.com/items/drink')
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById('drink-items');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="name">${item.name}
                        <span class="value" style="padding-right: 3%">$${Number(item.value).toFixed(2)}</span> 
                    </div>
                `;
                ul.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar os itens:', error));
});

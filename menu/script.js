document.addEventListener('DOMContentLoaded', () => {
    fetch('https://pizzeria-l6im.onrender.com/menu')
        .then(response => response.json())
        .then(data => {
            // Elementos das listas
            const traditionalPizzaList = document.getElementById('traditional-pizza-items');
            const gourmetPizzaList = document.getElementById('gourmet-pizza-items');
            const sweetPizzaList = document.getElementById('sweet-pizza-items');

            data.forEach(item => {
                const li = document.createElement('li');

                // Verifica o tipo de pizza e remove as tags (gourmet) e (doce)
                let pizzaName = item.name;
                let pricesHTML = `
                    <span class="value">$${Number(item.b).toFixed(2)}</span>
                    <span class="value">$${Number(item.g).toFixed(2)}</span>
                    <span class="value">$${Number(item.m).toFixed(2)}</span>
                    <span class="value">$${Number(item.p).toFixed(2)}</span>
                `;

                if (pizzaName.includes('(gourmet)')) {
                    pizzaName = pizzaName.replace(' (gourmet)', '');
                    li.innerHTML = `
                        <div class="pizza-item">
                            <div class="name">${pizzaName}</div>
                            <div class="prices">${pricesHTML}</div>
                        </div>
                        <div class="ingredients">${item.ingredients}</div>
                    `;
                    gourmetPizzaList.appendChild(li);
                } else if (pizzaName.includes('(doce)')) {
                    pizzaName = pizzaName.replace(' (doce)', '');
                    li.innerHTML = `
                        <div class="pizza-item">
                            <div class="name">${pizzaName}</div>
                            <div class="prices">${pricesHTML}</div>
                        </div>
                        <div class="ingredients">${item.ingredients}</div>
                    `;
                    sweetPizzaList.appendChild(li);
                } else {
                    li.innerHTML = `
                        <div class="pizza-item">
                            <div class="name">${pizzaName}</div>
                            <div class="prices">${pricesHTML}</div>
                        </div>
                        <div class="ingredients">${item.ingredients}</div>
                    `;
                    traditionalPizzaList.appendChild(li);
                }
            });
        })
        .catch(error => console.error('Erro ao carregar os itens:', error));

    // Requisições para porções e bebidas permanecem as mesmas
    fetch('https://pizzeria-l6im.onrender.com/items/portion')
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById('portion-items');
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="pizza-item">
                        <div class="name">${item.name}</div>
                        <div class="prices">
                            <span class="value" style="padding-right: 3%">$${Number(item.value).toFixed(2)}</span>
                        </div>
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

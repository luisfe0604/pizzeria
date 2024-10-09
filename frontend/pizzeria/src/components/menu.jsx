import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, InputLabel, FormControl, Button, Alert } from '@mui/material';
import '../App.css';

const OrderForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [portions, setPortions] = useState([]);
  const [locale, setLocale] = useState('');
  const [client, setClient] = useState('');
  const [observations, setObservations] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [pizzas, setPizzas] = useState([{ type: 'whole', flavor1: '', flavor2: '', size: '', borders: '' }]);
  const [otherItemsDrink, setOtherItemsDrink] = useState([{ item: '', quantity: '' }]);
  const [otherItemsPortion, setOtherItemsPortion] = useState([{ item: '', quantity: '' }]);
  const [otherItems, setOtherItems] = useState([{ item: '', quantity: '' }]);


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('https://pizzeria-l6im.onrender.com/menu');
        setMenuItems(response.data);

        const drinksResponse = await axios.get('https://pizzeria-l6im.onrender.com/items/drink');
        setDrinks(drinksResponse.data);

        const portionsResponse = await axios.get('https://pizzeria-l6im.onrender.com/items/portion');
        setPortions(portionsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar itens do menu:', error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleAddPizza = () => {
    setPizzas([...pizzas, { type: 'whole', flavor1: '', flavor2: '', size: '', borders: '' }]);
  };

  const handleRemovePizza = (indexToRemove) => {
    setPizzas(pizzas.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOtherItemDrink = () => {
    setOtherItems([...otherItems, { item: '', quantity: '' }]);
    setOtherItemsDrink([...otherItems, { item: '', quantity: '' }]);
  };

  const handleRemoveOtherItemDrink = (indexToRemove) => {
    setOtherItems(otherItems.filter((_, index) => index !== indexToRemove));
    setOtherItemsDrink(otherItems.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOtherItemPortion = () => {
    setOtherItems([...otherItems, { item: '', quantity: '' }]);
    setOtherItemsPortion([...otherItems, { item: '', quantity: '' }]);
  };

  const handleRemoveOtherItemPortion = (indexToRemove) => {
    setOtherItems(otherItems.filter((_, index) => index !== indexToRemove));
    setOtherItemsPortion(otherItems.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    for (const pizza of pizzas) {
      const { type, flavor1, flavor2, size } = pizza;

      if (type === 'half') {
        if (!flavor1 || !flavor2) {
          setMessage({ text: 'Por favor, selecione os dois sabores para pizzas meio a meio.', type: 'error' });
          clearMessage();
          return;
        }
      }

      if (type === 'whole' && !flavor1) {
        setMessage({ text: 'Por favor, selecione o sabor da pizza inteira.', type: 'error' });
        clearMessage();
        return;
      }

      if (!size) {
        setMessage({ text: 'Por favor, selecione o tamanho da pizza.', type: 'error' });
        clearMessage();
        return;
      }
    }

    try {
      const orderData = {
        items: pizzas.map((pizza) => {
          const { type, flavor1, flavor2, size } = pizza;
          if (type === 'whole') {
            return `${flavor1}-${size}`;
          } else {
            return `${flavor1}/${flavor2}-${size}`;
          }
        }),
        // otherItems: otherItems.map((other) => {
        //   const { item, quantity } = other;
        //   return `${item} x ${quantity}`;
        // }),
        locale,
        client,
        borders: pizzas.map((pizza) => {
          const { borders } = pizza;
          if (borders) {
            return `${borders}`;
          } else {
            return `S/B`;
          }

        }),
        observations,
      };

      await axios.post('https://pizzeria-l6im.onrender.com/order', {
        ...orderData,
      });
      setMessage({ text: 'Pedido realizado com sucesso!', type: 'success' });
      clearMessage();
    } catch (error) {
      console.error('Erro ao realizar o pedido:', error);
      setMessage({ text: 'Erro ao realizar o pedido.', type: 'error' });
      clearMessage();
    }
  };


  const clearMessage = () => {
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="order-form">
      <h2>Realizar Pedido</h2>

      <div className="input-group">
        <label htmlFor="client">Cliente</label>
        <input
          type="text"
          id="client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="locale">Local</label>
        <input
          type="text"
          id="locale"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="observations">Observações</label>
        <input
          type="text"
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />
      </div>

      <h2>Pizzas</h2>

      {pizzas.map((pizza, index) => (
        <div key={index} className="pizza-selection">
          <div className="pizza-form">
            <div className='input-group-s'>
              <div className="input-group-s">
                <FormControl fullWidth variant="outlined" className='inputFormS'>
                  <Select
                    value={pizza.type}
                    className='addItem'
                    onChange={(e) => {
                      const newPizzas = [...pizzas];
                      newPizzas[index].type = e.target.value;
                      setPizzas(newPizzas);
                    }}
                  >
                    <MenuItem value="whole">I</MenuItem>
                    <MenuItem value="half">M</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="input-group-s">
                <FormControl fullWidth variant="outlined" className='inputFormS'>
                  <Select
                    value={pizza.size}
                    className='addItem'
                    onChange={(e) => {
                      const newPizzas = [...pizzas];
                      newPizzas[index].size = e.target.value;
                      setPizzas(newPizzas);
                    }}
                  >
                    <MenuItem value="P">P</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="G">G</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="input-group-s">
                <FormControl fullWidth variant="outlined" className='inputFormS'>
                  <Select
                    value={pizza.borders}
                    className='addItem'
                    onChange={(e) => {
                      const newPizzas = [...pizzas];
                      newPizzas[index].borders = e.target.value;
                      setPizzas(newPizzas);
                    }}
                  >
                    <MenuItem value="Catupiry">Catupiry</MenuItem>
                    <MenuItem value="Cheddar">Cheddar</MenuItem>
                    <MenuItem value="Choc. P">Choc. P</MenuItem>
                    <MenuItem value="Choc. B">Choc. B</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>


            {pizza.type === 'whole' ? (
              <>
                <div className="input-group-s">
                  <FormControl fullWidth variant="outlined" className='inputForm'>
                    <InputLabel>Sabor</InputLabel>
                    <Select
                      value={pizza.flavor1}
                      className='addItemText'
                      onChange={(e) => {
                        const newPizzas = [...pizzas];
                        newPizzas[index].flavor1 = e.target.value;
                        setPizzas(newPizzas);
                      }}
                    >
                      <MenuItem value="">Selecione o Sabor</MenuItem>
                      {menuItems.map(item => (
                        <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </>
            ) : (
              <>
                <div className="pizza-form">
                  <div className="input-group-s">
                    <FormControl fullWidth variant="outlined" className='inputForm'>
                      <InputLabel>Sabor 1</InputLabel>
                      <Select
                        value={pizza.flavor1}
                        className='addItemText'
                        onChange={(e) => {
                          const newPizzas = [...pizzas];
                          newPizzas[index].flavor1 = e.target.value;
                          setPizzas(newPizzas);
                        }}
                      >
                        <MenuItem value="">Selecione o Sabor 1</MenuItem>
                        {menuItems.map(item => (
                          <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined" className='inputForm'>
                      <InputLabel>Sabor 2</InputLabel>
                      <Select
                        value={pizza.flavor2}
                        className='addItemText'
                        onChange={(e) => {
                          const newPizzas = [...pizzas];
                          newPizzas[index].flavor2 = e.target.value;
                          setPizzas(newPizzas);
                        }}
                      >
                        <MenuItem value="">Selecione o Sabor 2</MenuItem>
                        {menuItems.map(item => (
                          <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </>
            )}

            <Button
              variant="contained"
              color="secondary"
              className='buttonRemove'
              onClick={() => handleRemovePizza(index)}
            >
              -
            </Button>
          </div>
        </div>
      ))}

      <Button variant="contained" onClick={handleAddPizza} className='buttonAdd'>
        Adicionar Pizza
      </Button>

      <h2>Bebidas</h2>
      {otherItemsDrink.map((drink, index) => (
        <div key={index} className="pizza-selection">
          <div className="pizza-form">
            <div className="input-group-s">
              <FormControl fullWidth variant="outlined" className='inputForm'>
                <InputLabel>Bebida</InputLabel>
                <Select
                  value={drink.item}
                  className='inputFormS'
                  onChange={(e) => {
                    const newDrinks = [...otherItemsDrink];
                    newDrinks[index].item = e.target.value;
                    setOtherItemsDrink(newDrinks);
                    setOtherItems(newDrinks);
                  }}
                >
                  <MenuItem value="">Selecione a Bebida</MenuItem>
                  {drinks.map(item => (
                    <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" className='inputFormS'>
                <Select
                  value={drink.quantity}
                  className='addItem'
                  onChange={(e) => {
                    const newDrinks = [...otherItemsDrink];
                    newDrinks[index].quantity = e.target.value;
                    setOtherItemsDrink(newDrinks);
                    setOtherItems(newDrinks);
                  }}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="9">9</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Button
              variant="contained"
              color="secondary"
              className='buttonRemove'
              onClick={() => handleRemoveOtherItemDrink(index)}
            >
              -
            </Button>

          </div>
        </div>
      ))}
      <Button variant="contained" onClick={handleAddOtherItemDrink} className='buttonAdd'>
        Adicionar Bebida
      </Button>
      <h2>Porções</h2>
      {otherItemsPortion.map((portion, index) => (
        <div key={index} className="pizza-selection">
          <div className="pizza-form">
            <div className="input-group-s">
              <FormControl fullWidth variant="outlined" className='inputForm'>
                <InputLabel>Porção</InputLabel>
                <Select
                  value={portion.item}
                  className='inputFormS'
                  onChange={(e) => {
                    const newPortion = [...otherItemsPortion];
                    newPortion[index].item = e.target.value;
                    setOtherItemsPortion(newPortion);
                    setOtherItems(newPortion);
                  }}
                >
                  <MenuItem value="">Selecione a Porção</MenuItem>
                  {portions.map(item => (
                    <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" className='inputFormS'>
                <Select
                  value={otherItems.quantity}
                  className='addItem'
                  onChange={(e) => {
                    const newPortion = [...otherItemsPortion];
                    newPortion[index].quantity = e.target.value;
                    setOtherItemsPortion(newPortion);
                    setOtherItems(newPortion);
                  }}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="9">9</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Button
              variant="contained"
              color="secondary"
              className='buttonRemove'
              onClick={() => handleRemoveOtherItemPortion(index)}
            >
              -
            </Button>
          </div>
        </div>
      ))}
      <Button variant="contained" onClick={handleAddOtherItemPortion} className='buttonAdd'>
        Adicionar Porção
      </Button>
      <Button variant="contained" onClick={handleSubmit}>
        Enviar Pedido
      </Button>

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
    </div>
  );
};

export default OrderForm;

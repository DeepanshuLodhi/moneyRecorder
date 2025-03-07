import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = import.meta.env.VITE_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  async function addNewTransaction(ev) {
    ev.preventDefault();
    const url = import.meta.env.VITE_API_URL + '/transaction';
    const price = name.split(' ')[0];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime
      })
    });

    const json = await response.json();
    setTransactions([...transactions, json]);
    setName('');
    setDatetime('');
    setDescription('');
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>
        ₹{balance}<span>.{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={"+200 new samsung tv"}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={ev => setDatetime(ev.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div key={transaction._id} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}
              </div>
              <div className="datetime">{new Date(transaction.datetime).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
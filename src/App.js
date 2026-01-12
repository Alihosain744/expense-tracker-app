import "./index.css";

const initialData = [
  {
    id: 1,
    description: "groceries",
    amount: 50,
    type: "expense",
    category: "food",
    date: "2026-01-09",
  },
  {
    id: 2,
    description: "money",
    amount: 2000,
    type: "income",
    category: "salary",
    date: "2026-01-10",
  },
  {
    id: 3,
    description: "play football",
    amount: 50,
    type: "expense",
    category: "entertainment",
    date: "2026-01-12",
  },
];
export default function App() {
  return (
    <div className="app">
      <Heading>Expense Tracker App</Heading>
      <Summary />
      <AddExpenseButton>Add Expense➕</AddExpenseButton>
      <AddExpenseForm />
      <TransactionList />
    </div>
  );
}

function Heading({ children }) {
  return <h1>{children}</h1>;
}

function Summary() {
  return (
    <div className="summary">
      <div className="total-balance-container">
        <span className="total-balance">Total balance: 1000$</span>
      </div>
      <div className="total-income-container">
        <span className="total-income">Total income: 1100$ </span>
      </div>
      <div className="total-expense-container">
        <span className="total-expense">Total expense: 100$ </span>
      </div>
    </div>
  );
}

function AddExpenseButton({ children }) {
  return <button className="add-expense-button">{children}</button>;
}

function AddExpenseForm() {
  return (
    <form className="form-add-expense">
      <h2>Add Transaction</h2>
      <div className="desc-container">
        <label>Description</label>
        <input type="text" />
      </div>
      <div className="amount-container">
        <label>Amount</label>
        <input type="number" />
      </div>
      <div className="type-container">
        <label>Type</label>
        <select>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="category-container">
        <label>Category</label>
        <select>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="salary">Salary</option>
        </select>
      </div>
      <div className="date-container">
        <label>Date</label>
        <input type="date" />
      </div>
      <button className="add">Add</button>
    </form>
  );
}

function TransactionList() {
  return (
    <div className="transaction-container">
      <h2>List of All Your Transactions</h2>
      <TransactionFIlter />

      <ul className="transaction-list">
        <div className="title-container">
          <span className="title">Description</span>
          <span className="title">Amount</span>
          <span className="title">Type</span>
          <span className="title">Category</span>
          <span className="title">Date</span>
          <span className="title">Delete</span>
          <span className="title">Edit</span>
        </div>
        {initialData.map((expense) => (
          <TransactionItem expenseObj={expense} />
        ))}
      </ul>
    </div>
  );
}

function TransactionFIlter() {
  return (
    <div className="filter-container">
      <label>Filter by</label>
      <select className="select-filter">
        <option value="all">All</option>
        <option value="food">Food</option>
        <option value="rent">Rent</option>
        <option value="transport">Transport</option>
        <option value="entertainment">Entertainment</option>
        <option value="salary">Salary</option>
      </select>
    </div>
  );
}

function TransactionItem({ expenseObj }) {
  return (
    <li className="transaction-item">
      <div>
        <span className="title">Description</span>
        <p>{expenseObj.description}</p>
      </div>
      <div>
        <span className="title">Amount</span>
        <p>{expenseObj.amount}</p>
      </div>
      <div>
        <span className="title">Type</span>
        <p>{expenseObj.type}</p>
      </div>
      <div>
        <span className="title">Category</span>
        <p>{expenseObj.category}</p>
      </div>
      <div>
        <span className="title">Date</span>
        <p>{expenseObj.date}</p>
      </div>
      <div>
        <span className="title">Edit</span>
        <p>
          <button>❌</button>
        </p>
      </div>
      <div>
        <span className="title">Edit</span>
        <p>
          <button>✏️</button>
        </p>
      </div>
    </li>
  );
}

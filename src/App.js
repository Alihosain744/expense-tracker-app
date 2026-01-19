import { useState } from "react";
import "./index.css";

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const stored = localStorage.getItem("expenses");
    return stored ? JSON.parse(stored) : [];
  });
  const [formOpen, setFormOpen] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteMode, setDeleteMode] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [filterBy, setFilterBy] = useState("all");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");

  let totalExpense = expenses
    .filter((expense) => expense.type === "expense")
    .reduce((prevExpense, curExpense) => prevExpense + curExpense.amount, 0);

  let totalIncome = expenses
    .filter((expense) => expense.type === "income")
    .reduce((prevIncome, curIncome) => curIncome.amount + prevIncome, 0);

  let balance = Math.abs(totalIncome - totalExpense);

  function handleShowAddTransaction() {
    setSelectedId(null);
    setFormOpen((formOpen) => !formOpen);
  }

  function handleAddExpense(newExpense) {
    setExpenses((prevExpenses) => {
      const updatedExpenses = [newExpense, ...prevExpenses];

      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
      return updatedExpenses;
    });

    // setExpenses((expenses) => [...expenses, newExpense]);
  }

  function handleDeleteExpenses(id) {
    setPendingDeleteId(id);
    setDeleteMode("single");
  }

  function confirmDelete() {
    if (deleteMode === "single") {
      const updatedExpenses = expenses.filter(
        (expense) => expense.id !== pendingDeleteId
      );
      setExpenses(updatedExpenses);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    }

    if (deleteMode === "all") {
      setExpenses([]);
      localStorage.removeItem("expenses");
    }

    setDeleteMode(null);
    setPendingDeleteId(null);
  }

  function cancelDelete() {
    setPendingDeleteId(null);
    setDeleteMode(null);
  }

  function handleDeleteAllExpenses() {
    setDeleteMode("all");
  }

  function handleEditExpenses(expenseObj) {
    setFormOpen(true);

    setSelectedId(expenseObj.id);
    // keep values in the form
    setDescription(expenseObj.description);
    setCategory(expenseObj.category);
    setType(expenseObj.type);
    setAmount(expenseObj.amount);
    setDate(expenseObj.date);
  }

  return (
    <>
      <div className="app">
        <Heading>Expense Tracker App</Heading>
        <Summary
          totalExpense={totalExpense}
          totalIncome={totalIncome}
          balance={balance}
        />

        <AddExpenseButton onShowAddTransaction={handleShowAddTransaction}>
          {formOpen ? "Close" : "Add Expense ➕"}
        </AddExpenseButton>

        {formOpen && (
          <AddExpenseForm
            onAddExpense={handleAddExpense}
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            type={type}
            setType={setType}
            category={category}
            setCategory={setCategory}
            date={date}
            setDate={setDate}
            onSwitch={selectedId ? "edit" : "add"}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            expenses={expenses}
            setExpenses={setExpenses}
            setFormOpen={setFormOpen}
          />
        )}

        <TransactionList
          expenses={expenses}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          onDelete={handleDeleteExpenses}
          onEdit={handleEditExpenses}
          selectedId={selectedId}
          onDeleteAll={handleDeleteAllExpenses}
        />
      </div>
      {deleteMode && (
        <Modal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message={
            deleteMode === "all"
              ? "Are you sure you want to delete all expenses?"
              : "Are you sure you want to delete this entry?"
          }
        />
      )}
    </>
  );
}

function Heading({ children }) {
  return <h1>{children}</h1>;
}

function Summary({ totalExpense, totalIncome, balance }) {
  return (
    <>
      <h2 className="summary-heading">Summary of Your Transactions</h2>
      <div className="summary">
        <div className="total-balance-container">
          <span className="total-balance">Your Balance is {balance}$</span>
        </div>
        <div className="total-income-container">
          <span className="total-income">
            Your Total Income is {totalIncome}${" "}
          </span>
        </div>
        <div className="total-expense-container">
          <span className="total-expense">
            Your Total Expense is {totalExpense}${" "}
          </span>
        </div>
      </div>
    </>
  );
}

function AddExpenseButton({ onShowAddTransaction, children }) {
  return (
    <button onClick={onShowAddTransaction} className="add-expense-button">
      {children}
    </button>
  );
}

function AddExpenseForm({
  description,
  setDescription,
  amount,
  setAmount,
  type,
  setType,
  category,
  setCategory,
  date,
  setDate,
  onAddExpense,
  onSwitch,
  selectedId,
  setSelectedId,
  expenses,
  setExpenses,
  setFormOpen,
}) {
  function handleSubmit(e) {
    e.preventDefault();

    if (!description || !amount || !type || !category || !date) return;

    const id = crypto.randomUUID();
    const newExpense = { id, description, amount, type, category, date };

    onAddExpense(newExpense);

    setFormOpen(false);
    resetForm();
  }
  function handleEdit() {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === selectedId
        ? { ...expense, description, amount, type, category, date }
        : expense
    );

    setExpenses(updatedExpenses);

    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    resetForm();

    setFormOpen(false);
    setSelectedId(null);
  }

  function resetForm() {
    setDescription("");
    setAmount(0);
    setType("income");
    setCategory("food");
    setDate("");
  }
  return (
    <form
      className="form-add-expense"
      onSubmit={onSwitch === "add" ? handleSubmit : handleEdit}
    >
      <h2>{onSwitch === "add" ? "Add Transaction" : "Edit Transaction"}</h2>
      <div className="desc-container">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="amount-container">
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <div className="type-container">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="category-container">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="salary">Salary</option>
        </select>
      </div>
      <div className="date-container">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button className="add">{onSwitch === "add" ? "Add" : "Edit"}</button>
    </form>
  );
}

function TransactionList({
  expenses,
  filterBy,
  setFilterBy,
  onDelete,
  onEdit,
  selectedId,
  onDeleteAll,
}) {
  let filteredData;
  if (filterBy === "all") {
    filteredData = expenses;
  }
  if (filterBy === "food") {
    filteredData = expenses
      .slice()
      .filter((expense) => expense.category === "food");
  }
  if (filterBy === "rent") {
    filteredData = expenses
      .slice()
      .filter((expense) => expense.category === "rent");
  }
  if (filterBy === "transport") {
    filteredData = expenses
      .slice()
      .filter((expense) => expense.category === "transport");
  }
  if (filterBy === "entertainment") {
    filteredData = expenses
      .slice()
      .filter((expense) => expense.category === "entertainment");
  }
  if (filterBy === "salary") {
    filteredData = expenses
      .slice()
      .filter((expense) => expense.category === "salary");
  }

  return (
    <div className="transaction-container">
      {expenses?.length <= 0 ? (
        <Message msgInfoColor="lightblue">
          No expenses yet added, click add expense to add your new expense
        </Message>
      ) : (
        <>
          <h2>List of All Your Transactions</h2>

          <TransactionFIlter filterBy={filterBy} setFilterBy={setFilterBy} />
          {filteredData?.length <= 0 ? (
            <Message msgWarnColor="orange">
              No data exist in this category!
            </Message>
          ) : (
            <div className="table-wrapper">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Delete</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.map((expense) => (
                    <TransactionItem
                      expenseObj={expense}
                      key={expense.id}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      selectedId={selectedId}
                    />
                  ))}
                </tbody>
              </table>
              <button onClick={onDeleteAll} id="delete-all">
                Delete All
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TransactionFIlter({ filterBy, setFilterBy }) {
  return (
    <div className="filter-container">
      <label>Filter by</label>
      <select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="select-filter"
      >
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

function TransactionItem({ expenseObj, onDelete, onEdit, selectedId }) {
  const isSelected = expenseObj.id === selectedId;

  return (
    <tr
      className={isSelected ? `transaction-item selected` : "transaction-item"}
    >
      <td>{expenseObj.description}</td>

      <td>{expenseObj.amount}</td>

      <td>{expenseObj.type}</td>

      <td>{expenseObj.category}</td>

      <td>{expenseObj.date}</td>

      <td>
        <button onClick={() => onDelete(expenseObj.id)}>❌</button>
      </td>

      <td>
        <button onClick={() => onEdit(expenseObj)}>✏️</button>
      </td>
    </tr>
  );
}

function Modal({ onConfirm, onCancel, message }) {
  return (
    <div className="modal-container">
      <div className="modal">
        <button onClick={onCancel} className="btn-close-modal">
          X
        </button>
        <div className="modal-content">
          <Message centerModalMessage={{ alignSelf: "center" }}>
            {message}
          </Message>
          <div className="btn-modal-container">
            <button onClick={onConfirm} className="btn-confirm-modal">
              Yes
            </button>
            <button onClick={onCancel} className="btn-cancel-modal">
              No
            </button>
          </div>
        </div>
      </div>
      <div className="modal-overlay"></div>
    </div>
  );
}

function Message({ centerModalMessage, msgInfoColor, msgWarnColor, children }) {
  return (
    <div style={centerModalMessage} className="message-container">
      <p className={`message ${msgInfoColor} ${msgWarnColor}`}>{children}</p>
    </div>
  );
}

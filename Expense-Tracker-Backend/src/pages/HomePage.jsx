import React from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

const HomePage = () => {
  const [reload, setReload] = React.useState(false);

  const refreshList = () => {
    setReload(!reload);
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      <ExpenseForm onAdded={refreshList} />

      <ExpenseList key={reload} />
    </div>
  );
};

export default HomePage;

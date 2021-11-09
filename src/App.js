import React from 'react';
import { useAllDocs } from 'react-pouchdb';
import Header from './components/Header';
import ToDoList from './components/ToDoList';

const App = () => {
  const rows = useAllDocs({
    include_docs: true,
  });

  return (
    <div>
      <Header />
      <ToDoList todosFromDB={rows.map((el) => el.doc)} />
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  List,
  ListItem,
  Switch,
  Tabs,
  Tab,
  TextField,
  MenuItem,
} from '@mui/material';
import '../styles/ToDoList.scss';
import PropTypes from 'prop-types';
import { useDB } from 'react-pouchdb';
import ModalWindow from './ModalWindow';
import utils from '../utils';

const categoryColors = [{
  categoryName: 'Хобби',
  categoryColor: 'orange',
}, {
  categoryName: 'Работа',
  categoryColor: 'red',
}, {
  categoryName: 'Дом',
  categoryColor: 'green',
}];

const sortTypes = ['По умолчанию', 'Сначала выполненные', 'Сначала не выполненные', 'По названию'];

const ToDoList = (props) => {
  const { todosFromDB } = props;
  const [todos, setTodos] = useState(todosFromDB);
  const [sort, setSort] = useState('По умолчанию');
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [editTodo, setEditTodo] = useState({});
  const [filterValue, setFilterValue] = useState('All');

  const db = useDB();

  const handleChange = async (todo) => {
    const newTodos = todos.map((el) => {
      if (el.id === todo.id) {
        return {
          ...el,
          status: el.status === 'Выполнено' ? 'Не выполнено' : 'Выполнено',
        };
      }
      return el;
    });
    const todoFromDB = await db.get(todo.id);
    todoFromDB.status = todoFromDB.status === 'Выполнено'
      ? 'Не выполнено'
      : 'Выполнено';
    await db.put(todoFromDB);
    setTodos(newTodos);
  };

  const changeFilterValue = (event, newValue) => {
    setFilterValue(newValue);
    const newTodos = todos.map((el) => utils.checkShow(el, searchValue, newValue));
    setTodos(newTodos);
  };

  const changeTodoInfo = (todo) => {
    setAddMode(false);
    setOpen(true);
    setEditTodo(todo);
  };

  const addTodo = () => {
    setOpen(true);
    setAddMode(true);
  };

  const deleteTodo = async (deletedTodo) => {
    const newTodos = todos.filter((todo) => todo.id !== deletedTodo.id);
    await db.remove(deletedTodo);
    setTodos(newTodos);
  };

  const changeSearch = (value) => {
    setSearchValue(value);
    const newTodos = todos.map((el) => utils.checkShow(el, value, filterValue));
    setTodos(newTodos);
  };

  const sortTodos = (event) => {
    setSort(event.target.value);
    const successTodos = todos.filter((todo) => todo.status === 'Выполнено');
    const unSuccessTodos = todos.filter((todo) => todo.status === 'Не выполнено');
    const byField = (field) => (a, b) => (a[field] > b[field] ? 1 : -1);
    switch (event.target.value) {
      case 'Сначала выполненные':
        setTodos([...successTodos, ...unSuccessTodos]);
        break;

      case 'Сначала не выполненные':
        setTodos([...unSuccessTodos, ...successTodos]);
        break;

      case 'По названию':
        setTodos(todos.sort(byField('name')));
        break;

      default: break;
    }
  };

  return (
    <List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => addTodo()}
        sx={{ position: 'absolute', top: '-63px', right: '15px' }}
      >
        Добавить
      </Button>
      <TextField
        label="Поиск"
        value={searchValue}
        onChange={(e) => changeSearch(e.target.value)}
        sx={{ position: 'absolute', top: '-70px', right: '155px' }}
      />
      <Box sx={{
        padding: '0 15px', display: 'flex', justifyContent: 'space-between',
      }}
      >
        <Tabs
          aria-label="basic tabs example"
          textColor="secondary"
          indicatorColor="secondary"
          value={filterValue}
          onChange={changeFilterValue}
        >
          <Tab label="Все" value="All" />
          <Tab label="Выполненные" value="Done" />
          <Tab label="Не выполненные" value="Not Done" />
          <Tab label="Хобби" value="Hobby" />
          <Tab label="Дом" value="Home" />
          <Tab label="Работа" value="Work" />
        </Tabs>
        <TextField
          select
          value={sort}
          onChange={sortTodos}
        >
          {sortTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      { todos.map((todo) => (
        todo.show
        && (
        <ListItem key={todo.id}>
          <Card
            variant="outlined"
            className="card"
            sx={todo.status === 'Выполнено'
              ? { backgroundColor: '#c9ffd6' }
              : { backgroundColor: '#facaca' }}
          >
            <div className="card_info">
              <div className="card_title">
                <span className={`card_indicator_${categoryColors
                  .find((el) => el.categoryName === todo.category).categoryColor} card_indicator`}
                />
                <div className="card_name">
                  {todo.name}
                </div>
                <Switch onChange={() => handleChange(todo)} checked={todo.status === 'Выполнено'} sx={{ marginLeft: '20px' }} />
              </div>
              <div className="card_desc">
                {todo.description}
              </div>
            </div>
            <div className="card_buttons">
              <Button
                variant="contained"
                onClick={() => changeTodoInfo(todo)}
                sx={{ fontSize: '12px' }}
              >
                Редактировать
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ marginTop: '10px', fontSize: '12px' }}
                onClick={() => deleteTodo(todo)}
              >
                Удалить
              </Button>
            </div>
          </Card>
        </ListItem>
        )
      ))}
      <ModalWindow
        open={open}
        setOpen={setOpen}
        todoInfo={editTodo}
        todos={todos}
        setTodos={setTodos}
        addMode={addMode}
        setAddMode={setAddMode}
        searchValue={searchValue}
        filterValue={filterValue}
      />
    </List>
  );
};

ToDoList.propTypes = {
  todosFromDB: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
  })),
};

ToDoList.defaultProps = {
  todosFromDB: [],
};

export default ToDoList;

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/ModalChangeTodoInfo.scss';
import { useDB } from 'react-pouchdb';
import utils from '../utils';

const ModalWindow = (props) => {
  const {
    open,
    setOpen,
    todoInfo,
    todos,
    setTodos,
    addMode,
    searchValue,
    filterValue,
  } = props;

  const db = useDB();

  const [newTodoInfo, setNewTodoInfo] = useState({});

  const categories = ['Хобби', 'Работа', 'Дом'];

  const changeName = (name) => {
    setNewTodoInfo({ ...newTodoInfo, name });
  };

  const changeDesc = (desc) => {
    setNewTodoInfo({ ...newTodoInfo, description: desc });
  };

  const changeCategory = (category) => {
    setNewTodoInfo({ ...newTodoInfo, category });
  };

  const editTodo = async () => {
    try {
      if (newTodoInfo.name === '' || newTodoInfo.description === '') {
        return;
      }
      const newTodos = todos.map((todo) => {
        if (todo.id === todoInfo.id) {
          return {
            id: todoInfo.id,
            name: newTodoInfo.name || todoInfo.name,
            description: newTodoInfo.description || todoInfo.description,
            category: newTodoInfo.category || todoInfo.category,
            status: todoInfo.status,
            show: utils.checkShow(todo, searchValue, filterValue),
          };
        }
        return todo;
      });
      const todoFromDB = await db.get(todoInfo.id);
      todoFromDB.name = newTodoInfo.name || todoInfo.name;
      todoFromDB.description = newTodoInfo.description || todoInfo.description;
      todoFromDB.category = newTodoInfo.category || todoInfo.category;
      todoFromDB.show = true;
      db.put(todoFromDB);
      setTodos(newTodos);
      setOpen(false);
      setNewTodoInfo({});
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = () => {
    try {
      if (newTodoInfo.name === ''
        || newTodoInfo.description === ''
        || !newTodoInfo.name
        || !newTodoInfo.description
      ) {
        setNewTodoInfo({
          name: newTodoInfo.name || '',
          description: newTodoInfo.description || '',
        });
        return;
      }
      const uuid = uuidv4();
      const newTodo = {
        _id: uuid,
        id: uuid,
        name: newTodoInfo.name,
        description: newTodoInfo.description,
        category: newTodoInfo.category || 'Хобби',
        status: 'Не выполнено',
      };

      db.put({ ...newTodo, show: true });
      setTodos(
        [...todos, { ...newTodo, show: utils.checkShow(newTodo, searchValue, filterValue) }],
      );
      setNewTodoInfo({});
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewTodoInfo({});
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      open={open}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box className="modal_box">
          <IconButton
            component="span"
            size="small"
            classes={{ root: 'modal_close_button' }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" mb="20px">
            { addMode ? 'Добавить TODO' : 'Редактировать TODO'}
          </Typography>
          <TextField
            required
            error={newTodoInfo.name === ''}
            label="Название"
            defaultValue={addMode ? '' : todoInfo.name}
            onChange={(e) => changeName(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            label="Описание"
            required
            error={newTodoInfo.description === ''}
            defaultValue={addMode ? '' : todoInfo.description}
            onChange={(e) => changeDesc(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <FormControl>
            <InputLabel id="modal_label_category">Категория</InputLabel>
            <Select
              labelId="modal_label_category"
              label="Категория"
              defaultValue={addMode ? 'Хобби' : todoInfo.category}
              sx={{ marginBottom: '20px' }}
              onChange={(e) => changeCategory(e.target.value)}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={() => (addMode ? addTodo() : editTodo())}
            variant="outlined"
            sx={{ fontSize: '12px', width: '150px', alignSelf: 'flex-end' }}
          >
            {addMode
              ? 'Добавить'
              : 'Редактировать'}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

ModalWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
  })),
  setOpen: PropTypes.func.isRequired,
  setTodos: PropTypes.func.isRequired,
  todoInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
  }),
  addMode: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  filterValue: PropTypes.string.isRequired,
};

ModalWindow.defaultProps = {
  todoInfo: {},
  todos: [],
};

export default ModalWindow;

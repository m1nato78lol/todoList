const checkShow = (todo, searchValue, filterValue) => {
  switch (filterValue) {
    case 'All':
      return {
        ...todo,
        show: todo.name.includes(searchValue),
      };
    case 'Done':
      return {
        ...todo,
        show: todo.status === 'Выполнено' && todo.name.includes(searchValue),
      };
    case 'Not Done':
      return {
        ...todo,
        show: todo.status === 'Не выполнено' && todo.name.includes(searchValue),
      };
    case 'Hobby':
      return {
        ...todo,
        show: todo.category === 'Хобби' && todo.name.includes(searchValue),
      };
    case 'Home':
      return {
        ...todo,
        show: todo.category === 'Дом' && todo.name.includes(searchValue),
      };
    case 'Work':
      return {
        ...todo,
        show: todo.category === 'Работа' && todo.name.includes(searchValue),
      };
    default:
      return {
        ...todo,
        show: true,
      };
  }
};

export default {
  checkShow,
};

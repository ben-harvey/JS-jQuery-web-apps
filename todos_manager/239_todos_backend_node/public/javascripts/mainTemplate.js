






 const todoList = (function (){
    allTodos =  [];


    return {
    add: function(todo) {
      allTodos.push(todo);
    },

    allTodos: function () {
      return allTodos;
    },

    setAllTodos: function (newTodos) {
      allTodos = newTodos
    },

    getUniqueDates: function(todos) {
      return todos.map(todo => todo.due_date)
        .filter((date, index, array) => {
          return array.indexOf(date) === index;
        });
    },

    todosByDate: function(todos) {
      const result = {};
      const sortedTodos = this.sortTodos(todos);
      const uniqueDates = this.getUniqueDates(sortedTodos);

      uniqueDates.forEach(date => {
        result[date] = todos.filter(todo => todo.due_date === date);
      });

      return result;
    },

    byDate: function(a, b) {
      dateFromString = (string) => {
        const formattedString = string.replace('/', '/1/')
          .replace(/^0/, '');
        return new Date(formattedString);
      };

      if (b === 'No Due Date') { return 1 };
      return dateFromString(a) - dateFromString(b);
    },

    done: function(todos) {
      return todos.filter(todo => todo.completed === true);
    },

    doneTodosByDate: function(todos) {
      return this.todosByDate(this.done(todos))
    },

    sortTodos: function(todos) {
      const noDueDate = todos.filter(todo => todo.due_date === 'No due date');
      const dueDate = todos.filter(todo => todo.due_date !== 'No due date');

      dueDate.sort((a, b) => this.byDate(a.due_date, b.due_date));
      return [...noDueDate, ...dueDate];
    },

    formatSelectedTodos: function(todos) {
      const completed = todos.filter(todo => todo.completed);
      const uncompleted = todos.filter(todo => !todo.completed);
      const sortedTodos = [...this.sortTodos(uncompleted), ...this.sortTodos(completed)]

      return sortedTodos.map(todo => {
        return {
          id: todo.id,
          completed: todo.completed,
          title: todo.title,
          due_date: todo.due_date,
        };
      });
    },

    delete: function(id) {
      allTodos = allTodos.filter(todo => todo.id !== id);
    },

    getById: function(id) {
      const todo = allTodos.filter(todo => todo.id === id)[0];
      const copy = {};
      Object.assign(copy, todo);
      delete copy.due_date;

      return copy;
    },

    update: function(todo) {
      allTodos = allTodos.filter(existingTodo => {
        return existingTodo.id !== todo.id;
      });

      this.add(todo);
    },
  }
})();

console.log(todoList);

todoList.add('foo')
console.log(todoList.allTodos())
todoList.setAllTodos(['bar']);
console.log(todoList.allTodos())


  // const mainHtml = main_template(
  //   { // this is all of the todos:  /api/todos
  //     todos: [
  //       {},
  //       {},
  //       {}
  //     ],


  //       /*
  //       input:  an array of todo objects›

  //       output:  an object where:
  //          key: if month and year:
  //                 formatted date of 'month/last 2 digits of year'
  //               else:
  //                 'No due date'
  //          value: a todo object
  //       algorithm:
  //         create result array
  //         for each todo obj in input
  //           set key
  //             if month and year:
  //                 formatted date of 'month/last 2 digits of year'
  //                   todo.month + (slice last 2 from todo.year)
  //               else:
  //                 'No due date'
  //           set value = todo
  //       */


  //     todos_by_date: {
  //       'No Due Date': [1, 2],
  //       '1/19': [1, 2, 3],
  //       '2/19': [1]
  //     },

  //     /*
  //     input: an array of uncompleted todo objects
  //     output: a filtered array of uncompleted todo objects
  //     rules: filter out uncompleted todo objects

  //     algorithm: filter based on todo.completed
  //     */

  //     done: [1, 2, 3, 4],

  //     /*
  //     input: an array of completed todo objects
  //     output: an object

  //     algorithm: call todos_by_date on input array

  //     */

  //     done_todos_by_date: {
  //       '3/18': [1, 2, 3],
  //       '4/18': [1],
  //     },

  //     /*
  //     input: info from a clicked el in the sidebar:
  //        sidebar dl and sidebar header:
  //         title: data-title of element
  //         data:  data-total of element

  //     output: an object where:
  //       title: string
  //       data: string

  //     algorithm: set click listeners on
  //       -sidebar header
  //       -sidebar dl

  //     on click, generate object

  //     */

  //     current_section: {
  //       title: 'All Todos',
  //       data: '2', // equals length of current section
  //     },

  //     /*
  //     input: info from a clicked el in the sidebar:
  //        All Todos header
  //        uncompleted todos dl
  //        Completed header
  //        completed dl

  //     output: an array of objects where:
  //       id: number
  //       completed: boolean
  //       title: string,
  //       due_date: string of format 'month/last 2 of year'

  //     rules:
  //       for click on All Todos, call todos
  //         closest header id='all_header'
  //       for clicks on Completed, call done
  //         closest header id='all_done_header'

  //       for array of todos [{}, {}, {}]
  //         set result object
  //         map over input
  //           for each object
  //             set result object
  //             set id, completed, title
  //             format due date
  //             set due date
  //             return result object

  //       for clicks on unfinished todos, call todos_by_date
  //         closest article id = 'all_lists'
  //       for clicks on finished todos, call done_todos_by_date
  //         closest article id = 'completed_lists'

  //     algorithm: "value",
  //       for by_date object
  //         {
  //         '3/18': [1, 2, 3],
  //         '4/18': [1],
  //         }

  //         select array by key based on data-title of clicked dl
  //           eg data-title="01/19" ==> [1, 2, 3]
  //         proceed as for above
  //     */


  //     selected: [
  //       {
  //         id: 4,
  //         completed: true,
  //         title: 'mow lawn',
  //         due_date: '11/14',
  //       },

  //       {
  //         id: 5,
  //         completed: false,
  //         title: 'fertilize lawn',
  //         due_date: '1/15',
  //       },

  //       {
  //         id: 6,
  //         completed: false,
  //         title: 'kill lawn',
  //         due_date: 'No due date',
  //       },
  //     ],
  //   }
  // );

  // $('body').html(mainHtml)
$(function() {
  const main_template = Handlebars.compile($('#main_template').html());
  Handlebars.registerPartial({
    'all_todos_template': $('#all_todos_template').html(),
    'list_template': $('#list_template').html(),
    'item_partial': $('#item_partial').html(),
    'completed_todos_template': $('#completed_todos_template').html(),
    'all_list_template': $('#all_list_template').html(),
    'completed_list_template': $('#completed_list_template').html(),
    'title_template': $('#title_template').html(),
  });

  const todoList = {
    allTodos: [],

    add: function(todo) {
      this.allTodos.push(todo);
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

      dueDate.sort((a, b) => this.byDate(a.due_date, b.due_date)); // use of arrow function's enclosing scope
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
      this.allTodos = this.allTodos.filter(todo => todo.id !== id);
    },

    getById: function(id) {
      const todo = this.allTodos.filter(todo => todo.id === id)[0];
      const copy = {};
      Object.assign(copy, todo);
      delete copy.due_date;

      return copy;
    },

    update: function(todo) {
      this.allTodos = this.allTodos.filter(existingTodo => {
        return existingTodo.id !== todo.id;
      });

      this.add(todo);
    },
  };

  // ----- ----- ----- ----- ----- -----

  const ui = {
    renderInitialPage: function(todos) {
      const context = App.generateInitialContext(todos);
      const mainHtml = main_template(context);

      $('body').html(mainHtml);
      App.setActiveElement($('#all_header'));
    },

    refreshPage: function() {
      let $target = $('.active');
      const title = $target.data().title;
      const id = $target.closest('section').prop('id');

      const context = App.generateRefreshContext();
      const mainHtml = main_template(context);

      $('body').html(mainHtml);

      $target = $(`#${id} [data-title="${title}"]`)
      App.setActiveElement($target);
    },

    showModal: function() {
      $('.modal').show();
    },

    hideModal: function() {
      const $form = $('form');

      $('.modal').hide();
      $form.find('select').each(function() { this.selectedIndex = 0 });
      $form.find(':input').not('#nofilter').val('');
    },

    alertInvalidForm: function() {
      alert('You must enter a Title of at least 3 characters');
    },

    alertInvalidComplete: function() {
      alert('You must save this todo before it can be marked as complete');
    },
  };

  // ----- ----- ----- ----- ----- -----

  const api = {
    logErrorString: function(r) {
      console.log(`${r.status} ${r.statusText}: ${r.responseText}`);
    },

    getAllTodos: function() {
      return new Promise(resolve => {
        $.getJSON('/api/todos', data => resolve(data));
      });
    },

    updateTodo: function(id, data) {
      return new Promise(resolve => {
        $.ajax({
          url: `/api/todos/${id}`,
          method: "PUT",
          data: data,
          success: responseData => resolve(responseData),
          error: response => this.logErrorString(response),
        });
      });
    },

    addTodo: function(data) {
      return new Promise(resolve => {
        const xhr = $.post('/api/todos', data, data => resolve(data))
          .fail(response => this.logErrorString(response));
      });
    },

    deleteTodo: function(id) {
      $.ajax({
        url: `/api/todos/${id}`,
        method: "DELETE",
        error: response => this.logErrorString(response),
      });
    },
  };

  // ----- ----- ----- ----- ----- -----

  const todo = {
    setDueDate: function(todoObj) {
      const { month, year } = todoObj;
      let dateString = "No due date";

      if (!!month && !!year) {
        dateString = this.generateDateString(month, year);
      };

      todoObj['due_date'] = dateString;
    },

    generateDateString: function(month, year) {
      return `${month}/${year.slice(-2)}`
    },
  };

  // ----- ----- ----- ----- ----- -----

  const App = {
    newTodo: false,

    targetId: null,

    serializeFormData: function($form) {
      const values = $form.serializeArray();
      const data = {};

      values.forEach(value => data[value.name] = value.value);
      return data;
    },

    handleSubmit: function(e) {
      e.preventDefault();
      const form = e.target;
      const $form = $(form);

      if (!form.checkValidity()) {
        ui.alertInvalidForm();
        return;
      };

      const data = this.serializeFormData($form);

      if (this.newTodo) {
        this.addTodo(data);
      } else {
        this.updateTodo(this.targetId, data);
      };

      ui.hideModal();
      this.newTodo = false;
    },

    addTodo: function(data) {
      const addTodo = api.addTodo(data);

      addTodo.then(todoObj => {
        todo.setDueDate(todoObj);
        todoList.add(todoObj);

        this.setActiveElement($('#all_header'));
        ui.refreshPage();
      });
    },

    updateTodo: function(id, data) {
      const updateTodo = api.updateTodo(id, data);
      this.targetId = null;

      updateTodo.then(todoObj => {
        todo.setDueDate(todoObj);
        todoList.update(todoObj);

        ui.refreshPage();
      });
    },

    handleSidebarClick: function(e) {
      let $target = $(e.target).closest('[data-title]');

      this.setActiveElement($target);
      ui.refreshPage();
    },

    setActiveElement: function($target) {
      $('.active').removeClass('active');
      $target.addClass('active');
    },

    handleCompleteButton: function(e) {
      e.preventDefault();
      const $form = $(e.target).closest('form')

      if (this.newTodo) {
        ui.alertInvalidComplete();
        this.newTodo = false;
        return;
      };

      const todo = todoList.getById(this.targetId);

      todo.completed = true;

      this.updateTodo(this.targetId, todo);
      ui.hideModal();
    },

    handleCompleteClick: function(e) {
      e.preventDefault();
      const id = $(e.target).closest('tr').data().id;
      const todo = todoList.getById(id);

      todo.completed = !todo.completed;
      this.updateTodo(id, todo);
      ui.hideModal();
    },

    handleNewModal: function(e) {
      this.newTodo = true;
      ui.showModal();
    },

    handleExistingModal: function(e) {
      e.preventDefault();
      e.stopPropagation();

      const id = $(e.target).closest('tr').data().id;
      const todo = todoList.getById(id);
      this.targetId = id;

      this.populateModal(todo);
      ui.showModal();
    },

    populateModal: function(todo) {
      $('form :input').each(function(index) {
        if (index < 5) {
          $(this).val(todo[this.id])
        };
      });
    },

    hideModal: function() {
      this.targetId = null;
      ui.hideModal();
    },

    getSelectedTodos: function() {
      const $active = $('.active')
      const title = $active.data().title;
      const id = $active.closest('section').prop('id');
      const todos = todoList.allTodos;
      const selectedTodos = this.parseIdAndTitle(id, title, todos);

      return {
        todos: selectedTodos,
        title: title,
        data: selectedTodos.length,
      };
    },

    parseIdAndTitle: function(id, title, todos) {
      if (id === 'all') {
        if (title === 'All Todos') {
          return todos;
        } else {
          return todoList.todosByDate(todos)[title] || [];
        };
      };

      if (id === 'completed_items') {
        if (title === 'Completed') {
          return todoList.done(todos);
        } else {
          return todoList.doneTodosByDate(todos)[title] || [];
        };
      };
    },

    generateContext: function(todos) {
      return {
        todos,
        todos_by_date: todoList.todosByDate(todos),
        done: todoList.done(todos),
        done_todos_by_date: todoList.doneTodosByDate(todos),
      };
    },

    generateInitialContext: function(todos) {
      const context = this.generateContext(todos);

      context.selected = todoList.formatSelectedTodos(todos);
      context.current_section = {
        title: 'All Todos',
        data: todos.length,
      };

      return context;
    },

    generateRefreshContext: function() {
      const todos = todoList.allTodos;
      const selectedTodos = this.getSelectedTodos();
      const context = this.generateContext(todos);

      context.selected = todoList.formatSelectedTodos(selectedTodos.todos);
      context.current_section = {
        title: selectedTodos.title,
        data: selectedTodos.data,
      };

      return context;
    },

    initializeTodos: function() {
      const allTodos = api.getAllTodos();

      allTodos.then((todos) => {
        todos.forEach(todoObj => todo.setDueDate(todoObj));
        todoList.allTodos = todos;
        ui.renderInitialPage(todos);
      });
    },

    handleDelete: function(e) {
      const id = $(e.target).closest('tr').data().id;

      api.deleteTodo(id);
      todoList.delete(id);
      ui.refreshPage();
    },

    bind: function() {
      const selector = 'section header, #all_lists dl, #completed_lists dl';
      const that = this;

      // $('body').on('click', '#new_item', this.handleNewModal.bind(this));
      $('body').on('click', '#new_item', () => this.handleNewModal());
      $('body').on('click', '#modal_layer', this.hideModal.bind(this));
      $('body').on('submit', 'form', this.handleSubmit.bind(this));
      $('body').on('click', '.delete', this.handleDelete.bind(this));
      $('body').on('click', 'td label', this.handleExistingModal.bind(this));
      $('body').on('click', '#complete', this.handleCompleteButton.bind(this));
      $('body').on('click', '.list_item', this.handleCompleteClick.bind(this));
      $('body').on('click', selector, this.handleSidebarClick.bind(this));

      // document.body.addEventListener('click', callback)
      //   callback(e){
      //     e.target
      //   }

      $('body').on('click', selector, this.handleSidebarClick.bind(this));
    },

    init: function() {
      this.bind();
      this.initializeTodos();
    }
  };

  App.init();
});
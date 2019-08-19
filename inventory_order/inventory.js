/*



*/

var inventory;

(function() {
  inventory = {
    lastID: 0,

    collection: [],

    getTemplate: function () {
      const $template = $('#inventory_item').remove();
      this.itemTemplate = Handlebars.compile($template.html());
    },

    add: function (event) {
      console.log(this);
      const newItem = {
        id: this.lastID,
        name: '',
        stockNumber: '',
        quantity: "1",
      };

      this.collection.push(newItem);
      this.insertRow(this.lastID)
      this.lastID += 1;
    },

    insertRow: function (id) {
      $('#inventory').append(this.itemTemplate({ itemID: id }));
    },

    nameAndId: function (nameValue) {
      const [name, id] = nameValue.split(/([0-9]+)/).slice(0, 2);
      return [name, +id];
    },

    bindEvents: function () {
      $('#add_item').on('click', this.add.bind(this));
      $('#inventory').on('click', 'a.delete', this.delete.bind(this));
      $('#inventory').on('blur', 'input', this.update.bind(this));
    },

    update: function (event) {
      const target = event.target;
      const [key, id] = this.nameAndId(target.name);
      const item = this.fetchItem(id);
      item[key] = $(target).val();
    },

    fetchItem: function (id) {
      return this.collection.filter(item => item.id === id)[0];
    },

    delete: function (event) {
      event.preventDefault();
      event.target.closest('tr').remove();
    },

    setDate: function() {
      const dateText = new Date().toUTCString();
      $('#order_date').text(dateText);
    },

    init: function() {
      this.setDate();
      this.getTemplate();
      this.bindEvents();
    }
  };

})();

$(inventory.init.bind(inventory));
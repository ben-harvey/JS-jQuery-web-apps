$(function() {
  const contactTemplate = Handlebars.compile($('#contact_handlebar').html());
  const updateTemplate = Handlebars.compile($('#update_handlebar').html());
  const tagTemplate = Handlebars.compile($('#tag_handlebar').html());


  const validation = {
    clearMessage: function(e) {
      const input = e.target;
      const $input = $(input);

      $input.next().text('');
    },

    clearAllMessages: function ($form) {
      $inputs = $form.find('input')

      $form.find('span.error_message').text('');
      $inputs.removeClass('invalid_field');
      $inputs.get(0).focus();
      debugger;
    },

    labelText: function(name) {
      return $(`label[for="${name}"]`).text();
    },

    validateInput: function(e) {
      const input = e.target;
      const $input = $(input);
      const name = input.name;

      if (input.checkValidity()) {
        $input.removeClass('invalid_field');
        $input.addClass('valid_field');
      } else {
        $input.addClass('invalid_field');
        this.showError(input);
      };

    },

    showError: function(input) {
      const $input = $(input);
      const name = input.name;

      if (input.validity.valueMissing) {
        $input.next().text(`${this.labelText(name)} is a required field`);
      };

      if (input.validity.patternMismatch) {
        $input.next().text(`Please enter a valid ${this.labelText(name)}`);
      }

      if (input.validity.tooShort) {
        $input.next().text(`Passwords must be at least 10 characters long`);
      };

    },

    handleSubmit: function(form) {
      if (form.checkValidity()) {
        $('.form_errors').text('');
      } else {
        $('.form_errors').text('Please correct all errors before submitting')
      };
    },

    bind: function() {
      this.$inputs = $('input');
      this.$inputs.on('blur', this.validateInput.bind(this));
      this.$inputs.on('focus', this.clearMessage.bind(this));
    },
  };

  // ------------------------------------------


  const api = {
    getAllContacts: function() {
      return new Promise(function(resolve, reject) {
        const xhr = $.getJSON('/api/contacts', function(data) {
          resolve(data);
        })
      })
    },

    updateContact: function(path, data) {
      const xhr = $.ajax({
        url: path,
        method: "PUT",
        data: data,
        success: function(response, statusText) {
        },
      });
    },

    getContact: function(id) {
      return new Promise(function(resolve, reject) {
        const xhr = $.getJSON(`/api/contacts/${id}`, function(data) {
          resolve(data);
        });
      });
    },

    addContact: function(data) {
      const xhr = $.post('/api/contacts', data, function(response) {})
    },

    deleteContact: function(id) {
      const xhr = $.ajax({
        url: `/api/contacts/${id}`,
        method: "DELETE",
        success: function(response) {},
      });
    },
  }


  // ------------------------------------------

  const ui = {
    showAddForm: function(e) {
      $('#add_contact_form').slideDown();
      $('#add_contact_button').hide();
    },

    hideAddForm: function(e) {
      e.preventDefault();
      const $form = $(e.target).closest('form');

      this.clearFormFields($form);
      validation.clearAllMessages($form);

      $('#add_contact_form').slideUp();
      $('#add_contact_button').show();
    },

    hideUpdateForm: function(e) {
      e.preventDefault();
      $form = $(e.target).closest("#update_contact_form");

      $form.prevAll().show()
      $form.remove();
    },

    clearFormFields: function($form) {
      [...$form.find('input')].forEach(input => $(input).val(''));
    },

    serializeForm: function($form) {
      const values = $form.serializeArray();
      const data = {};

      values.forEach(value => data[value.name] = value.value);

      return data;
    },

    renderAllContacts: function() {
      const contactsData = api.getAllContacts();

      contactsData.then((data) => {
        $('#all').nextAll().remove(); // refactor to renderTags
        const uniqueTags = app.getUniqueTags(data);
        const tags = tagTemplate({tags: uniqueTags});
        $(tags).insertAfter('#all');

        this.convertTagsToArray(data);
        const contacts = contactTemplate({ contacts: data });
        $('#contacts').html(contacts);

      });
    },

    convertTagsToArray: function (contacts) {
      contacts.forEach(contact => {
        if (!contact.tags) {
          contact.tags = null;
        }
        else {
          contact.tags = contact.tags.split(',');
        }
      });
    },

    showMessage: function(message) {
      const $message = $('#message');
      $message.text(message);
      $message.slideDown();
      setTimeout(() => $message.slideUp(), 3000);
    },

    submitUpdateForm: function(e) {
      e.preventDefault();

      const $target = $(e.target);
      const path = $target.attr('action');
      const $form = $target.closest('form');
      const form = $form.get()[0];

      validation.handleSubmit(form);

      debugger;
      if (form.checkValidity()) {
        const data = this.serializeForm($form);

        api.updateContact(path, data);
        this.resetUpdateForm(e);
      };
    },

    resetUpdateForm: function (e) {
      this.showMessage('Contact updated');
      this.hideUpdateForm(e);

      this.renderAllContacts();
    },

    resetAddForm: function (e, $form) {
      this.showMessage('Contact added');
      this.hideAddForm(e);
      this.clearFormFields($form);

      this.renderAllContacts();
    },

    submitAddForm: function(e) {
      e.preventDefault();

      const form = e.target;
      const $form = $(form);

      validation.handleSubmit(form);

      if (form.checkValidity()) {
        const data = this.serializeForm($form);

        api.addContact(data);
        this.resetAddForm(e, $form);
      };
    },

    deleteContact: function(event) {
      const $contact = $(event.target).closest('.contact');
      const id = $contact.data().id;
      const message = 'Are you sure you want to delete this contact?';

      if (window.confirm(message)) {
        api.deleteContact(id);

        this.showMessage('Contact deleted');
        this.renderAllContacts();
      }
    },

    showUpdateForm: function(event) {
      const $contact = $(event.target).closest('.contact');
      const id = $contact.data().id;

      const contactData = api.getContact(id);

      contactData.then(function(data) {
        const updateForm = updateTemplate(data);
        $contact.append($(updateForm)).hide().slideDown();

        validation.bind();
        $contactInfo = $contact.find("#update_contact_form").prevAll();

        $contactInfo.hide();
      });
    },

    filterContactsBySearch: function (e) {
      e.preventDefault();
      const $contacts = $('.contact');
      const searchString = $(e.target).find('input').val().toLowerCase();

      const $matchingContacts = $contacts.filter(function (index) {
        const contactName = $(this).find('.contact_full_name').text().toLowerCase();
        return (contactName.indexOf(searchString) !== -1);
      });

      $contacts.hide();
      $matchingContacts.show();
    },

    filterContactsByTag: function (e) {
      e.preventDefault();
      const $contacts = $('.contact');
      const $tags = $('.tag');
      const $target = $(e.target);
      const text = $target.text();
      const tagString = text === 'All' ? '' : text;
      const search = $('[type="search"')

      search.val('');

      const $matchingContacts = $contacts.filter(function (index) {
        const contactTags = $(this).find('.tag').text().toLowerCase();
        return (contactTags.indexOf(tagString) !== -1);
      });

      $contacts.hide();
      $matchingContacts.show();

      $tags.removeClass('active_tag');
      $target.addClass('active_tag');
    },


    bind: function() {
      $('#add_contact_button').on('click', this.showAddForm.bind(this));
      $('#add_contact_form').on('click', '#cancel_button', this.hideAddForm.bind(this));
      $('#contacts').on('click', '#update_button', this.submitUpdateForm.bind(this));
      $('#contacts').on('click', '#cancel_update_button', this.hideUpdateForm.bind(this));
      $('#add_contact_form').on('submit', this.submitAddForm.bind(this));
      $('#contacts').on('click', '.delete_button', this.deleteContact.bind(this));
      $('#contacts').on('click', '.update_button', this.showUpdateForm.bind(this));
      $('#search').on('submit', this.filterContactsBySearch.bind(this));
      $('#tags_container').on('click', '.tag', this.filterContactsByTag.bind(this));
    },
  }

  // _________________________________________________


  const app = {
    getUniqueTags: function (contacts) {
      return contacts.reduce((uniqueTags, contact) => {
        if(!contact.tags) { return uniqueTags }
          const currentTags = contact.tags.split(',');

          currentTags.forEach(tag => {
            if (!uniqueTags.includes(tag)) {uniqueTags.push(tag)}
          });

        return uniqueTags;
      }, []);
    },

    bind: function() {
      ui.bind();
      validation.bind();
    },

    init: function() {
      this.bind();
      ui.renderAllContacts();
    },
  };




  app.init();
});
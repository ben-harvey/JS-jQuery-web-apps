# Add contact
on click
  show form

  Create Contact:

    Full name

    Email

    Telephone number

    Tags: select list of all current tags
    input for new tags

  Submit button:  submit contact
  Cancel button:  hide form

on submit:

  Handlebars template for contact

  Name
  Phone Number
  Email

  Tags:
    for each tag, a link  *** process tags into an array of strings or null ****

  Edit button:  edit contact
  Delete button: delete form

# Edit contact :

on click
  show form:

  Edit Contact:

    Full name: prefilled

    Email: prefilled

    Telephone number: prefilled

    Tags:
    Add tags: same as input form
    Remove Tag: link to remove tag

  Submit button:  update contact
  Cancel button:  hide form


# Delete contact

on click
  alert confirmation before deleting

# Search filtering

on keydown
  filter visible contacts by input value
  if no match, display 'No contacts'

# Tag click

on click
  filter visible contacts by tag

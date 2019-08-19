- In the LS implementation, inside each group of completed/uncompleted todos, todos with a date are sorted by date, while todos with 'No Due Date' can appear before or after those sorted by date.
- In my implementation, todos with 'No Due Date' appear first in both groups, while following todos are sorted by date
- I added autofocus on the first input field when the modal form is shown.
- I noticed that on updating todos, the server (line 30 in `api.js` )won't allow values that were previously filled to be reset to an empty state (eg, a todo with a due date can't be reset to 'No Due Date', the description can't be edited to an empty string). This differs from the LS implementation, which does allow this.


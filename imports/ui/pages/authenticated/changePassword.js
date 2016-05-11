Template.changePassword.onRendered( () => {
  Modules.client.changePassword({
    form: "#changePassword",
    template: Template.instance()
  });
});

Template.changePassword.events({
  'submit form': ( event ) => {
	  event.preventDefault();
  }
});

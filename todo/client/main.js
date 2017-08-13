tasks = new Ground.Collection(null)

Router.configure({ layoutTemplate: 'main' });
Router.route('/', function () { this.render('home'); });

Template.home.helpers({
    "getTasks": function () {
        return tasks.find({}).fetch()
    }
})
Template.home.events({
    "click .add-new-task-btn": function () {
        let val = $(".add-new-task-input").val()
        tasks.insert({"title": val, "complete": "", "star": false })
        $(".add-new-task-input").val('')
    },
    "click .added-task-remove-btn": function () {
        tasks.remove(this._id)
    },
    "input .added-task": function (event) {
        if($(event.currentTarget).val())
            tasks.update(this._id, {$set: { title: $(event.currentTarget).val() } })
    },
    "click .added-task-star-btn": function (event) {
        tasks.update(this._id, {$set: { star: isStar(this._id)} })
    },
    "change .added-task-checkbox input": function (event) {
        tasks.update(this._id, {$set: { complete: isComplete(this._id) }})
    },
});
function isComplete(id) {
    if(tasks.findOne(id).complete == ""){
        return "checked"
    } else {
        return ""
    }
}
function isStar(id) {
    if(tasks.findOne(id).star == ""){
        return true
    } else {
        return false
    }
}
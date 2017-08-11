import { Session } from 'meteor/session'

test = new Ground.Collection(null)


Router.configure({ layoutTemplate: 'layoutTemplate' });
Router.route('/', function () { this.render('goodnessList'); });
Router.route('/add', function () { this.render('addForm'); });
Router.route('/statistic', function () { this.render('statistic'); });

function setHeader(header) {
    Session.set("headerData", header);
}
function getHeader() {
    return Session.get("headerData")?Session.get("headerData"):{title: "Франкдин", isBackVisible: false}
}

Template.goodnessList.onCreated(function () { setHeader({title: "Франклин",isBackVisible: false }) });
Template.goodnessList.helpers({
    "list": function () {
        return test.find({}, {sort:{"date": -1}})
    },
    "count": function () {
        return test.findOne(this._id).count
    }
});
Template.goodnessList.events({
    'click .js-min': function () {
        if(!this.count){
            test.update(this._id, {$set: { count: 1 } })
        } else {
            test.update(this._id, { $inc: { count:1 } })
        }
    }
})
Template.addForm.onCreated(function () { setHeader({title: "Создание...",isBackVisible: true }) });
Template.addForm.events({
    "click .js-add": function(){
        let inputText = $('.js-add-input').val();
        if(inputText.length > 0 ){
            test.insert({
                "title": inputText,
                "date": new Date
            });
            $('.js-add-input').val('');
            Router.go('/');
        }
    }
})

Template.statistic.onCreated(function () { setHeader({title: "Стистика",isBackVisible: true }) });

Template.nav.helpers({
    title(){
        return getHeader().title;
    },
    isBackVisible(){
        return getHeader().isBackVisible;
    }
})

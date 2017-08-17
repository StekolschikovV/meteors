tasks = new Ground.Collection(null)

Router.configure({ layoutTemplate: 'main' });
Router.route('/', function () { this.render('home'); });

timerHelper = {
    startId: 0,
    startBlock: '',
    timeWork: 0,
    tikWorkTemp: 0,
    tikWorkStatus: '',
    timeRest: 0,
    tikRestTemp: 0,
    start(id){
        console.log('%c start: ' + id,'background:green;color:#fff;padding:2px 10px 2px 5px')

    },
    getData(){
        console.log('%c getData','background:green;color:#fff;padding:2px 10px 2px 5px')

        timerHelper.startBlock = $('.added-task-' + timerHelper.startId);
        timerHelper.timeWork = $(this.startBlock).find('.work-time-input').val()
        timerHelper.timeRest = $(this.startBlock).find('.rest-time-input').val()
        timerHelper.tikWorkTemp = timerHelper.timeWork
    },
    clickBtnStart(){
        console.log('%c clickBtnStart','background:green;color:#fff;padding:2px 10px 2px 5px')

        if(timerHelper.tikWorkStatus != 'paus' && timerHelper.tikWorkStatus != 'start'){
            timerHelper.tikWorkStatus = 'start'
            timerHelper.getData()
            timerHelper.startWork()
        } else
            timerHelper.tikWorkStatus = 'start'
    },
    clickBtnStop(){
        console.log('%c clickBtnStop','background:green;color:#fff;padding:2px 10px 2px 5px')

        timerHelper.tikWorkStatus = 'stop'
        $('.added-task-' + timerHelper.startId).find('.rest .circle-spinner-left-def-top').show()
        $('.added-task-' + timerHelper.startId).find('.rest .circle-spinner').css('transform','rotate(-' + 0 + 'deg)')
    },
    clickBtnPaus(){
        console.log('%c clickBtnPaus','background:green;color:#fff;padding:2px 10px 2px 5px')

        timerHelper.tikWorkStatus = 'paus'
    },
    openAddedTask(id){
        console.log('%c openAddedTask: ' + id,'background:green;color:#fff;padding:2px 10px 2px 5px')

        if($('.added-task-' + id).hasClass('dop')){
            $('.added-task-' + id).toggleClass('dop')
        } else {
            timerHelper.clickBtnStop()
            timerHelper.startId = id;
            timerHelper.getData()
            $('*').removeClass("dop");
            $('.added-task-' + id).addClass('dop')
        }
    },
    startWork(){
        console.log('%c startWork', 'background:green;color:#fff;padding:2px 10px 2px 5px')

        if(timerHelper.timeWork > 0 && timerHelper.timeWork < 99) {
            this.tikWorkTemp = this.timeWork * 60 // TODO: test data
            // timerHelper.tikWorkTemp = 2
            timerHelper.tikWork()
        } else
            console.log('%c Привышение максимальных зачений! timerHelper.timeWork: ' + timerHelper.timeWork, 'margin-left: 50px;background:red;color:#fff;padding:2px 50px 2px 50px')
    },
    tikWork(){
        console.log('%c tikWork: ' + this.tikWorkTemp, 'background:green;color:#fff;padding:2px 10px 2px 5px')

        if(this.tikWorkTemp > 0 && timerHelper.tikWorkStatus == 'start'){
            this.tikWorkTemp = --this.tikWorkTemp
            let oneG = 360/(this.timeWork * 60)
            let nowG = oneG * this.tikWorkTemp
            $('.added-task-' + this.startId).find('.work .circle-spinner').show()
            $('.added-task-' + this.startId).find('.work .circle-spinner').css('transform','rotate(-' + nowG + 'deg)')
            if(nowG < 180){
                $('.added-task-' + this.startId).find('.work .circle-spinner-right-hover').show()
                $('.added-task-' + this.startId).find('.work .circle-spinner-left-def-top').hide()
            } else {
                $('.added-task-' + timerHelper.startId).find('.work .circle-spinner-left-def-top').show()
            }
            setTimeout(function () {
                timerHelper.tikWork()
            }, 1000)
        } else if(timerHelper.tikWorkStatus == 'paus'){
            setTimeout(function () {
                timerHelper.tikWork()
            }, 1000)
        } else {
            $('.added-task-' + this.startId).find('.work .circle-spinner-right-hover').hide()
            $('.added-task-' + this.startId).find('.work .circle-spinner').hide()
            if(this.tikWorkTemp == 0){
                timerHelper.tikRestTemp = timerHelper.timeRest * 60 // TODO: test data
                // timerHelper.tikRestTemp = 60
                timerHelper.tikRest()
            }
        }
    },
    tikRest(){
        console.log('%c tikRest', 'background:green;color:#fff;padding:2px 10px 2px 5px')

        if(timerHelper.tikRestTemp > 0 && timerHelper.tikWorkStatus == 'start'){
            timerHelper.tikRestTemp = --this.tikRestTemp
            let oneG = 360/(timerHelper.timeRest * 60)
            let nowG = oneG * timerHelper.tikRestTemp
            $('.added-task-' + timerHelper.startId).find('.rest .circle-spinner').show()
            $('.added-task-' + timerHelper.startId).find('.rest .circle-spinner').css('transform','rotate(-' + nowG + 'deg)')
            if(nowG < 180){
                $('.added-task-' + timerHelper.startId).find('.rest .circle-spinner-right-hover').show()
                $('.added-task-' + timerHelper.startId).find('.rest .circle-spinner-left-def-top').hide()
            } else {
                $('.added-task-' + timerHelper.startId).find('.rest .circle-spinner-left-def-top').show()
            }
            setTimeout(function () {
                timerHelper.tikRest()
            }, 1000)
        } else if(timerHelper.tikWorkStatus == 'paus'){
            setTimeout(function () {
                timerHelper.tikRest()
            }, 1000)
        } else {
            $('.added-task-' + this.startId).find('.rest .circle-spinner-right-hover').hide()
            $('.added-task-' + this.startId).find('.rest .circle-spinner').hide()
            timerHelper.tikWorkStatus = 'stop'
            tasks.update(timerHelper.startId, { $inc: { sessions:1 } })
            tasks.update(timerHelper.startId, { $set: { worked: parseInt( tasks.findOne(timerHelper.startId).worked ) + parseInt( timerHelper.timeWork) } })
            tasks.update(timerHelper.startId, { $set: { rested: parseInt( tasks.findOne(timerHelper.startId).rested ) + parseInt( timerHelper.timeRest ) } })
        }
    }
}


Template.home.rendered = function () {
    $('.added-task-dop-btn')[0].click()
}

Template.home.helpers({
    "getTasks": function () {
        return tasks.find({}).fetch()
    }
})

Template.home.events({
    "click .add-new-task-btn": function () {
        let val = $(".add-new-task-input").val()
        tasks.insert({
            "title": val,
            "complete": "",
            "star": false,
            "date": '' + new Date().getDay() + '.' + new Date().getMonth() + '.' + new Date().getFullYear(),
            "sessions": 0,
            "worked": 0,
            "rested": 0
        })
        $(".add-new-task-input").val('')
    },
    "click .added-task-remove-btn": function () {
        tasks.remove(this._id)
    },
    "click .start-btn": function (event) {
        timerHelper.clickBtnStart()
    },
    "click .paus-btn": function (e) {
        timerHelper.clickBtnPaus()
    },
    "click .stop-btn": function () {
        timerHelper.clickBtnStop()
    },
    "input .added-task": function (event) {
        if($(event.currentTarget).val())
            tasks.update(this._id, {$set: { title: $(event.currentTarget).val() } })
    },
    "keyup .add-new-task-input": function (event) {
        if(event.keyCode == 13) {
            $('.add-new-task-btn').click();
        }
    },
    "click .added-task-dop-btn": function (event) {
        timerHelper.openAddedTask($(event.currentTarget).data('id'))
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

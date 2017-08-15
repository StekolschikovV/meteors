tasks = new Ground.Collection(null)

Router.configure({ layoutTemplate: 'main' });
Router.route('/', function () { this.render('home'); });

timerHelper = {
    startId: 0,
    startBlock: '',
    timeWork: 0,
    timeRest: 0,
    start(id){
        timerHelper.startId = id;
        timerHelper.startBlock = $('.added-task-' + timerHelper.startId);
        timerHelper.timeWork = $(this.startBlock).find('.work-time-input').val()
        timerHelper.timeRest = $(this.startBlock).find('.rest-time-input').val()
        console.log(123)
    }
}

let restTime = {
    time: 0,
    el: "",
    start(time, el){
        console.log(time, el)
        this.time = time * 60
        this.el = el
        this.tik(this.time)
    }, tik(time){
        console.log(time)
        // $('.rest .circle-spinner').css('transform','rotate(-' + oneG * timeNow + 'deg)')

        if(workTimer.run == true && workTimer.pauss == false){
            this.rotationSpinner(time)
            if(time > -1){
                setTimeout(function () {
                    restTime.tik(--time)
                }, 1000)
            } else {
                console.log(111)
                // this.rotationReset()
            }
        } else if(this.pauss == true){
            setTimeout(function () {
                restTime.tik(time)
            }, 1000)
        }
    }, rotationSpinner(timeNow) {
        var oneG = 360/this.time
        $(this.el).css('transform','rotate(-' + oneG * timeNow + 'deg)')
        // $('.rest .circle-spinner').css('transform','rotate(-' + oneG * timeNow + 'deg)')
        if(oneG * timeNow < 180){
            $('.circle-spinner-right-hover').show()
            $('.circle-spinner-left-def-top').hide()
        }
    }
}

let workTimer = {
    time: 0,
    run: true,
    pauss: false,
    el: '',
    start: function (e) {
        if( this.pauss != true){
            // this.getData(e)
            // this.getCircle(e)
            this.run = true
            this.pauss = false
            this.tik(timerHelper.timeWork * 60)
        } else {
            this.pauss = false
        }
    },
    paus: function () {
        this.pauss = true
    },
    stop: function () {
        this.run = false
        this.rotationReset()
    },
    getCircle: function () {
        this.el = $(event.currentTarget).parent().parent().find('.work .circle-spinner')
    },
    getData: function (event) {
        this.time =  $(event.currentTarget).parent().parent().find('.work .work-time-input').val() * 60
        this.time =  5 // !!
    },
    tik: function (time) {
        console.log(time)
        // $('.dop').find('.rest').hide()
        // console.log("!", $('.dop').find('.rest').hide())
        // console.log("!", $('.dop').find('.rest').find('.work-time-input').val())
        // console.log("!", $(this.el).parent().parent().find('.rest').find('.work-time-input').val())
        // console.log($(this.el).find('.work').hide())
        // console.log($(this.el).parent().find('.work').hide())

        if(this.run == true && this.pauss == false){
            this.rotationSpinner(time)
            if(time > -1){
                setTimeout(function () {
                    workTimer.tik(--time)
                }, 1000)
            } else {
                this.rotationReset()
                restTime.start($('.dop').find('.rest').find('.work-time-input').val(), $('.dop').find('.rest .circle-spinner'))
            }
        } else if(this.pauss == true){
            setTimeout(function () {
                workTimer.tik(time)
            }, 1000)
        }
    },
    rotationReset: function () {
        // $('.circle-spinner-right-hover').hide()
        $(timerHelper.startBlock).find('.worck').find('.circle-spinner-right-hover').hide()
        // $('.circle-spinner-left-def-top').show()
        $(timerHelper.startBlock).find('.worck').find('.circle-spinner-left-def-top').show()
        $(this.el).css('transform','rotate(' + 0 + 'deg)')
    },
    rotationSpinner: function (timeNow) {
        var oneG = 360/this.time
        $(timerHelper.startBlock).find('.work .circle-spinner').css('transform','rotate(-' + oneG * timeNow + 'deg)')
        // $(this.el).css('transform','rotate(-' + oneG * timeNow + 'deg)')
        // $('.rest .circle-spinner').css('transform','rotate(-' + oneG * timeNow + 'deg)')
        if(oneG * timeNow < 180){
            // $('.circle-spinner-right-hover').show()
            $(timerHelper.startBlock).find('.worck').find('.circle-spinner-right-hover').show()
            // $('.circle-spinner-left-def-top').hide()
            $(timerHelper.startBlock).find('.worck').find('.circle-spinner-left-def-top').hide()
        }
    }
}

Template.home.rendered = function () {
    $('.added-task-dop-btn')[0].click()
    console.log(321)
}

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
    "click .start-btn": function (event) {
        timerHelper.start($(event.currentTarget).data('id'))
        workTimer.start()
    },
    "click .paus-btn": function (e) {
        workTimer.paus(e)
    },
    "click .stop-btn": function () {
        workTimer.stop()
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
        timerHelper.start($(event.currentTarget).data('id'))
        // $(event.currentTarget).parent().parent().parent().toggleClass("dop")
        // $(event.currentTarget).toggleClass("dop")
        // if($(event.currentTarget).parent().parent().parent().hasClass("dop")){
        //     $('*').removeClass("dop");
        //     $(event.currentTarget).parent().parent().parent().addClass("dop")
        //     $(event.currentTarget).addClass("dop")
        // }
        // workTimer.stop()
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

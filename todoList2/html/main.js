$(function(){
			init();
		});

		var listLi = '<li class="flexbox">\
						<i class="finish"></i>\
						<i class="minus hide">-</i>\
						<div class="info flex">\
							<input type="text" class="title">\
							<div class="flexbox date hide"><span class="label">指定时间提醒：</span><span class="time flex"></span></div>\
						</div>\
					</li>';

		function getItem(key, success){
			$.ajax({
				url: '../remoteStorage/getItem',
				type: 'GET',
				data: {
					key: key
				},
				success: function(data){
					if(success){
                        success(data);
                    }
				}
			})
		}

		function setItem(record, success){
			$.ajax({
				url: '../remoteStorage/setItem',
				type: 'GET',
				data: record,
				success: function(data){
					if(success){
						success(data);
					}
				}
			})
		}

		function init(){		
			alarmClock();	
			bind();
			render();
			$('.finish').on('click', function(){
				var $this = $(this),
					thisIndex = $this.parent('li').index();
					storage = JSON.parse(localStorage.getItem('list')) || '';
				$this.toggleClass('green');
				if($this.hasClass('green')){
					storage[thisIndex].done = true;
				}else{
					storage[thisIndex].done = false;
				}
				localStorage.setItem('list', JSON.stringify(storage));
			})
		}

		function render(){
			getItem('list1', function(res){
				if(res){
					var data = eval('('+res.data+')');
					console.log(data);
					$('#list').append(listLi);
					$('#list .title').val(data.title);
					$('#list .time').text(data.time);
					$('.date').removeClass('hide').find('.label').addClass('hide');
					$('.time').unbind();
					if(data.clock == 0){
						$('#list .title').css('color','red');
					}
					if(data.done == 0){
						$('#list .finish').addClass('green');
					}
				}
				
			});
		}

		function bind(){
			$('#add').on('click', function(){
				$('#list').append(listLi);
			});

			$('#save').on('click', function(){
				setStorage();
				var list = $('#list').find('.title');
				$('.minus').addClass('hide');
				$('.label').addClass('hide');
				$('.time').unbind();
			});

			$('#adit').on('click', function(){
				adit();
			});
		}

		function setStorage(){
			var list = $('#list').find('.title'),
				time = $('#list').find('.time');
			if(list.length>0){
				for(var i=0; i<list.length; i++){
					var storageList = [];
					storageList.push({
						title: list[i].value,
						time : $(time[i]).text(),
						clock: 1,
						done: 1
					});
					var storage = storageList.splice(storageList);
					setItem({
						key: 'list'+(i+1),
						value: storage
					}, function(){

					});
				}
				
			}

		}

		function adit(){
			var list = $('#list').find('.title');
			if(list.length>0){
				$('.minus').removeClass('hide');
				$('.date').removeClass('hide');
				$('.label').removeClass('hide');
				$('.minus').on('click', function(){
					$(this).parent('li').remove();
				});
				$('.time').date({theme:"datetime"});
			}
		}

		function getNowFormatDate() {
		    var date = new Date();
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = date.getMonth() + 1;
		    var strDate = date.getDate();
		    var strMinu = date.getMinutes();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    // if (strDate >= 0 && strDate <= 9) {
		    //     strDate = "0" + strDate;
		    // }
		    if (strMinu >= 0 && strMinu <= 9) {
		        strMinu = "0" + strMinu;
		    }
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + date.getHours() + seperator2 + strMinu;
		    return currentdate;
		}

		function alarmClock(){
			var clock = setInterval(function(){
				var date = getNowFormatDate(),
					fini = $('#list .finish'),
					storage = JSON.parse(localStorage.getItem('list')) || '';
				for(var i=0; i<storage.length; i++){
					var sTime = storage[i].time,
						clockTitle = $('#list').find('.title').eq(i);
					if(!$(fini).hasClass('green')){
						if(date == sTime){
							$(clockTitle).css('color','red');
							console.log('提醒事项：'+ $(clockTitle).val());
							storage[i].clock = true;
						}
					}
				}
				localStorage.setItem('list', JSON.stringify(storage));

			},60000);
			
		}
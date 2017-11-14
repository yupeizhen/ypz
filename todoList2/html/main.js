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
			var his = JSON.parse(localStorage.getItem('list')) || '';
			if(his.length>0){
				for(var i=0; i<his.length; i++){
					$('#list').append(listLi);
					$('#list .title').eq(i).val(his[i].title);
					$('#list .time').eq(i).text(his[i].time);
					$('.date').removeClass('hide').find('.label').addClass('hide');
					$('.time').unbind();
					if(his[i].clock && his[i].clock == true){
						$('#list .title').eq(i).css('color','red');
					}
					if(his[i].done && his[i].done == true){
						$('#list .finish').eq(i).addClass('green');
					}
				}
			}
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
				time = $('#list').find('.time'),
				storageList = [];
			if(list.length>0){
				for(var i=0; i<list.length; i++){
					storageList.push({
						title: list[i].value,
						time : $(time[i]).text()
					});

				}
				localStorage.setItem('list', JSON.stringify(storageList));
				console.log(storageList);
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
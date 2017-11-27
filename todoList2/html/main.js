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

		function getItem(success){
			$.ajax({
				url: '../remoteStorage/getItem',
				type: 'GET',
				data: {
					key: 'list'
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
		}

		function render(){
			getItem(function(res){
				if(res){
					var data = eval('('+res.data+')');
					console.log(data);
					var dataLi = data.slice(',');
					for(var i=0; i<dataLi.length; i++){
						$('#list').append(listLi);
						var liItem = $('#list li').eq(i);
						$(liItem).find('.title').val(dataLi[i].title);
						$(liItem).find('.time').text(dataLi[i].time);
						$(liItem).find('.date').removeClass('hide').find('.label').addClass('hide');
						$(liItem).find('.time').unbind();
						if( dataLi[i].clock == 0){
							$(liItem).find('.title').addClass('t-red');
						}
						if( dataLi[i].done == 0){
							$(liItem).find('.finish').addClass('green');
						}
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
				time = $('#list').find('.time'),
				fini = $('#list').find('.finish');
			if(list.length>0){
				var storageList = [];
				var date = getNowFormatDate(),
					li = $('#list li');

				for(var i=0; i<list.length; i++){
					var d = 1, //是否完成1否0是
						c = 1; //是否提醒
					var sTime = $(li).eq(i).find('.time').text();
					if(date < sTime){
						$(li).eq(i).find('.title').removeClass('t-red');
					}
					if($(fini[i]).hasClass('green')){
						d = 0;
					}
					if($(list[i]).hasClass('t-red')){
						c = 0;
					}
					storageList.push({
						title : list[i].value,
						time : $(time[i]).text(),
						clock : c,
						done : d
					});
				}

				var storage = JSON.stringify(storageList);
				setItem({
					key: 'list',
					value: storage
				}, function(res){

				});				
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
				$('.finish').on('click', function(){
					$(this).toggleClass('green');
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
					li = $('#list li'),
					fini = $('#list .finish');
				for(var i=0; i<li.length; i++){
					var sTime = $(li).eq(i).find('.time').text(),
						clockTitle = $(li).eq(i).find('.title');
					if(!$(li).eq(i).find('.finish').hasClass('green')){
						if(date == sTime){
							$(clockTitle).addClass('t-red');
							console.log('提醒事项：'+ $(clockTitle).val());
							setStorage();
						}
					}
				}

			},60000);
			
		}
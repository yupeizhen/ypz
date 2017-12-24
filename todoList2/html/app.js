new Vue({
	el:'#app',
	data:{
		list:[]
	},
	created: function(){
		var self = this;
		self.initList();
	},
	mounted: function(){

	},
	methods:{
		getItem: function(success){
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
		},
		initList: function(){
			var self = this;
			self.getItem(function(res){
				if(res.code == 1){
					self.list = eval('('+res.data+')');
					console.log(self.list);
				}
			});
		}
	}
});



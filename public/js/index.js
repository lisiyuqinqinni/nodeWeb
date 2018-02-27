
$(function(){
	$(".register a").click(function(){
		$(".register").hide();
		$(".login").show();
	})
	$(".login a").click(function(){
		$(".register").show();
		$(".login").hide();
	});
	$(".register input[type=button]").click(function(){
		$.ajax({
			type:'post',
			url:'/api/user/register',
			dataType:'json',
			data:{
				username: $('.register input[name=username]').val(),
				password: $('.register input[name=password]').val(),
				repassword: $('.register input[name=repassword]').val(),
			},
			success:function(res){
				$(".register p").html(res.message);

				if(!res.code){
					$(".register").hide();
					$(".login").show();
				}
			}
		})
	});
	$(".login input[type=button]").click(function(){
		$.ajax({
			type:'post',
			url:'/api/user/login',
			dataType:'json',
			data:{
				username: $('.login input[name=username]').val(),
				password: $('.login input[name=password]').val()
			},
			success:function(res){
				console.log(!res.code)

				if(!res.code){
					//登陆成功
					console.log("nihao")
					window.location.reload();	
				}
			}
		})
	});
	$(".userInfo").find(".logout").click(function(){
		$.ajax({
			
			url:'/api/user/logout',
			success:function(res){
				//退出登陆
				window.location.reload();
			}
		})
	});
})
$(".sub [type=button]").on("click",function(){
    $.ajax({
        type:"POST",
        url:"/api/content/comment",
        data:{
            id:$("[type=hidden]").val(),
            comment:$("[name=comment]").val()
        },
        success:function(res){
            console.log(res)
        }
    })
})
var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];


$(".sub .but").on("click",function(){
    if($("[name=comment]").val().length<5){
        alert("输入的内容太短")
        return 
    }
    $.ajax({
        type:"POST",
        url:"/api/content/comment",
        data:{
            id:$("[type=hidden]").val(),
            comment:$("[name=comment]").val()
        },
        success:function(res){
            if(!res.code){
                comment:$("[name=comment]").val("")
                comments = res.content.comments.reverse()
                commentsss()
            }else{
                alert(res.message);
            }
           
        }
    })
})
$.ajax({
    url:"/api/comment",
    data:{
        id: $("[type=hidden]").val()
    },
    success: function(res){
        comments = res.content.comments.reverse()
        commentsss()
    }
})
function commentsss () {
    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    var start = Math.max(0, (page-1) * prepage);
    var end = Math.min(start + prepage, comments.length);
    
    $page = $(".page span");
    if(page<=1){
        $page.eq(0).html("没有上一页了")
    }else{
        $page.eq(0).html("<a class='pre' href='javascript:;'>上一页</a>")
    }
    if(page>=pages){
        $page.eq(2).html("没有下一页了")
    }else{
        $page.eq(2).html("<a href='javascript:;'>下一页</a>")
    }
    console.log(comments.length)
    if(comments.length==0){
        $page.eq(1).html("该文章还未有人评论，快来试试吧")
    }else{
        var html = "";
        for(var i=start; i<end;i++){
            html += `<li>
            <p class="comUser">`+comments[i].username+`: <span>`+timeform(comments[i].comTime)+`</span></p>
            <p class="comCon">`+comments[i].comment+`</p>
        </li>`
        }
        $(".main .comment ul").html(html)
    }
    
}

$('.page').delegate('a', 'click', function() {
    if ($(this).hasClass('pre')) {
        page--;
    } else {
        page++;
    }
    commentsss();
});


function timeform(time){
    var t = new Date(time);
    return t.getFullYear()+"年"+(t.getMonth()+1)+"月"+t.getDate()+"日";
}

$(document).ready(function(){
    // listen on click event for delete article button
    $('.delete-article').on('click',function(e){
        let $target = e.target;
        let id = $target.dataset.id;
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: function(response){
                console.log(response);
                alert('Deleteing article');
                window.location.href = '/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});
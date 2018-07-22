
let createDomain = document.querySelector('#createDomain')

createDomain.onclick = function(){

    let data = {};
    data.domainName = $('#domainName').val();
    data.email = window.localStorage.getItem('email');
 
    
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/createNewNamespace',						
        success: function(data) {
            console.log('success!!!!!');
            console.log('pods: ',data.pods);
            console.log('data: ',JSON.stringify(data));
        }
    });
    
}


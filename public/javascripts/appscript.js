
let createDomain = document.querySelector('#createDomain')

createDomain.onclick = function(){

    let data = {};
    data.domainName = $('#domainName').val();
    data.username = $('#usernameid')[0].text;

    console.log(data);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/createnamespace',						
        success: function(data) {
            console.log('success!!!!!');
            console.log('data: ',JSON.stringify(data));
            console.log()
            $('#resultid')[0].textContent=  `${data.result}`;
        }
    });
    
}


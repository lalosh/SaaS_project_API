let k8sAPI = require('./k8sAPI');
let result;
function printResult(){console.log('\n' + result + '\n')};
 
let API = k8sAPI('192.168.42.22','8443');



let namespace = 'someuser'

result = API.createNamespace(namespace);    printResult();
result = API.getUserIP(namespace);          printResult();
result = API.getServiceNames(namespace);    printResult();
result = API.getContainerInfo(namespace);   printResult();
result = API.getAutoscalerInfo(namespace);  printResult();

namespace = 'ANOTHER';

result = API.createNamespace(namespace);    printResult();
result = API.getUserIP(namespace);          printResult();
result = API.getServiceNames(namespace);    printResult();
result = API.getContainerInfo(namespace);   printResult();
result = API.getAutoscalerInfo(namespace);  printResult();

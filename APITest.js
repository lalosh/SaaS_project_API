let k8sAPI = require('./k8sAPI');


let API = k8sAPI('192.168.42.22','8443');


let namespace = 'audi';

API.createNamespace(namespace)
.then((res) => {

    API.getUserIP(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

    API.getServiceNames(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

    API.getContainerInfo(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

    API.getAutoscalerInfo(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

})
.catch((e)=> console.log(e))


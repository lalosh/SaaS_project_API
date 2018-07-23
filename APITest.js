let k8sAPI = require('./k8sAPI');


let API = k8sAPI('192.168.42.22','8443');


let namespace = 'tokaN'

API.createNamespace(namespace)
.then((res) => console.log(res))
.catch((e)=> console.log(e))

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



namespace = 'OKAYtO';

API.createNamespace(namespace)
.then((res) => console.log(res))
.catch((e)=> console.log(e))

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

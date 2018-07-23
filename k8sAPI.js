let generateFiles = require('./generateFiles');
let k8s = require('k8s');

function k8sAPI(IP,PORT){
   
    if
    (
        typeof IP !== 'string'  ||
        typeof PORT !== 'string'||
        IP.trim() === ''        ||
        PORT.trim() === ''
    )
    {
        console.error('please provide IP and PORT as strings');
        return undefined;
    }

    let kubectl = k8s.kubectl({
        endpoint:  `https://${IP}:${PORT}`,
        binary: '/usr/local/bin/kubectl'
    });

    let API = {};
    let successCount = 0;


    API.createNamespace = function createNamespace(namespace){

        if(!kubectl){
            console.error('pleas call API.init first');
            return false;
        }



            function successPromise(data){
                console.log('Success! creating...');
                successCount++;
                if(successCount == 9){
                    console.log('Finish creating Files');
                    console.log('your namespace is ready');
                    return new Promise(function(resolve,reject){
                        resolve(true);
                    })
                }
            }
            
            function failerPromise(error){
                console.log('Failed!... maybe the namespace is already created');
                console.log('Error:');
                console.error(error);
                console.log('-------------------');
            }
            
            generateFiles(namespace);
            let basePath = `${__dirname}/namespaces/${namespace}/`;
    

            ///


            let order = function(){ 
            
                return new Promise(function(resolve, reject){
                    console.log(0);
                    resolve(true);
                })
            }

            return order()
            .then(()=>{
                console.log('hello1')
                return kubectl
                .command(`create namespace ${namespace}`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}002-mysql-credentials.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}003-mysql/001-mysql-volume.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}003-mysql/002-mysql-deployment.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}003-mysql/003-mysql-service.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}004-wordpress/001-wordpress-volume.yaml`)
                .then(successPromise, failerPromise);
            })
    
            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}004-wordpress/002-wordpress-deployment.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}004-wordpress/003-wordpress-service.yaml`)
                .then(successPromise, failerPromise)
            })
              
            .then(()=>{   
                 return kubectl
                .command(`apply --record -f ${basePath}podinfo-hpa.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{   
                return kubectl
               .command(`create -f ${basePath}005-phpmyadmin/001-phpmyadmin-deployment.yaml`)
               .then(successPromise, failerPromise);
           })

            .then(()=>{   
                 return kubectl
                .command(`create -f ${basePath}005-phpmyadmin/002-phpmyadmin-service.yaml`)
                .then(successPromise, failerPromise);
            })
            .then(successPromise, failerPromise);
                    
    }


    API.getUserIP = function getUserIPPromise(namespace){
        
        return new Promise(function(resolve, reject){
            
            let userKubectl = k8s.kubectl({
                endpoint:  `https://${IP}:${PORT}`,
                namespace: `${namespace}`,
                binary: '/usr/local/bin/kubectl'
            });
    
            
            userKubectl.service.list(function(error, serviceInfo){
                if(error){
                    console.error('failed getting user IP');
                    reject('cannot get user IP');
                }
    
                //return the Service ip for the user
                let userIP = IP;
                let userIPForPhpmyadmin = `http://${userIP}:${serviceInfo.items[1].spec.ports[0].nodePort}`;
                let userIPForWordpress = `http://${userIP}:${serviceInfo.items[2].spec.ports[0].nodePort}`;
                resolve({ 
                    userIPForPhpmyadmin,
                    userIPForWordpress
                });
            });
        })
    }


    API.getServiceNames = function getServiceNamesPromise(namespace){
       
        return new Promise(function(resolve,reject){

            let userKubectl = k8s.kubectl({
                endpoint:  `https://${IP}:${PORT}`,
                namespace: `${namespace}`,
                binary: '/usr/local/bin/kubectl'
            });
    
            userKubectl.service.list(function(error, serviceInfo){
                if(error){
                    console.error('failed getting services names');
                    reject('cannot get services names');
                }
    
                //return the service name
                console.log(`mysql service name:     ${serviceInfo.items[0].metadata.name}`)
                console.log(`php service name: ${serviceInfo.items[1].metadata.name}`)
                console.log(`wordpress service name: ${serviceInfo.items[2].metadata.name}`)
                resolve({
                    mysqlService: `${serviceInfo.items[0].metadata.name}`,
                    phpService: `${serviceInfo.items[1].metadata.name}`,
                    wordpressService: `${serviceInfo.items[2].metadata.name}`
                })
            });
        })
    }


    API.getContainerInfo = function getContainerInfoPromise(namespace){
        return new Promise(function(resolve, reject){
                
            let userKubectl = k8s.kubectl({
                endpoint:  `https://${IP}:${PORT}`,
                namespace: `${namespace}`,
                binary: '/usr/local/bin/kubectl'
            });

            // //print pods containers names and their restart counts
            userKubectl.pod.list(function(error, podsInfo){
                
                let resultArray = [];

                if(error){
                    console.error('failed getting container info');
                    reject('failed getting container info');
                }

                for(let i=0; i < podsInfo.items.length; i++){
                    
                    let containerName = podsInfo.items[i].metadata.generateName;
                    let restarts = podsInfo.items[i].status.containerStatuses[0].restartCount;
                    let status = podsInfo.items[i].status.phase;
                    
                    let resultObject = {
                        containerName,
                        restarts,
                        status
                    }
                    resultArray.push(resultObject);

                    console.log(`container name:  ${containerName} 
                                restarts:        ${restarts}
                                status:          ${status}
                                `)
                }

                resolve(resultArray);
            }) 
        })
    }


    API.getAutoscalerInfo = function getAutoscalerInfo(namespace){
        
        let userKubectl = k8s.kubectl({
            endpoint:  `https://${IP}:${PORT}`,
            namespace: `${namespace}`,
            binary: '/usr/local/bin/kubectl'
        });

        return userKubectl
        .command('get hpa')
        .then(function(data){

            let extractedData = data.split('\n')[1].split(' ').filter((item) => item.length > 0);

            let hpaInfo = {
                name: extractedData[0],
                refernce: extractedData[1],
                load: extractedData[5],
                targets: `${extractedData[2]} ${extractedData[3]} ${extractedData[4]} ${extractedData[5]} ${extractedData[6]} ${extractedData[7]}`,
                minpods: extractedData[8],
                maxpods: extractedData[9],
                replicas: extractedData[10],
                age: extractedData[11]
            }

            console.log(`
                        replicas: ${hpaInfo.replicas}
                        loads:    ${hpaInfo.load}
                        targets:  ${hpaInfo.targets}
                        `);

            return hpaInfo;
        })
        .catch((error)=>{
            console.error('Failed to get HPA info!');
            console.error(error);
            return('Failed to get HPA info!');
        });
    }
    
    return API;
}

module.exports = k8sAPI;

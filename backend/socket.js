const{Server}=require('socket.io');
require('dotenv/config.js')
let io;
let adIo;

const init=(server)=>{
    io = new Server(server, {
        cors: {
          origin: '*',
          methods: ['*'],
          allowHeaders: ['*'],
        }
      });
      
    return io;
};

const initAdIo=(server,path='/socket/adpage')=>{
    adIo=new Server(server,{
        cors:{
            origin:'*',
            methods:['*'],
            allowHeaders:['*'],
        },
        path:path,
    })
    return adIo;
}

const getIo=()=>{
    if(!io){
        throw new Error('socket is not initialized')
    }
    return io;
}
const getAdIo = () => {
    if (!adIo) {
      throw new Error('Socket.io not initialized');
    }
    return adIo;
  };

module.exports={init,initAdIo,getIo,getAdIo};
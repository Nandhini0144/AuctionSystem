const{Server}=require('socket.io');
require('dotenv/config.js')
let io;
let adIo;

const init=(server)=>{
  try{
    io = new Server(server, {
        cors: {
          origin: '*',
          methods: ['*'],
          allowHeaders: ['*'],
        }
      });
      
    return io;
  }
  catch(error)
  {
    console.log(error);
  }
};

const initAdIo=(server,path='/socket/adpage')=>{
  try{
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
  catch(error)
  {
    console.log(error);
  }
}

const getIo=()=>{
  try{
    if(!io){
        throw new Error('socket is not initialized')
    }
    return io;
  }
  catch(error)
  {
    console.log(error);
  }
}
const getAdIo = () => {
  try{
    if (!adIo) {
      throw new Error('Socket.io not initialized');
    }
    return adIo;
  }
  catch(error)
  {
    console.log(error);
  }
  };

module.exports={init,initAdIo,getIo,getAdIo};
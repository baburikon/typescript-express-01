import cluster from 'cluster';
import dotenv from "dotenv";
import config from "config";

dotenv.config();
console.log('NODE_ENV', process.env.NODE_ENV);

(async ()=>{

  if (cluster.isMaster) {

    await import('./app.master');

  } else {

    const host: string = process.env.SERVER_HOST || config.get('server.host');
    const port: number = process.env.SERVER_PORT
      ? parseInt(process.env.SERVER_PORT)
      : config.get('server.port');

    const {default: app} = await import('./app.worker');
    app.listen(port, host,() => {
      console.log(`Server listens http://${host}:${port}`);
    });
  }

})();

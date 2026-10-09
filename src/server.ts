import express from 'express';
import routes from './routes';

class Server {
  private app: any;
  private port: any;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
  }

  middlewares(): any {
    this.app.use(express.json());
  }

  routes(): any {
    this.app.use('/api/v1', routes);
  }

  listen(): any {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`);
    });
  }
}

export default Server;
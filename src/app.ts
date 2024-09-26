import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { mongoconnect } from './utils/database';
import routes from './router'
import { Server, Socket } from 'socket.io';
import * as http from 'http';


// const ap = express();
// const server = http.createServer(ap);
// const io = new Server(server);

export const app: any = {
	instance: express(),
	async init() {
		this.initConfig();
		await this.initDatabase();
		this.initRoutes();
	},

	/**
 * Initialize the database connection with MongoDB
 */
	initDatabase(): Promise<void> {
		return new mongoconnect().connectToDb();
	}, 

	initConfig() {
		this.instance.use(cors());
		this.instance.use(bodyParser.json());
		this.instance.use(bodyParser.urlencoded({ extended: false }));
		this.instance.use(function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authtoken, access_token, Accept, authorization");
			res.header("Access-Control-Allow-Methods", "*");
			if (req.method === 'OPTIONS') {
				res.send(200);
			} else {
				next();
			}
		});
	},
	initRoutes() {
		this.instance.use(express.static(path.join(__dirname, 'dist')));
		this.instance.get('/api', (req, res) => {
			res.send("OK");
		});
		this.instance.use('/api', routes);
		this.instance.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, 'dist/index.html'));
		});
		this.instance.use((req: Request, res: Response, next: NextFunction) => {
			const err = new Error('Not Found');
			err['status'] = 404;
			next(err);
		});
		this.instance.use((err, req: Request, res: Response, next: NextFunction) => {
			res.status(err.status || 500);
			res.send({ success: false, message: err.message, result: {}, statusCode: err.status });
		});
	},
};

const ap = express();
const server = http.createServer(ap);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket: Socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data: { room: string }) => {
    socket.join(data.room);
  });

  socket.on("send_message", (data: { room: string; message: string }) => {
    socket.to(data.room).emit("receive_message", data);
  });
});
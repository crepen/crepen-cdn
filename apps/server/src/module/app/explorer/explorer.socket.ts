import { DynamicConfigService } from '@crepen-nest/module/config/dynamic-config/dynamic-config.service';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'



@WebSocketGateway({
    cors: {
        origin: '*'
    },
    namespace: '/upload',
    allowEIO3: true,
    maxHttpBufferSize: 3e6,
    compression: true,
    perMessageDeflate: {
        threshold: 1024,
        concurrencyLimit: 10,
        memLevel: 7,
    }
})
export class CrepenExplorerSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly dynamicConfig :DynamicConfigService
    ) {}
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`클라이언트 연결: ${client.id}`);
       
        this.server.emit('message', `새로운 클라이언트가 연결되었습니다: ${client.id}`);
    }
    handleDisconnect(client: Socket) {
        console.log(`클라이언트 연결 해제: ${client.id}`);

    }

    afterInit(server: Server) {
        console.log('Socket.io 서버 초기화 완료');
    }


    @SubscribeMessage('upload-chunk')
    async handleUploadChunk(
        @MessageBody() payload: { filename: string; index: number; total: number; data: Buffer },
        client: Socket,
    ) {
        try {
            console.log(payload, client);
        }
        catch (err) {

        }
    }
}
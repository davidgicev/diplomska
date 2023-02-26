import { WSMessage } from "../types/WSMessage";
import PeerHandler from "./PeerHandler";
import WebSocketClient from "./WebSockerClient";
import { handleSyncResponseMessages, handleSyncResponseShallow } from "./syncing";

var configuration: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun2.1.google.com:19302" }] 
}

export default class ServerHandler {
    context: WebSocketClient
    serverConnection: WebSocket
    
    constructor(context: WebSocketClient) {
        this.context = context
        console.log("alo?", this.context.user)
        this.serverConnection = new WebSocket("ws://localhost:9000/" + this.context.user.id)
        this.serverConnection.onopen = () => {
            console.log("otvorjeno konekcija so server")
            // this.context.setState({
            //     client: {
            //         serverConnectionStatus: "connected",
            //     }
            // })
            this.login()
        }
        this.serverConnection.onmessage = ({data}) => {
            console.log("received msg with data", data)
            const message: WSMessage = JSON.parse(data)
            this.handlers[message.type](message)
        }
    }

    handlers = {
        userLeft: this.handleUserLeft.bind(this),
        upsertUser: this.handleUpsertUser.bind(this),
        error: this.handleError.bind(this),
        loginResponse: this.handleLoginResponse.bind(this),
        loginRequest: this.handleLoginRequest.bind(this),
        answer: this.handleAnswer.bind(this),
        candidate: this.handleCandidate.bind(this),
        offer: this.handleOffer.bind(this),
        upsertChat: this.handleUpsertChat.bind(this),
        upsertMessage: this.handleUpsertMessage.bind(this),
        syncResponseShallow: handleSyncResponseShallow.bind(this),
        syncResponseMessages: handleSyncResponseMessages.bind(this)
    }

    handleOpen() {
        console.log("zhiv sum")
    }
    
    handleMessage(message: string) {
        const data = JSON.parse(message)
    
        this.handlers[data.type as keyof typeof this.handlers](data)
    }
    
    handleLoginRequest() {
        console.log("wtf are you doing")
    }
    
    handleLoginResponse(message: WSMessage) {
        
        if(message.type !== "loginResponse") {
            return
        }
    
        if (!message.data.success) {
            alert("Nesho utna hihi");
            return 
        }

        // this.context.context.state.actions.syncWithServer()

        const userIds = message.data.userIds.filter(id => id !== this.context.user.id)
    
        for (const id of userIds) {
            this.initPeerConnection(id)
            this.makeOffer(id)
        }
    };
    
    handleUpsertUser(message: WSMessage) {
        if (message.type !== "upsertUser") {
            return
        }
        const id = message.data.id
        this.initPeerConnection(id)
        // this.context.context.state.actions.syncWithServer()
    }

    handleUpsertChat(message: WSMessage) {
        if (message.type !== "upsertChat") {
            return
        }
        const data = message.data
        this.context.context.state.actions.upsertChat({
            id: data.id,
            type: "private",
            userIds: data.userIds,
            title: data.title,
            tempId: "",
            lastUpdated: data.lastUpdated,
            photo: ""
        })
    }

    handleUpsertMessage(message: WSMessage) {
        if (message.type !== "upsertMessage") {
            return
        }

        this.context.context.state.actions.upsertMessage(message.data)
    }
    
    async handleOffer(message: WSMessage) {
        if (message.type !== "offer") {
            return
        }
    
        const userId = message.data.targetUserId

        if (!(userId in this.context.peerConnections)) {
            this.initPeerConnection(userId)
        }

        const peer = this.context.peerConnections[userId]
        peer?.setRemoteDescription(new RTCSessionDescription(message.data.SDU)); 
        
        const answer = await peer?.createAnswer() 
        if (!answer) {
            return
        }
        peer.setLocalDescription(answer); 
        this.send({ 
            type: "answer", 
            data: {
                targetUserId: userId,
                SDU: answer,
            }
        }); 
        this.context.context.state.actions.addUserConnection(userId)
    };

    send(message: WSMessage) {
        try {
            this.serverConnection.send(JSON.stringify(message)); 
        } catch(e) {}
    }

    async makeOffer(targetUserId: number) {         
        const peer = this.context.peerConnections[targetUserId]
        const offer = await peer?.createOffer()
        if (!offer) {
            console.log("flop")
            return
        }
        this.send({ 
            type: "offer", 
            data: {
                SDU: offer,
                targetUserId,
            }
        }); 
        peer.setLocalDescription(offer); 
        console.log("Made offer to connect with", targetUserId)
    }

    async login() {
        this.send({ 
            type: "loginRequest", 
            data: {
                id: this.context.user.id,
                token: this.context.user.token,
            },
         }); 
    }
    
    handleAnswer(message: WSMessage) { 
        if (message.type !== "answer") {
            return
        }
    
        const id = message.data.targetUserId
        this.context.peerConnections[id]?.setRemoteDescription(new RTCSessionDescription(message.data.SDU)); 
        this.context.context.state.actions.addUserConnection(id)
    };
    
    handleCandidate(message: WSMessage) {
        if (message.type !== "candidate") {
            return
        } 
        const id = message.data.targetUserId
        this.context.peerConnections[id]?.addIceCandidate(new RTCIceCandidate(message.data.candidate)); 
    };

    handleUserLeft(message: WSMessage) {
        if (message.type !== "userLeft") {
            return
        }
        const id = message.data.id
        delete this.context.dataChannels[id]
        delete this.context.peerConnections[id]
    }
    
    handleError(message: WSMessage) {
        if (message.type !== "error") {
            return
        }
    
        console.log("ERROR")
        console.log(message.data)
    }

    initDataChannel(peer: RTCPeerConnection, id: number) {
        const dataChannel = peer.createDataChannel("main")

    
        peer.ondatachannel = ({channel}) => {
            new PeerHandler(this.context, channel, id)
        }
    
        return dataChannel
    }
    
    initPeerConnection(id: number) {
        const peer = new RTCPeerConnection(configuration)
    
        peer.onicecandidate = (event) => { 
            if (event.candidate) { 
                this.send({ 
                    type: "candidate", 
                    data: {
                        candidate: event.candidate,
                        targetUserId: id,
                    }
                }); 
            } 
        };

        peer.oniceconnectionstatechange = (event) => {
            // alert(peer.iceConnectionState)
        }
    
        this.context.peerConnections[id] = peer
        this.context.dataChannels[id] = this.initDataChannel(peer, id)
    }
}
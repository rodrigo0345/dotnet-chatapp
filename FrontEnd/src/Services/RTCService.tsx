export class RTCService {
  localStream: MediaStream;
  remoteStream: MediaStream;

  constructor(ls: MediaStream, rs: MediaStream) {
    this.localStream = ls;
    this.remoteStream = rs;
  }

  static async getMediaStream(
    usingVideo: boolean = false,
    usingAudio: boolean = true
  ) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: usingVideo,
      audio: usingAudio,
    });

    return stream;
  }

  static async getRemoteMediaStreams(something: []): Promise<MediaStream[]> {
    const result = [];
    for (let i = 0; i < something.length; i++) {
      result.push(new MediaStream(something[i]));
    }

    return result;
  }

  async createPeerConnection() {
    const configuration = {
      iceServers: [
        {
          urls: [
            "stun:stun1.1.google.com:19302",
            "stun:stun2.1.google.com:19302",
          ],
        },
      ],
    };
    const peerConnection = new RTCPeerConnection(configuration);

    return peerConnection;
  }
  async createOffer(peerConnection: RTCPeerConnection) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    return offer;
  }
  async sendInformationToPeer(
    localStream: MediaStream,
    peerConnection: RTCPeerConnection,
    offer: RTCSessionDescriptionInit
  ) {
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = async (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    };
  }
}

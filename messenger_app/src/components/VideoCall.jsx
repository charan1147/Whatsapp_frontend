import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import socket from '../socket.js';

function VideoCall() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { isLoggedOut } = useAuth(); // Access isLoggedOut state
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const endCall = () => {
    // Stop all tracks in the local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Close the peer connection
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    // Clean up socket listeners
    socket.off('answer');
    socket.off('iceCandidate');
  };

  const handleEndCall = () => {
    endCall();
    navigate('/chat'); // Redirect to chat page
  };

  useEffect(() => {
    // If user logs out, end the call and redirect to home
    if (isLoggedOut) {
      endCall();
      navigate('/'); // Redirect to home page after logout
    }
  }, [isLoggedOut, navigate]);

  useEffect(() => {
    const startCall = async () => {
      // Skip starting the call if user is logged out
      if (isLoggedOut) return;

      try {
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('iceCandidate', { candidate: event.candidate, to: contactId });
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { offer, to: contactId });

        socket.on('answer', async (answer) => {
          await pc.setRemoteDescription(answer);
        });

        socket.on('iceCandidate', async (candidate) => {
          await pc.addIceCandidate(candidate);
        });
      } catch (err) {
        console.error('WebRTC error:', err);
        setError("Failed to start video call. Please ensure camera and microphone permissions are granted.");
      }
    };

    startCall();

    return () => {
      endCall();
    };
  }, [contactId, isLoggedOut]); // Add isLoggedOut to dependencies

  return (
    <div>
      <h2>Video Call with Contact ID: {contactId}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <button className="end-call-button" onClick={handleEndCall}>End Call</button>
    </div>
  );
}

export default VideoCall;
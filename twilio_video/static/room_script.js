const Video = Twilio.Video
Video.connect(context.person_token, {
  name: context.room_name,
  audio: {name: 'mic'},
  enableDominantSpeaker: true,
  video: { name: 'camera' , width: 640 }
}).then(room => {
  console.log('Connected to Room "%s"', room.name);

  room.participants.forEach(participantConnected);
  room.on('participantConnected', participantConnected);

  room.on('participantDisconnected', participantDisconnected);
  room.once('disconnected', error => room.participants.forEach(participantDisconnected));
});

function participantConnected(participant) {
  console.log('Participant "%s" connected', participant.identity);

  const div = document.getElementById('remote-div');
  
  participant.on('trackSubscribed', track => trackSubscribed(div, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });

}

function participantDisconnected(participant) {
  console.log('Participant "%s" disconnected', participant.identity);
  document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
  div.appendChild(track.attach());
}

function trackUnsubscribed(track) {
  track.detach().forEach(element => element.remove());
}

function toggleLocalVideo(){
  const local_video = document.getElementById('local_video');
  const localMediaContainer = document.getElementById('local-media');
  if (local_video.checked == true){
    Video.createLocalVideoTrack().then(track => {
      localMediaContainer.appendChild(track.attach());
      
    });
  } else {    
    while(localMediaContainer.hasChildNodes){
      localMediaContainer.removeChild(localMediaContainer.firstChild);
    }
  }
};
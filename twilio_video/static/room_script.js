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
  const para = document.createElement('p');
  para.innerText = `${participant.identity} has connected! `
  para.style.color = 'green';
  para.style.fontSize = '1rem';
  para.style.marginLeft = '2rem';
  para.style.marginTop = '2rem';

  participant.on('trackSubscribed', track => trackSubscribed(div, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });

  document.body.appendChild(para);

}

function participantDisconnected(participant) {
  console.log('Participant "%s" disconnected', participant.identity);
  document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
  div.appendChild(track.attach());
  alert('Track Subscribed');
}

function trackUnsubscribed(track) {
  // const trc = track.detach()
  track.detach().forEach(element => element.remove());
  alert('Track Unsubscribed')
  
  
}

// function toggleLocalVideo(){
//   const localMediaContainer = document.getElementById('local-media');
 
// }
const toggleLocalVideo = () => {
  const local_video = document.getElementById('local_video');
  const container = document.querySelector('#container');
  const localMediaContainer = document.getElementById('local_media') || container.appendChild(document.createElement('div'));
  localMediaContainer.setAttribute('id', 'local_media')
  Video.createLocalVideoTrack().then(track => {
    if (local_video.checked){
      alert('check')
      localMediaContainer.appendChild(track.attach());
      // const mudiaElements = track.detach();
      // window.mudiaElem = mudiaElements;
      
    } else if (local_video.checked == false){
      alert('uncheck')
      const mediaElements = track.detach(localMediaContainer);
      window.mediaElem = mediaElements;
      // console.log(mediaElements)
      
      // mediaElements.forEach(mediaElement => mediaElement.remove());

      track.detach(localMediaContainer).remove()
    }
  });
};

// const removeLocalTrack = () =>{
  
// }
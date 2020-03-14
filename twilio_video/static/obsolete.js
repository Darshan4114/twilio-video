console.log('conectes')

const Video = Twilio.Video;

function connectRemote(room){
  room.participants.forEach(participant=>{
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        const track = publication.track;
        document.getElementById('remote-media-div').appendChild(track.attach());
      }
    });
  });
};






Video.connect(context.person_token, {
  name: context.room_name,
  audio: false,
  video: {name:'Cyamera' , width: 640 }
}).then(room => {
  room.participants.forEach(participant=>{
    alert(participant)
    alert(`participants tarck:${participant.tracks}`)
    participant.tracks.forEach(publication => {
      
      alert(publication)
      
      alert(publication.sid)
      alert(publication.id)

      alert(publication.isSubcribed)
      if (publication.isSubcribed){
        alert('I subbed it baby ;)')
      }
      const track = publication.track;
      alert(`Track subbed ${track.id}`)
      if (publication.isSubscribed) {
        const track = publication.track;
        alert(`Track subbed ${track.id}`)
      }
    });
    
  });
  alert(`Successfully joined a Room: ${room}`);
  room.on('participantConnected', participant => {
    alert(`A remote Participant connected: ${participant}`);
    alert('scripty')
    alert(`Participant "${participant.identity}" connected`);
  
    
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        const track = publication.track;
        alert('on track')
        alert(`On track${track}`)
        document.getElementById('remote-media-div').appendChild(track.attach());
      }
    });
    
  
    participant.on('trackSubscribed', track => {
      alert('on 2track')
      alert(`On 2track${track}`)
      document.getElementById('remote-media-div').appendChild(track.attach());
    });
  
    
  
  });
 
  
  

}, error => {
  alert(`Unable to connect to Room: ${error.message}`);
});


function refresh(){
  alert('Tracklist')
  const trackList = context.trackList
  alert(trackList)

  trackList.forEach(track=>{
    alert(`Hey${track}`)
    document.getElementById('remote-media-div').appendChild(track.attach());
    alert('attached')
  });
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
}
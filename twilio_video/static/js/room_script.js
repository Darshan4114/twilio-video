const Video = Twilio.Video
// {createLocalTracks, connect} = Video;


const joinRoom = async() =>{
  const tracks = await Video.createLocalTracks();
  console.log('yeah, joinRoom')
  sessionStorage.setItem('tracks', tracks)
  const room = await Video.connect(context.person_token, {
    name: context.room_name,
    // tracks
    audio:false,
    video:false
  });
  sessionStorage.setItem('room', room)
  room.participants.forEach(participantConnected);
  room.on('participantConnected', participantConnected);

  room.on('participantDisconnected', participantDisconnected);
  room.on('disconnected', function(room, error) {
    if (error) {
      console.log('Unexpectedly disconnected:  room.on(disconnected, fun', error);
    }
    room.localParticipant.tracks.forEach(function(track) {
      console.log('Unexpectedly disconnected:  room.on(disconnected, fun')
      track.stop();
      track.detach();
    });
  });
  
  room.once('disconnected', error => room.participants.forEach(participantDisconnected));
  return [room,tracks];
}

get_room_and_tracks = joinRoom()

const toggleLocalVideo = async(room) =>{
  console.log('running toggle')
  const local_video = document.getElementById('local_video');
  const container = document.querySelector('#container');
  const localMediaContainer = document.getElementById('local_media') || container.appendChild(document.createElement('div'));
  localMediaContainer.setAttribute('id', 'local_media')

  get_room_and_tracks.then( roomAndTracks =>{
    let room = roomAndTracks[0]
    let tracks = roomAndTracks[1]

    // For DEBUG
    window.room = room
    window.tracks = tracks

    const localVideoTrack = tracks.find(track => track.kind === 'video') || Video.createLocalVideoTrack();

    if (local_video.checked === true){
      localVideoTrack.enable()
      room.localParticipant.publishTrack(localVideoTrack)
      localMediaContainer.appendChild(localVideoTrack.attach())
    }
    else if (local_video.checked !== true){
      localVideoTrack.disable()
      let mediaElements = localVideoTrack.detach();
      mediaElements.forEach(mediaElement => mediaElement.remove());
      room.localParticipant.unpublishTrack(localVideoTrack)
      localVideoTrack.detach(localMediaContainer).remove()
    }
  })
}

const disconnect = async() => {
  get_room_and_tracks.then(
    (roomAndTracks)=>{
      const room = roomAndTracks[0]
      const tracks = roomAndTracks[1]
      
      tracks.forEach(track => track.stop())
      room.localParticipant.unpublishTracks(tracks);
      tracks.forEach(track => track.detach())
      room.disconnect()
    })
}

function participantConnected(participant) {
  console.log('Participant "%s" connected', participant.identity);

  const div = document.getElementsByClassName('remote_div')[0]
  window.existing_remote_div = div

  if (!div){
    div =  document.createElement('div');
    div.setAttribute('class', 'remote_div')
    div.setAttribute('id',participant.sid)
    const container = document.querySelector('#container');
    container.appendChild(div)
    window.created_remote_div = div
  }
  div.setAttribute('id',participant.sid)

  const para = document.createElement('p');
  para.setAttribute('class', 'notifications')
  para.innerText = `${participant.identity} has connected! `
  document.body.appendChild(para);

  participant.on('trackSubscribed', track => trackSubscribed(div, track))
  participant.on('trackUnsubscribed', track=>trackUnsubscribed(track))

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  })
}

function participantDisconnected(participant) {
  participant.tracks.forEach(function(track) {
    track.detach().forEach(function(mediaElement) {
      mediaElement.remove();
    });
});
}

const trackSubscribed = (div, track) => div.appendChild(track.attach())
const trackUnsubscribed =(track)=> track.detach().forEach(element => element.remove())

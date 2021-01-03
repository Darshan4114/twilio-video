const Video = Twilio.Video

const joinRoom = async() =>{
  const tracks = await Video.createLocalTracks();

  console.log('yeah, joinRoom')
  sessionStorage.setItem('tracks', tracks)
  const room = await Video.connect(context.person_token, {
    name: context.room_name,
    audio:false,
    video:false
  });
  activateTogglers()
  sessionStorage.setItem('room', room)
  setTimer(endRoom, 120000)
  room.participants.forEach(participantConnected);
  room.on('participantConnected', participantConnected);

  room.on('participantDisconnected', participantDisconnected);
  room.on('disconnected', disconnected);
  sleep(endRoom,context.room_sid)  
  room.once('disconnected', error => room.participants.forEach(participantDisconnected));
  return [room,tracks];
}

const setTimer = async(fn, time) => {
  timer_div = document.querySelector('#timer_div')
  let date = new Date()
  timer = document.createElement('p')
  timer.setAttribute('id','timer')
  timer_div.appendChild(timer)
  let current_time = date.getTime()
  time_passed = current_time - sessionStorage.getItem('room_start_time')
  time_left = Math.floor((time-time_passed)/1000)
  while (time_left > 0){
    await sleep(1000)
    time_left -= 1
    let min = String(Math.floor(time_left/60)).padStart(2,'0')
    let sec = String(Math.floor(time_left-Math.floor(min*60))).padStart(2,'0')
    timer.textContent = `${min}:${sec}`
    time_left==0 ? fn() : console.log('Room time left', time_left)
}

}

const activateTogglers =()=>{
  const toggler_audio = document.getElementById(`toggler_audio`);
  const toggler_video = document.getElementById(`toggler_video`);
  toggler_audio.disabled = false;
  toggler_video.disabled = false;
}

get_room_and_tracks = joinRoom()


const toggleLocalTrack = async(track_kind) =>{
  console.log('running toggle')
  const toggler = document.getElementById(`toggler_${track_kind}`);
  const container = document.querySelector('#container');
  const localMediaContainer = document.getElementById('local_media')

  roomAndTracks = await get_room_and_tracks
  let room = roomAndTracks[0]
  let tracks = roomAndTracks[1]

    // For DEBUG
  window.room = room
  window.tracks = tracks
 
  const localTrack = tracks.find(track => track.kind === track_kind)

  if (toggler.checked === true){
    localTrack.enable()
    room.localParticipant.publishTrack(localTrack)
    localMediaContainer.appendChild(localTrack.attach())
  }
  else if (toggler.checked !== true){    
    if(localTrack.kind == "video"){
      video_elem = await removeVideoAsync(localMediaContainer)
    }
    localTrack.disable()
    let mediaElements = localTrack.detach();
    mediaElements.forEach(mediaElement => mediaElement.remove());
    room.localParticipant.unpublishTrack(localTrack)
}
}


const removeVideoAsync =async(localMediaContainer)=>{
  return new Promise((resolve,reject)=>{
    let video_elem =  Array.from(localMediaContainer.children).find(elem=> elem.tagName=="VIDEO")
    video_elem.addEventListener("transitionend", ()=>{
      video_elem.remove()
      resolve(video_elem)
    })
    video_elem.style.width = "0"
  })
}

const leaveRoom = async() => {
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

const disconnected = (room, error)=>{
  if (error) {
    console.log('Unexpectedly disconnected:  room.on(disconnected, fun', error);
  }
  room.localParticipant.tracks.forEach(function(track) {
    console.log('Unexpectedly disconnected:  room.on(disconnected, fun')
    track.track.stop();
    track.track.detach();
  });
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

const participantDisconnected = (participant) => {
  participant.tracks.forEach(track =>{
    if(track){
      track.track.detach().forEach(function(mediaElement) {
        mediaElement.remove();
      });
    }
});
}

const trackSubscribed = (div, track) => div.appendChild(track.attach())
const trackUnsubscribed =(track)=> track.detach().forEach(element => element.remove())


const endRoom = async() =>{
  let roomAndTracks = await get_room_and_tracks
  let room = roomAndTracks[0]
  room_sid = room.sid
  room.participants.forEach(leaveRoom)
  room = await fetch(`/end_room/${room_sid}`)
  room_data = await room.json()
  console.log('room_end, roomdata = ',room_data)
  window.location.replace('/')
}

const sleep = (delay)=> new Promise((resolve)=>setTimeout(resolve,delay))
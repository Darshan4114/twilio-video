const Video = Twilio.Video
// {createLocalTracks, connect} = Video;


const joinRoom = async() =>{
  const tracks = await Video.createLocalTracks();
  console.log('yeah, joinRoom')
  sessionStorage.setItem('tracks', tracks)
  const room = await Video.connect(context.person_token, {
    name: context.room_name,
    tracks
  });
  sessionStorage.setItem('room', room)
  room.participants.forEach(participantConnected);
  room.on('participantConnected', participantConnected);

  room.on('participantDisconnected', participantDisconnected);
  room.once('disconnected', error => room.participants.forEach(participantDisconnected));
  return [room,tracks];
}
get_room = joinRoom()
// joinRoom().then((res) =>{
//   //  var roomz = res
//   console.log('r.',res)
//   });
// room = joinRoom()
// joinRoom()

// console.log('ruum',roomz)

const toggleLocalVideo = async(room) =>{
  console.log('running toggle')
  const local_video = document.getElementById('local_video');
  const container = document.querySelector('#container');
  const localMediaContainer = document.getElementById('local_media') || container.appendChild(document.createElement('div'));
  localMediaContainer.setAttribute('id', 'local_media')

  get_room.then( roomAndTracks =>{
    let room = roomAndTracks[0]
    let tracks = roomAndTracks[1]
    window.room = room
    window.tracks = tracks
    // console.log(room)
    const localVideoTrack = tracks.find(track => track.kind === 'video') || Video.createLocalVideoTrack();

    if (local_video.checked === true){
      if (localVideoTrack.isStopped){
        console.log('yup stopped')
      }else{
        console.log('nope')
      }
      room.localParticipant.publishTrack(localVideoTrack)
      localMediaContainer.appendChild(localVideoTrack.attach())
    } else if (local_video.checked !== true){
      localVideoTrack.stop()
      console.log('lvt',localVideoTrack)
      let mediaElements = localVideoTrack.detach();
      mediaElements.forEach(mediaElement => mediaElement.remove());
      room.localParticipant.unpublishTrack(localVideoTrack)
      localVideoTrack.detach(localMediaContainer).remove()
      // console.log('tracks_after_unpublish', tracks,room)
    }
  })
  let tracks = sessionStorage.getItem('tracks').split(',')
  window.fuck = tracks
  let roomz = sessionStorage.getItem('room')
  // const localVideoTrack = tracks.find(track => track.kind === 'video');
  

}
// toggleLocalVideo()
// .then((res)=> console.log(res.localParticipant.tracks))
// console.log(jr.resolve)
// joinRoom.then((res)=>console.log(res))
// console.log(joinRoom())
// const lcl_trc =  joinRoom();
// window.lcl = lcl_trc;

// const local_video = document.getElementById('local_video');


// const localMediaContainer = document.getElementById('local_media') || container.appendChild(document.createElement('div'));
// localMediaContainer.setAttribute('id', 'local_media')

// const localVideoTrack = tracks.find(track => track.kind === 'video');


// const toggleLocalVideo = () =>{
//   if (local_video.checked === true){
//     localMediaContainer.appendChild(localVideoTrack.attach());
//   } else if (local_video.checked !== true){
//     localVideoTrack.track.stop()
//     track.detach(localMediaContainer).remove()
//   }
// }

// Video.createLocalTracks({
//   audio:true,
//   video:true
// }).then( localTracks=>{
//   return Video.connect(context.person_token, {
//         name: context.room_name,
//         // audio: {name: 'mic'},
//         enableDominantSpeaker: true,
//         // video: { name: 'camera' , width: 640 },
//         tracks:localTracks
        
//       })
// }).then(room => {
//   window.room = room
//   console.log('Connected to Room "%s"', room.name);

//   room.participants.forEach(participantConnected);
//   room.on('participantConnected', participantConnected);

//   room.on('participantDisconnected', participantDisconnected);
//   room.once('disconnected', error => room.participants.forEach(participantDisconnected));
// });



// .then(room => {
//   console.log('Connected to Room "%s"', room.name);

//   room.participants.forEach(participantConnected);
//   room.on('participantConnected', participantConnected);

//   room.on('participantDisconnected', participantDisconnected);
//   room.once('disconnected', error => room.participants.forEach(participantDisconnected));
// });

function participantConnected(participant) {
  console.log('Participant "%s" connected', participant.identity);

  const div = document.getElementsByClassName('remote_div')[0] || document.createElement('div');
  div.setAttribute('class', 'remote_div')
  div.setAttribute('id',participant.sid)
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
// const toggleLocalVideo = () => {
  

// Display camera preview.
// const localVideoTrack = tracks.find(track => track.kind === 'video');
  // const local_video = document.getElementById('local_video');
  // const container = document.querySelector('#container');
  // const localMediaContainer = document.getElementById('local_media') || container.appendChild(document.createElement('div'));
  // localMediaContainer.setAttribute('id', 'local_media')
  // Video.createLocalVideoTrack().then(track => {
  //   if (local_video.checked){
  //     alert('check')
  //     localMediaContainer.appendChild(track.attach());
      // const mudiaElements = track.detach();
      // window.mudiaElem = mudiaElements;
      
    // } else if (local_video.checked == false){
    //   alert('uncheck')
    //   window.tracj = track
    //   track.unpublish()

      // const mediaElements = track.detach(localMediaContainer);
      // window.mediaElem = mediaElements;
      // console.log(mediaElements)
      
      // mediaElements.forEach(mediaElement => mediaElement.remove());

      // track.detach(localMediaContainer).remove()
//     }
//   });
// };

// const removeLocalTrack = () =>{
  
// }

// createLocalTracks({
//   audio: true,
//   video: true
// }).then(localTracks => {
//   return connect('$TOKEN', {
//     name: 'my-room-name',
//     tracks: localTracks
//   });
// }).then(room => {
//   console.log('Connected to Room:', room.name);
//   localTracks.forEach((track)=>{
//      // hide camera after 5 seconds
//      if(track.kind === 'video'){
//        setTimeout(()=>{
//          track.disable();
//        } ,5000)  
//      }
//   }) 
// });
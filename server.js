const express = require('express');
const app = express();
const app_path = require('./util/app-path');
const path = require('path');
const fs = require('fs');
// var ffmetadata = require("ffmetadata");

const port = 3000;
const domain = 'http://localhost';
const base_url = `${domain}:${port}`;

// let musicSource = path.join('D:/Music 2018');
let musicSource = path.join('F:/Music');
// let musicSource = 'F:/Music';

let tracksData = [];
let all_tracks = [];

// adding library folder to static service
app.use(express.static(app_path.library)); // local library
app.use(express.static(app_path.pages));
app.use(express.static(musicSource));

let rec_level = 0;

scanMusicSourceAsync(musicSource, []).then((tracks)=>{
    // console.log(tracks);
    
    
}).catch(err => {
    tracksData = null;
});

app.use('/tracks', (req, res, next)=>{
    console.log('Requesting ...');
    loadTracks(all_tracks).then(()=>{
        res.json(tracksData);
    });
});

app.use('/player', (req, res, next)=>{
    res.sendFile(path.join(app_path.pages, 'player.html'));
});

// 404 handler
app.use('/', (req, res, next)=>{
    res.status(404).end();
});



app.listen(port,()=>{
    console.log(`\nMusic Service is running at: \t${domain}:${port}/tracks`);
    console.log(`Access Web Player at: \t\t${domain}:${port}/player`);
});



// scan the music source



async function scanMusicSourceAsync(dir, rel_path){
    rec_level++;
    console.log(' >> Entering ' + rec_level);
    let tracks = [];
    let fileEnts = await fs.promises.readdir( dir, {withFileTypes: true});

    fileEnts.forEach((fileEnt, index) =>{
        let file_path = path.join(dir,fileEnt.name);
        let extn = path.extname(fileEnt.name);

        // Recursive Call for internal directories
        if(fileEnt.isDirectory()){
            rel_path.push(fileEnt.name);
            scanMusicSourceAsync(path.join(dir, fileEnt.name), rel_path).then(dir_tracks =>{
                tracks.push(...dir_tracks);
                // all_tracks.push(...tracks);

                // all_tracks.push(...removeDuplicates(all_tracks, tracks));
                // all_tracks.push(...dir_tracks);

                console.log(' || Inside ' + rec_level);
                
                if(rec_level === 0){
                    //all_tracks.push(...tracks);
                }
            }).catch( err => {
                console.log(err);
            });
        }
        else 

        if(fileEnt.isFile() && extn==='.mp3'){
            // console.log(file_path);
            tracks.push({
                track_name : fileEnt.name, 
                extn: extn,
                file_path: file_path,
            });

            all_tracks.push({
                track_name : fileEnt.name, 
                extn: extn,
                file_path: file_path,
            });
            // all_tracks.push(...removeDuplicates(all_tracks, tracks));
            
        }
        
    });
    console.log(' << Exiting ' + rec_level);
    rec_level--;
    
    return tracks;
}

function removeDuplicates(dest_arr, src_arr){
    for(let i=0; i<src_arr.length; ++i){
        if(!dest_arr.includes(src_arr[i])){
            dest_arr.push(src_arr[i]);
        }
    }
    return dest_arr;
}

async function loadTracks(tracks){
    // console.log(tracks);
    processTracks(tracks, musicSource, base_url).then(processed_tracks=>{
        // console.log(processed_tracks);
        tracksData = processed_tracks;
    });
}

async function processTracks(tracks, physicalPath, virtualPath){
    // console.log(physicalPath, virtualPath);
    tracks = tracks.map((track)=>{
        return {
            track_name : track.track_name,
            extn : track.extn,
            url : track.file_path.replace(physicalPath, virtualPath).split('\\').join('//')
            // url : track.file_path
        };
    });
    return tracks;
}

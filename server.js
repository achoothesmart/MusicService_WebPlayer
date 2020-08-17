const express = require('express');
const app = express();
const app_path = require('./util/app-path');
const path = require('path');
const fs = require('fs');


const port = 3000;
const domain = 'http://localhost';
// let musicSource = 'D:/Music 2018/Singles/';
let musicSource = 'F:/Music';

// let tracksData = {};
let tracksData = [];

// adding library folder to static service
app.use(express.static(app_path.library)); // local library
app.use(express.static(app_path.pages));
app.use(express.static(musicSource));
//app.use(express.static('D:/Music 2018/')); // for external music files

scanMusicSourceAsync(musicSource, []).then((tracks)=>{
    tracksData = tracks;
}).catch(err => {
    tracksData = null;
});

app.use('/tracks', (req, res, next)=>{
    // scanMusicSource().then((tracksData)=>{
    //     res.json({ tracksData : tracksData });
    // }).catch((err)=>{
    //     res.json({ tracksData : null });
    // });

    // console.log('* calling scan music source!');
    // scanMusicSourceAsync(musicSource).then((tracks)=>{
    //     res.json({tracks : tracks});
    // }).catch(err => {
    //     res.json({ error : err });
    // });
    
    res.json(tracksData);
});

app.use('/player', (req, res, next)=>{
    res.sendFile(path.join(app_path.pages, 'player.html'));
});

// 404 handler
app.use('/', (req, res, next)=>{
    res.status(404).end();
});



app.listen(port,()=>{
    console.log(`Music Service is running at ${domain}:${port}`);
});



// scan the music source

async function scanMusicSourceAsync(dir, rel_path){
    console.log(`Scanning in ${dir}`);
    //app.use(express.static(dir));
    let tracks = [];
    let fileEnts = await fs.promises.readdir( dir, {withFileTypes: true});
    //console.log(fileEnts);
    fileEnts.forEach(fileEnt =>{
        let extn = path.extname(fileEnt.name);
        // // Recursive Call for internal directories
        // if(fileEnt.isDirectory()){
        //     console.log('directory found = ' + fileEnt.name);
        //     rel_path.push(fileEnt.name);
        //     return scanMusicSourceAsync(path.join(dir, fileEnt.name), rel_path).then(dir_tracks =>{
        //         tracks.push(...dir_tracks);
        //     }).catch( err => {
        //         console.log(err);
        //     });
        // }
        // else 

        if(fileEnt.isFile() && extn==='.mp3'){
            tracks.push({
                file_name : fileEnt.name, 
                extn: extn,
                // dir: dir,
                // url: `${domain}:${port}/${rel_path.join('/')}/${fileEnt.name}`
                url: `${domain}:${port}/${fileEnt.name}`
            });
        }
        
    });
    return tracks;
}

// function scanMusicSource(){
    
//     return new Promise((resolve, reject)=>{
//         const fs = require('fs');
//         let tracksData = {};
//         let tracks = [];

    
//         fs.readdir(musicSource, (err, files)=>{
//             if(err){
//                 console.log('Error in reading music source');
//                 console.log(err);
//                 reject(err);
//             }
//             else{
                
//                 files.forEach(file => {
//                     //console.log(file);
//                     let extn = path.extname(file);
//                     let dir = path.basename(file);
//                     if(extn === ''){
//                         // finding folders
//                         // extn = fs.lstatSync(file).isDirectory() ? 'dir' : extn;
//                         // extn = path.dirname(file);
//                     }
//                     if(extn === '.mp3'){
//                         // include only .mp3 files
//                         // tracks.push({file : file, type: extn, url: `${domain}:${port}/${file}`});
//                     }
//                     tracks.push({
//                         file : file, 
//                         type: extn, 
//                         dir: dir,
//                         url: `${domain}:${port}/${file}`
//                     });
        
//                 });
//                 tracksData.tracksCount = files.length;
//                 tracksData.tracks = tracks;
//                 resolve(tracksData);
//             }
//         });

//     });
    
// }

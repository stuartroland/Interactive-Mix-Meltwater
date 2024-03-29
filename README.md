# Interactive-Mix-Meltwater
An interactive audio-visual mix of my song Meltwater

This is an interactive song I wrote/developed. The user can change the mix of the song via mouse and/or touch inputs on the album artwork. The visuals and the audio will change in real time in response to the user input, namely where the user presses/touches the artwork. The user can change the mix to bring out different elements and explore the 2D "mix space" of the interactive song.

### Test the Project
You can now run the project online without downloading or installing anything. All you need is a modern web browser (using Firefox or Chrome is highly recommended). Test it here: https://editor.p5js.org/stuartroland/full/zSrtSz8Sn 

### Running the File on your Device
Download (and unzip) the repository and open the "index.html" file in a web browser. Firefox is highly recommended for this, as during testing other browsers were apparently much more susceptible to lag issues, which made the different tracks play out of sync, resulting in a very incoherent song.

Click or tap the image once to begin the song, then press different areas of the image to change the mix on the fly. Reload the page to start the song over.

### Creation Process
First, I made 4 different mixes of my song Meltwater (off my album The Endless Wear of Erosion, released under the name Scars of Erosion) and exported the multitracks. Then I used p5.js, a JavaScript library for creating interactive audio-visual web apps, to play the multitracks back and change their mix (and an analogous mix of layered images) on the fly according to user input. 

# UW Seattle - Undergrad Research Assistant Escape Room
## Winter 2022 - Spring 2023 VR Escape Room

## Other information

_This project represents the culmination of my research in developing a
virtual reality escape room to teach high school students computer science fundamentals
while studying at the University of Washington during my undergrad. This work is entirely my 
own, while I do give credit and acknowledge the role of my mentor PhD Edward Misback, and chair
Professor Steve Tanimoto (tanimoto@uw.edu). With their supervision and guidance, this represents
the final product of a working VR escape room visitable using the link [https://elimartian.github.io](https://elimartian.github.io/virtual-reality-escape-room/)
This link is best opened on desktop, and not mobile devices, although it does work for mobile devices. You may have to refresh a few times on your browser 
to get the room to sync correctly.

## Configuration Settings

_None. Preferrably visited through desktop to interact with the room, although
mobile support has been built into the room's functionality.

## API Key

_See apiKey.js for Croquet API key info

## Reading the Code: 

_croquet_main.js is the primary file where most of the features that create the 
VR escape room live. Croquet offers the live functionality so that if one user passes a 
challenge to "escape" some part of the room, all users will see that update to the room 
in real time using Croquet's API service. 

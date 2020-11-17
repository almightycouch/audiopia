Audiopia
========

![Cover image](http://i.imgur.com/QQMyZy5.jpg)


[Audiopia][] is a peer-to-peer music streaming platform built with modern Web Standards technologies (such as [WebSockets][] and [WebRTC][]) and APIs ([MediaSource API][], [Web Audio API][]).

No online storage
-----------------

Your songs are not stored anywhere but on your computer. Only meta-informations (title, album, artist, year, etc.) are available online.
When you listen to a song, you stream the audio content directly from an other user.

Streaming is performed by a combination of client-server access and P2P protocol between Web users.
This is done in an adaptive and transparent way in order to reduce server bandwidth costs while ensuring low latency and smooth playback for users. 


No installation required
------------------------

Audiopia is entirely built with Web Standards. For you this means no plugins or installation.
You only need one of the supported browsers listed below.

Start your browser, type the URL and you are ready to go.


No registration required
------------------------

You don't have to register to use Audiopia. Go to [audiopia.io](https://audiopia.io) and start listening to the music you love.

In fact, Audiopia is fully anonymous, our service is about music, not users.  
__Note:__ We do not collect or store any user specific information.


How it works
------------

We built our platform with [Meteor][] (a complete open source framework for building reactive web and mobile apps in pure JavaScript) and [PeerJS][] (a Javascript library which provides a complete, configurable, and easy-to-use peer-to-peer connection API).

Each time a user accesses [audiopia.io][Audiopia], he gets a new generated id from the server.
This id is used to identify each user as the owner of each song he makes available.
The id is also used to create peer-to-peer data or media stream connections between users.

When the user imports new songs, the browser analyses each file and parses its meta-informations (title, album, artist, year, etc.).
For each valid audio file loaded by the user, a new document is inserted to the server's database:

    {"title": "Come closer", "artist: "Guts", ..., "mime": "audio/m4a", "owner": "gd8FMwsTS4T4ejytg"}

The server implements a fully-reactive NoSQL database ([MongoDB][]) to keep track of available songs.
It's data is instantly reflected to every connected user (see [Meteor][] for more details).
When a user exists, the server automatically remove all of his songs on the database.

To stream a song, the browser uses the owner's identifier to create a peer-to-peer media connection ([PeerJS][]) and stream the audio file (see [WebRTC][], [Web Audio API][] and [MediaSource API][]).

Check the code for more details.


Browser support
---------------

We use a set of open standards technologies and apis which are not supported by all browsers.
Before you start, [check](//caniuse.com) if your browser supports following requirements:

* [WebSockets][]
* [WebRTC][]
* [Web Audio API][]
* [MediaSource API][]
* [Filesystem API][] (optional)
* [IndexedDB][] (optional)

License & Warranty
------------------

    Copyright (c) 2015 Mario Flach under the MIT License (MIT)
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.



[Audiopia]: //www.audiopia.io/

<!-- third-parties -->
[Meteor]: //www.meteor.com/
[PeerJS]: //www.peerjs.com/
[MongoDB]: //www.mongodb.org/

<!-- w3c web standards -->
[WebSockets]: //www.w3.org/TR/websockets/
[WebRTC]: //www.w3.org/TR/webrtc/
[Web Audio API]: //www.w3.org/TR/webaudio/
[MediaSource API]: //www.w3.org/TR/media-source/
[IndexedDB]: //www.w3.org/TR/indexeddb/
[Filesystem API]: //www.w3.org/TR/file-system-api/

# Realtime Subscriber Count

Express Server -> GET youtube analytics every x seconds
  * Server stores last known value
  * Emit socket message with last known value
Client -> listens on socket for subscriber count change
  * Displays latest subscriber count

## Server

* [x] Create Server Folder
* [x] Install express cors morgan
* [x] Setup basic express APP

* [x] Find channel statistics API endpoint
* [x] Create API Key

* [x] Call API on setTimeout
  * [x] Store last known subscriber count
    * [x] GET route to return last known subscriber count
  * [x] Send socket message with latest sub count


## Client

* [x] Setup client Vue
* [x] Get subscriber count when page loads
* [x] Listen for subscriber count changes

## Stretch

* [x] Anytime the count changes, play a sound
* [x] If subscriber count reaches 2000 rain emoji

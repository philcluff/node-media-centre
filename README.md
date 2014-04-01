# NodeJSMediaCentre

# Overview

A Chromecast Style Node.JS Media Centre Web App for Plex designed to run on a Raspberry Pi, which uses OMXPlayer as a front end.

# Screenshot

NodeJSMediaCentre with a sizable TV Library:
![alt text](http://philcluff.co.uk/drop/nodejs.png?raw=true "NodeJSMediaCentre with a sizable TV Library" =400x)

# Installing & Running

## Dependencies

* A modern version of Node.js (Tested on v0.10.24)
* A media player which can play remote files over HTTP and can be launched from a terminal. Tested:
  * VLC
  * OMXPlayer
* Plex hosted somewhere with a library of TV Shows

## Starting NodeJSMediaCentre (Required Environment Variables)
* OMX_PLAYER - Set the command and flags used when called for playback. EG: 'omxplayer '
* PLEX_SERVER - Hostname of your Plex Server
* PLEX_SERVER_PORT - Port of your Plex Server

## Installing Standalone on a Raspberry Pi

* Start with the latest Raspbian image
* Re-configure the boot image of the Pi to have atleast TODO graphics memory
* Install latest Node.js
* Install latest OMXPlayer
* Checkout NodeJSMediaCentre from Github
* Edit run script (EG: run-pi-hdmi-audio.sh) to set your player options, and Plex hostname/port

## Pre-provided helper scripts

run-pi-hdmi-audio.sh - Uses OMXPlayer, outputting audio over HDMI. A good starting point on the Raspberry Pi.
run-pi-local-audio.sh - Uses OMXPlayer, outputting audio over 3.5mm jack.
run-mac-vlc.sh - Calls VLC in the default install path on OSX. Works passibly, but keycontrol of the player doesn't work.

# TODO

Lots

# Bugs

Yep

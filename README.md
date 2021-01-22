# Hurry

An extension for Google Slides that shows time remaining.

![screenshot](/screenshot.png)

## Installation

The extension has been submitted to the the Google Chrome Store. While it is being reviewed install by hand as follows:
- Clone this repository to your local machine 
- Open chrome://extensions
- Switch to Developer Mode
- Install the extension using the "Load unpacked" button, point to the "hurry/hurry" folder. 
- Reload Google Slides

## Usage

Edit the Speaker Notes for slide 1 of your presentation. Add something like the following:

```
# time=45
# color=pink
```

This tells Hurry:
 - Your presentation will last 45 minutes. 
 - A pink progress bar will be drawn.

The attributes you can set:
 - "color" (string) : the color of the progress bar
 - "warning" (string) : the color when you are more than halfway 
 - "error" (string) : the color when you really have to hurry
 - "label" (string) : the color of the label saying how many minutes are left
 - "top" (number) : how many pixels from the top the bar is shown
 - "right" (number) : how many pixels from the right the bar is shown
 - "width" (number) : width of the progress bar
 - "height" (number) : height of the progress bar
  

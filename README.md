# Hurry

An extension for Google Slides that shows time remaining.

![screenshot](/screenshot.png)

## Installation

The extension has been submitted to the the Google Chrome Store. While it is being reviewed, you can install it by hand as follows:
- Clone this repository to your local machine 
- Open chrome://extensions
- Switch to Developer Mode
- Install the extension using the "Load unpacked" button, point to the "hurry/hurry" folder. 
- Reload Google Slides

## Usage

Edit the Speaker Notes for slide 1 of your presentation. Add something like the following:

```
# time=45
# normal=pink
# hurry=purple
```

This is equivalent to the one-liner:

```
# normal=pink time=45 hurry=purple
```

The above commands tell Hurry that:
 - Your presentation will last 45 minutes. 
 - You asked for a pink progress bar.
 - Once time is almost up, the progress bar will turn purple.

## Examples

```
Use a horizontal full-width minimal progressbar at the top.
See github.com/laffra/hurry for more details.
# time=45 width=100% height=3 left=0 top=0 normal=grey border=transparent
```

```
Use a vertical full-height progressbar at the right. 
See github.com/laffra/hurry for more details.
# time=45 height=100% width=5 right=0 top=0
```

```
# time=60 - we have an hour. See: github.com/laffra/hurry
```

## Accepted Attributes

The color attributes you can set:
 - `normal` (string, default `green`) : the color of the progress bar (up to 50%)
 - `warning` (string, default `orange`) : the color when you are halfway (>50%) 
 - `hurry` (string, default `red`) : the color when you really have to hurry (>75%)
 - `label` (string, default `grey`) : the color of the label saying how many minutes are left
 - `border` (string, default `grey`) : the color of the progress bar border (can be `transparent`)

The location attributes you can set:
 - `top` (number, default `20`) : how many pixels from the top the bar is shown
 - `bottom` (number) : how many pixels from the bottom the bar is shown
 - `left` (number) : how many pixels from the left the bar is shown
 - `right` (number, default `20`) : how many pixels from the right the bar is shown

Note that `left`/`right` and `top`/`bottom` conflict, only one can win.

The size attributes you can set:
 - `width` (number, default `200`) : width of the progress bar (can be `100%`)
 - `height` (number, default `5`) : height of the progress bar (can be `100%`)
  

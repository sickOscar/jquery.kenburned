jquery.kenburns
===============

A jQuery plugin to create fullscreen background slideshows with kenburns effect. It uses CANVAS. Based on the work of [Will McGugan](http://www.willmcgugan.com/2011/2/26/ken-burns-effect-with-javascript-and-canvas/). 

Tested only with Google Chrome.

##Installation

Include jQuery and import the plugin code as usual (better if in the footer for better performance)


    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
    <script type="text/javascript">
        // CSSTricks suggested code
        if (typeof jQuery == 'undefined') {
            document.write(unescape("%3Cscript src='jquery.min.js' type='text/javascript'%3E%3C/script%3E"));
        }
    </script>
    <script src="path/to/plugin/kenburns.min.js"></script>


Add the foolowing markup to you HTML body. The element id may change as you wish (or need)


    <canvas id="kb-container"></canvas>


Include some basic style

    #kb-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -2;
    }

##Usage

Activate the plugin on DOM ready state


    $(document).ready(function() {

        // set the dimensions of the Canvas to fullscreen
        $canvas.attr('width', $(window).width());
        $canvas.attr('height', $(window).height());

        var kb = $('#kb-container').kenburns({
            [[options]]
        });
    });


##Options

Options are available to customize the behavior of the plugin. See the demo included for further information.

####images

Array of paths of images to include. This is obviously mandatory. Order of images matters.

####display_time

The duration of the animation, i.e. how long every image stays visible on screen

####fade_time

The duration of the transition between images

####frame_per_second

This option affects performances. A value of 20 makes sure the perception of fluid animation. It is better to adjust this value considering the device.

####background_color

The fill color of the underlying canvas. (HEX value)

####zoom

Zoom value. Pretty easy.

##Methods

There are some methods available to call on the object returned from the plugin activation. 

####nextSlide()

Fades out, reset the animation and restart with the next image first.

####prevSlide()

Same as nextSlide() but with the previous image

##Resize

On resizing, the canvas stays the same dimensions. To resize the canvas you have to reset the plugin.

##Variations

It is possible to apply the plugin also to fixed-dimensions containers. Just call the plugin on a canvas of the size you want.

##TODO

+ I'd like to transform this and make it a jQuery Cycle plugin variation. Suggestions are welcome.
+ Compiled now with Codekit for MacOS. It would be great to add a build script. 

##License

The code is available on [GitHub](https://github.com/sickDevelopers/jquery.kenburned) under GPL License.


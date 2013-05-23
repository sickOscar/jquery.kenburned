jquery.kenburns
===============

A jQuery plugin to create fullscreen background slideshows with kenburns effect. It uses CANVAS. Based on the work of Will McGugan.

##Installation

Include jQuery and import the plugin code as usual (better if in the footer for better performance)


    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
    <script type="text/javascript">
        // CSSTricks suggested code
        if (typeof jQuery == 'undefined') {
            document.write(unescape("%3Cscript src='jquery.min.js' type='text/javascript'%3E%3C/script%3E"));
        }
    </script>
    <script src="../kenburns-0.1.min.js"></script>


Add the foolowing markup to you HTML body. The element id may change as you wish (or need)


    <canvas id="kb-container"></canvas>


Activate the plugin on DOM ready state


    $(document).ready(function() {
        $('#kb-container').kenburns({
            [[options]]
        });
    });


##Options

Options are available to customize the behavior of the plugin. See the demo included for further information.

####images

Array of images to include. This is obviously mandatory.


##License

The code is available on github under GPL License
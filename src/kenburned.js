/*

    Based on 
    Ken Burns effect JQuery plugin
    Copyright (C) 2011 Will McGugan http://www.willmcgugan.com
    
    Modified by Oscar Chinellato - 2013 - SickDevelopers - http://www.sickdevelopers.com/blog

    VERSION : 0.2

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

;(function($, undefined){

    $.fn.kenburned = function(options) {

        var $canvas = $(this);
        var ctx = this[0].getContext('2d');
        var start_time = null;
        var width = $canvas.width();
        var height = $canvas.height();

        var image_paths = options.images;
        var zoom_level = 1 / (options.zoom || 2);
        var clear_color = options.background_color || '#000000';

        // time values
        var display_time = options.display_time || 7000;
        var fade_time = Math.min(display_time / 2, options.fade_time || 1000);
        var solid_time = display_time - (fade_time * 2);
        var fade_ratio = fade_time - display_time;
        var frames_per_second = options.frames_per_second || 30;
        var frame_time = (1 / frames_per_second) * 1000;

        // reference to the interval
        var main_interval;

        // counter to check the first image loaded
        var load_counter = 0;

        // array of images
        var images = [];
        $(image_paths).each(function(i, image_path){
            images.push({
                path:image_path,
                initialized:false,
                loaded:false
            });
        });

        /**
         * Reset time values 
         * @return 
         */
        function reset_time_values() {
            start_time = null;

            display_time = options.display_time || 7000;
            fade_time = Math.min(display_time / 2, options.fade_time || 1000);
            solid_time = display_time - (fade_time * 2);
            fade_ratio = fade_time - display_time;
        }


        function get_time() {
            var d = new Date();
            return d.getTime() - start_time;
        }

        function interpolate_point(x1, y1, x2, y2, i) {
            // Finds a point between two other points
            return  {x: x1 + (x2 - x1) * i, y: y1 + (y2 - y1) * i};
        }

        function interpolate_rect(r1, r2, i) {
            // Blend one rect in to another
            var p1 = interpolate_point(r1[0], r1[1], r2[0], r2[1], i);
            var p2 = interpolate_point(r1[2], r1[3], r2[2], r2[3], i);
            return [p1.x, p1.y, p2.x, p2.y];
        }

        function scale_rect(r, scale) {
            // Scale a rect around its center
            var w = r[2] - r[0];
            var h = r[3] - r[1];
            var cx = (r[2] + r[0]) / 2;
            var cy = (r[3] + r[1]) / 2;
            var scalew = w * scale;
            var scaleh = h * scale;
            return [cx - scalew/2,
                    cy - scaleh/2,
                    cx + scalew/2,
                    cy + scaleh/2];
        }

        function fit(src_w, src_h, dst_w, dst_h) {
            // Finds the best-fit rect so that the destination can be covered
            // var src_a = src_w / src_h;
            var dst_a = dst_w / dst_h;
            var w = src_h * dst_a;
            var h = src_h;
            if (w > src_w)
            {
                w = src_w;
                h = src_w / dst_a;
            }
            var x = (src_w - w) / 2;
            var y = (src_h - h) / 2;
            return [x, y, x+w, y+h];
        }

        /**
         * Image Preloading
         * @param  int image_index  index in the images array fo the element to preload
         * @param  function load_callback function to call on load complete
         * @return object              image object
         */
        function get_image_info(image_index, load_callback) {
            // Gets information structure for a given index
            // Also loads the image asynchronously, if required     
            var image_info = images[image_index];
            if (!image_info.initialized) {
                var image = new Image();
                image_info.image = image;
                image_info.loaded = false;
                image.onload = function(){
                    image_info.loaded = true;
                    var iw = image.width;
                    var ih = image.height;

                    var r1 = fit(iw, ih, width, height);
                    var r2 = scale_rect(r1, zoom_level);

                    var align_x = Math.floor(Math.random() * 3) - 1;
                    var align_y = Math.floor(Math.random() * 3) - 1;
                    align_x /= 2;
                    align_y /= 2;

                    var x = r2[0];
                    r2[0] += x * align_x;
                    r2[2] += x * align_x;

                    var y = r2[1];
                    r2[1] += y * align_y;
                    r2[3] += y * align_y;

                    if (image_index % 2) {
                        image_info.r1 = r1;
                        image_info.r2 = r2;
                    }
                    else {
                        image_info.r1 = r2;
                        image_info.r2 = r1;
                    }

                    if(load_callback) {
                        load_callback();
                    }

                };
                image_info.initialized = true;
                image.src = image_info.path;
            }

            return image_info;
        }

        /**
         * Renders a frame of the animation
         * @param  {[type]} image_index [description]
         * @param  {[type]} anim        [description]
         * @param  {[type]} fade        [description]
         * @return {[type]}             [description]
         */
        function render_image(image_index, anim, fade) {

            // If rendering first image
            if(++load_counter === 1) {
                $('.preloader').fadeOut(500);
                $canvas.hide().fadeIn(2000, function() {});
            }

            // Renders a frame of the effect    
            if (anim > 1) {
                return;
            }
            var image_info = get_image_info(image_index);
            if (image_info.loaded) {
                var r = interpolate_rect(image_info.r1, image_info.r2, anim);
                var transparency = Math.min(1, fade);

                if (transparency > 0) {
                    ctx.save();
                    ctx.globalAlpha = Math.min(1, transparency);
                    ctx.drawImage(image_info.image, r[0], r[1], r[2] - r[0], r[3] - r[1], 0, 0, width, height);
                    ctx.restore();
                }
            }
        }

        /**
         * Clear canvas
         * @return {[type]} [description]
         */
        function clear() {
            // Clear the canvas
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle = clear_color;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        }

        /**
         * Updates animation
         * @return {[type]} [description]
         */
        function update() {
            // Render the next frame                                        
            var update_time = get_time();

            var top_frame = Math.floor(update_time / (display_time - fade_time));
            var frame_start_time = top_frame * (display_time - fade_time);
            var time_passed = update_time - frame_start_time;

            if (time_passed < fade_time)
            {
                var bottom_frame = top_frame - 1;
                var bottom_frame_start_time = frame_start_time - display_time + fade_time;
                var bottom_time_passed = update_time - bottom_frame_start_time;
                if (update_time < fade_time) {
                    clear();
                } else {
                    render_image(wrap_index(bottom_frame), bottom_time_passed / display_time, 1);
                }
            }

            render_image(wrap_index(top_frame), time_passed / display_time, time_passed / fade_time);

            if (options.post_render_callback) {
                options.post_render_callback($canvas, ctx);
            }

            // Pre-load the next image in the sequence, so it has loaded
            // by the time we get to it
            var preload_image = wrap_index(top_frame + 1);
            get_image_info(preload_image);
        }

        /**
         * Gets always a correct index
         * @param  {[type]} i [description]
         * @return {[type]}   [description]
         */
        function wrap_index(i) {
            return (i + images.length) % images.length;
        }

        // Pre-load the first two images then start a timer 
        get_image_info(0, function(){
            start_time = get_time();
            main_interval = setInterval(update, frame_time);
        });

        return {

            utils : {
                fadeOut: function(callback) {
                    $canvas.fadeOut(callback);
                },
                fadeIn : function() {
                    $canvas.fadeIn(1000);
                }
            },

            /**
             * Move to the next Image
             * @return {[type]} [description]
             */
            nextSlide : function() {
                var currentFrame = Math.floor(get_time() / (display_time - fade_time));
                var that = this;

                this.utils.fadeOut(function() {
                    clearInterval(main_interval);

                    // preload Images
                    get_image_info(wrap_index(currentFrame+1));

                    // rearrange array
                    var newImages = [];
                    for( var i = images.length -1; i > currentFrame; i-- ) {
                        newImages.push(images.pop());
                    }
                    newImages.reverse();
                    images = newImages.concat(images);

                    reset_time_values();

                    // restarts all over from the new image
                    start_time = get_time();
                    main_interval = setInterval(update, frame_time);

                    that.utils.fadeIn();

                });

            },


            /**
             * Move to the previous Image
             * @return {[type]} [description]
             */
            prevSlide : function() {
                var currentFrame = Math.floor(get_time() / (display_time - fade_time));
                var that = this;

                this.utils.fadeOut(function() {
                    clearInterval(main_interval);

                    // preload Images
                    get_image_info(wrap_index(currentFrame-1));

                    // rearrange array
                    var newImages = [];
                    for( var i = 0; i < wrap_index(currentFrame-1) ; i++ ) {
                        newImages.push(images.shift());
                    }
                    images = images.concat(newImages);

                    reset_time_values();

                    // restart all over from the new image
                    start_time = get_time();
                    main_interval = setInterval(update, frame_time);

                    that.utils.fadeIn();

                });
            }
        };

    };

})( jQuery, undefined );


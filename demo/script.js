/*
    Oscar Chinellato - 2013 - SickDevelopers - http://www.sickdevelopers.com/blog

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

$(document).ready(function() {

    var $canvas = $('#kb-container');


    $canvas.attr('width', $(window).width());
    $canvas.attr('height', $(window).height());

    var kb = $canvas.kenburned({
            images : [
                "http://lorempixel.com/1200/900/sports/1",
                "http://lorempixel.com/1200/900/sports/2",
                "http://lorempixel.com/1200/900/sports/3",
                "http://lorempixel.com/1200/900/sports/4",
                "http://lorempixel.com/1200/900/sports/5"
            ]
        });

    $('.prev-slide').click(function(ev) {
        ev.preventDefault();
        kb.prevSlide();
    });

    $('.next-slide').click(function(ev) {
        ev.preventDefault();
        kb.nextSlide();
    });

});
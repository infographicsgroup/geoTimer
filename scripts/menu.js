class Menu {

    constructor(map, path) {
        this.map = map;
        this.path = path
    }

    init() {

        d3.select('#menu')
            .selectAll('.slider.item input')
            .on('input', function (d) {
                var attr = d3.select(this).attr('name');
                state[attr] = this.value;
                d3.select(this.parentNode.parentNode).select('.value').text(this.value);
                map.update(state);
                path.update(state);
            });


        var coll = document.getElementById("collapsible");
        var i;


        coll.addEventListener("click", function () {

            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {

                content.style.maxHeight = null;
            } else {

                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    };
}
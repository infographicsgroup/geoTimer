class Loader {

    constructor() {

        this.dataset = null;
    }

    load(pathString) {

        let that = this;

        fetch(pathString)
            .then(function (d) {

                return d.text();
            })
            .then(function (json) {

                that.dataset = JSON.parse(json);

                let evt = new CustomEvent('loadingFinished', {});

                window.dispatchEvent(evt);
            });
    }

    getDataset() {

        return this.dataset;
    }
}
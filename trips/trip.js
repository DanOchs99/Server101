class Trip {
    constructor(username, dest, dep, ret) {
        this.username = username;
        this.dest = dest;
        this.imageURL = images[dest];
        this.dep = dep;
        this.ret = ret;
        this.tripId = uuidv4();
    }
}

module.exports = Trip;

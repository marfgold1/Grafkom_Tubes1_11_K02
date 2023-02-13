class Square {
    #tl
    #tr
    #br
    #bl
    #type
    #vertices

    constructor(p1, p2) {
        this.#tl = p1;
        this.#tr = new Point(p2.getX(), p1.getY());
        this.#br = p2;
        this.#bl = new Point(p1.getX(), p2.getY());
        this.#type = "square";
        this.#vertices = [this.#tl, this.#tr, this.#br, this.#bl];
    }

    getType() {
        return this.#type;
    }

    getPoints() {
        return this.#vertices;
    }

    getPositionArray() {
        return [
            this.#tl.toArray(), 
            this.#tr.toArray(), 
            this.#br.toArray(), 
            this.#bl.toArray()
        ].flat();
    }

    getColorArray() {
        return [
            this.#tl.getColor().toArray(),
            this.#tr.getColor().toArray(),
            this.#br.getColor().toArray(),
            this.#bl.getColor().toArray()
        ].flat();
    }

}
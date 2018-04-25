class hx_SLL {
    constructor(){
        this.head = null
        this.tail = null
    }

    enqueue(item){
        var n = new hx_Node(item)

        if(this.head == null){
            this.head = n;
            this.tail = n;
            return;
        }

        this.tail.next = n;
        this.tail = n;
        return
    }

    dequeue(){
        var n = this.head;
        if(n == null){return}
        if (this.head.next != null)
            this.head = n.next;
        return n;
    }

    show(){
        var current = this.head;
        var list = []
        if(current == null){return}
        while(current.next != null){
            list.push(current);
            current = current.next;
        }
        list.push(current);
        return list;
    }

    clear(){
        this.head = null;
    }

    isEmpty(){
        if(this.head == null || this.head == undefined)
            return true;
        return false;   
    }
}

class hx_Node {
    constructor(item){
        this.item = item;
        this.next = null;
    }    
}
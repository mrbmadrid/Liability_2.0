
class PriorityQueue{
    constructor(){
        this.elements = []
        this.heap = new Heap(function(a, b) {
            return a.priority - b.priority;
        });
    }
    
    
    push(item, priority){
        this.heap.push({
            'priority': priority,
            'item': item
        })
    }

    pop(){
        return this.heap.pop();
    }

    empty(){
        return this.heap.empty();
    }
}
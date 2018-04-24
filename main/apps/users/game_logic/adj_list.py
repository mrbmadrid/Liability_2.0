class Node(object):
	def __init__(self, id):
		self.id = id
		self.edges = []
		self.minDis = float("inf")
		self.prev = None
	def __lt__(self, other):
		return self.minDis<other.minDis
	def __gt__(self, other):
		return self.minDis>other.minDis

	def add_edge(self, edge):
		self.edges.push(edge)


class Edge(object):
	def __init__(self, destination, weight):
		self.destination = destination
		self.weight = weight
'''
Simple priority queue implementation
'''

class PriorityQueue(object):
	def __init__(self):
		self.list = []

	def push(self, item):
		Min = 0
		Max = len(self.list)-1
		mid = 0
		while not Min > Max:
			mid = int((Min+Max) / 2)
			if not item > self.list[mid] and not item < self.list[mid]:
				self.list.insert(mid, item)
				return self
			elif item < self.list[mid]:
				Min = mid + 1
			else:
				Max = mid - 1
		if item < self.list[mid]:
			self.list.insert(mid, item)
		else:
			self.list.insert(mid+1, item)
		return self

	def replace(self, remove, insert):
		self.list.remove(remove)
		self.push(insert)
		return self

	def poll(self):
		return self.list.pop(0)

'''
Returns the least cost path using Dijkstra
'''

def path(adj, source, target):
	source.minDis = 0
	node_queue = PriorityQueue()
	node_queue.push(source)
	while not len(node_queue) is 0:
		u = node_queue.poll()
		if u is target:
			shortest_path = [u]
			while not u.prev is None:
				shortest_path.append(u.prev)
				u = u.prev
			return shortest_path
		for edge in u.edges:
			v = edge.destination
			distance_through = u.minDis + edge.weight
			if distance_through < v.minDis:
				v.minDis = distance_through
				v.prev = u
				node_queue.push(v)


	



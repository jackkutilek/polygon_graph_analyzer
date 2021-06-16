function addToVertexEdgeMap(map, vertex, edge, verts) {

    let connectedEdges = map.get(vertex);
    if(connectedEdges == undefined) {
        connectedEdges = [];
        map.set(vertex, connectedEdges);
    }

    let edgeStart = verts[edge[0]];
    let edgeEnd = verts[edge[1]];
    let otherVertex = (edgeStart == vertex) ? edgeEnd : edgeStart;

    let angle = getAngleToXAxis(vertex, otherVertex);

    connectedEdges.push({edge, otherVertex, angle});
}

//get angle to the X axis
function getAngleToXAxis(start, end) {
    let dx = end[0] - start[0];
    let dy = end[1] - start[1];
    return Math.atan2(dy, dx);
}

//get angle between vectors ab and bc
function getTurnAngle(a,b,c) {
    let abdx = b[0]-a[0];
    let abdy = b[1]-a[1];
    let abLength = Math.sqrt(abdx*abdx + abdy*abdy);

    let bcdx = c[0]-b[0];
    let bcdy = c[1]-b[1];
    let bcLength = Math.sqrt(bcdx*bcdx + bcdy*bcdy);

    let dot = abdx*bcdx + abdy*bcdy;
    let cross = abdx*bcdy - abdy*bcdx;

    let angle = Math.acos(dot/abLength/bcLength);
    if(cross < 0) angle = -angle;

    return angle;
}

//shifts loop so that it starts with the minimum vertex index
function canonicalizeFaceLoop(faceLoop) {
    let min = Math.min(...faceLoop);
    let index = faceLoop.indexOf(min);
    if(index == 0)
        return faceLoop;
    else
        return faceLoop.slice(index).concat(faceLoop.slice(0,index));
}

function createFaceId(faceLoop) {
    let canonicalized = canonicalizeFaceLoop(faceLoop)  
    return canonicalized.reduce((accum, curr)=>accum+curr+",", ",")
}

// given an edge (current and next vertex), find the next edge emanating from the next vertex : O(d)
function getNextEdgeStep(vertexEdgeMap, currentVertex, nextVertex) {
    let nextAdjacency = vertexEdgeMap.get(nextVertex);
    let indexOfEdge = nextAdjacency.findIndex(edgeObj=> {
        return edgeObj.otherVertex == currentVertex;
    });
    //iterate backwards through the sorted adjacency list
    let nextIndex = (indexOfEdge + nextAdjacency.length - 1) % nextAdjacency.length;
    return nextAdjacency[nextIndex];
}

// complexity definitions:
// v = vertex count
// e = edge count
// d = max degree of graph
// total runtime complexity: v + e + v*dlogd + ed ~= vdlogd + ed
function findFaces(data) {
    let verts = data.vertices;
    let faces = [];
    let vertexEdgeMap = new Map();
    let vertexIndexMap = new Map();

    //initialize index lookup : O(v)
    verts.forEach((vertex,i)=>{
        vertexIndexMap.set(vertex, i);
    });

    //construct vertex/edge map : O(e)
    data.edges.forEach(edge=>{
        var start = verts[edge[0]];
        var end = verts[edge[1]];

        addToVertexEdgeMap(vertexEdgeMap, start, edge, verts);
        addToVertexEdgeMap(vertexEdgeMap, end, edge, verts);
    });

    //sort edges around each vertex : O(vdlogd)
    vertexEdgeMap.forEach((adjacentEdges) => {
        adjacentEdges.sort((a,b)=>{
            return a.angle - b.angle;
        });
    });

    //trace out faces : O(2ed + 2e + v ~= ed)
    //each edge will only be visited at most 4 times
    //     as part of a walked loop (the inner while loop)
    //     as part of the adjacent face's walked loop (the inner while loop)
    //     check one side to see if a loop starts there (it was already visited in a previous loop in this worst case)
    //     check the other side to see if a loop starts there (it was already visited in a previous loop in this worst case)
    //but only 2 of those times will we have to search the vertex adjacency list O(d)
    //create faceId has to iterate over each face's vertex list a few times : total ~= O(v) ignoring the constant
    vertexEdgeMap.forEach((adjacentEdges, vertex) => {
        adjacentEdges.forEach(adjacentEdge => {
            if(!adjacentEdge.visited) {
                //we haven't walked this edge yet - follow the loop and define a face!
                let face = {id:faces.length, verts:[]};
                let angleSum = 0;
                face.verts.push(vertexIndexMap.get(vertex));

                let currentVertex = vertex;
                let edgeStep = adjacentEdge;
                let nextVertex = adjacentEdge.otherVertex;
                while(nextVertex != vertex) {
                    edgeStep.visited = true;
                    face.verts.push(vertexIndexMap.get(nextVertex));

                    let nextEdgeStep = getNextEdgeStep(vertexEdgeMap, currentVertex, nextVertex);

                    let stepAngle = getTurnAngle(currentVertex, nextVertex, nextEdgeStep.otherVertex)
                    angleSum += stepAngle;

                    currentVertex = nextVertex;
                    edgeStep = nextEdgeStep;
                    nextVertex = edgeStep.otherVertex;
                }
                //mark the final edge as visited, but don't add the starting vertex again
                edgeStep.visited = true; 

                //calculate the final angle with the first edge of the loop
                let startingEdgeStep = getNextEdgeStep(vertexEdgeMap, currentVertex, nextVertex);
                let stepAngle = getTurnAngle(currentVertex, nextVertex, startingEdgeStep.otherVertex)
                angleSum += stepAngle;

                //this will fail for the 'exterior' face - we don't want that one 
                if(angleSum > 0) {
                    face.id = createFaceId(face.verts);
                    faces.push(face);
                }
            }
        });
    });

    return { faces };
}


function getEdgeKey(start, end) {
    let min = Math.min(start, end);
    let max = Math.max(start, end);
    let key = min + "|" + max;
    return key;
}

function addToEdgeFaceMap(map, key, faceId) {
    let adjacentFaces = map.get(key);
    if(adjacentFaces == undefined) {
        adjacentFaces = [];
        map.set(key, adjacentFaces);
    }

    adjacentFaces.push(faceId);
}

//given a face pair, find the other face from the one given
//if given face is not in the pair, return undefined
function getOtherFace(facePair, faceId) {
    if(!facePair)
        return undefined;
    if(facePair.length != 2)
        return undefined;
    
    if(facePair[0] == faceId)
        return facePair[1];
    else if (facePair[1] == faceId)
        return facePair[0];
    else
        return undefined;
}

// complexity definitions:
// v = vertex count
// e = edge count
// f = face count
// g = vertices in given face
// total runtime complexity: f + 2v + g => v
function findFaceNeighbors(facesData, faceId) {
    let faces = facesData.faces;
    // O(f)
    let faceSearch = faces.filter(f=>f.id == faceId);
    if(faceSearch.length != 1)
        throw "invalid faces list";
    let faceData = faceSearch[0];
    let faceLoop = faceData.verts;

    let edgeFaceMap = new Map();
    //this will visit each vertex (and a directed edge that starts there) at most twice : O(2v)
    faces.forEach(face=>{
        face.verts.forEach((startVert,index)=>{
            let nextIndex = (index+1)%face.verts.length;
            let endVert = face.verts[nextIndex];
            let key = getEdgeKey(startVert, endVert);
            addToEdgeFaceMap(edgeFaceMap, key, face.id);
        });
    });

    //iterate over each edge in the face loop and note neighbors : O(g)
    let neighbors = [];
    let addedFaces = new Set();
    faceLoop.forEach((startVert,index)=>{
        let nextIndex = (index+1)%faceLoop.length;
        let endVert = faceLoop[nextIndex];
        let key = getEdgeKey(startVert, endVert);
        let adjacentFaces = edgeFaceMap.get(key);
        let otherFace = getOtherFace(adjacentFaces, faceId);
        if(otherFace != undefined && !addedFaces.has(otherFace)) {
            neighbors.push(otherFace);
            addedFaces.add(otherFace);
        }
    });

    return neighbors;
}
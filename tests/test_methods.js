
function assertArraysEqual(a,b) {
    return a.length == b.length &&
        a.every((el,i)=>el==b[i]);
}

function assertContainsFaces(output, faces) {
    if(output.faces.length != faces.length)
        return false;
    //for every expected face
    return faces.every(face=>{
        let cface = canonicalizeFaceLoop(face);
        //output should have some face
        return output.faces.some(outputFace=>{
            //that matches the expected face
            let cOutputFace = canonicalizeFaceLoop(outputFace.verts);
            return assertArraysEqual(cface, cOutputFace);
        })
    });
}

function algorithm_1_test_method(input, expectedOutput) {
    var output = findFaces(input);
    return assertContainsFaces(output, expectedOutput);;
}


function assertContainsFaceIds(faceList, expectedFaceIds) {
    return expectedFaceIds.every(faceId=>faceList.includes(faceId));
}

function algorithm_2_test_method(graph, faceId, expectedNeighbors) {
    var faces = findFaces(graph);
    var neighbors = findFaceNeighbors(faces, faceId);
    return assertContainsFaceIds(neighbors, expectedNeighbors);
}
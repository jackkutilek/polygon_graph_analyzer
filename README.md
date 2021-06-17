# polygon_graph_analyzer

A simple library for finding interior polygon faces in a planar graph.

# The Library

[src/challenge.js](https://github.com/jackkutilek/polygon_graph_analyzer/blob/main/src/challenge.js) contains the library implmentation.

## findFaces(data)
takes an object with two arrays of number pairs: `vertices` and `edges`. For example:
```
{
  "vertices": [[0, 0], [2, 0], [2,2], [0,2]],
  "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
}
```
and returns on object with an array of faces. Each face has:
* an array of indices into the given `vertices` array, corresponding to the loop of vertices that define the face
* a unique identifying string: a comma separated list of the vertex indices, starting at the minimum index in the face loop, with commas additionally at the start and end of the string
for example:
```
{
  "faces": [ { "verts": [1, 2, 0], "id": ",0,1,2," } ]
}
```

## findFaceNeighbors(facesData, faceId)
takes the output of `findFaces` as `facesData`, and a `faceId` to identify a face to find the neighbors of <br>
and returns an array of face identifiers corresponding to the neighboring faces of the given face


# How To Run

Open index.html to see output of the main algorithm on some of the test graphs.

Open testrunner.html to see results of the included test suite.

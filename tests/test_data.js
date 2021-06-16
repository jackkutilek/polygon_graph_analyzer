function defineNumberPairs(...elements) {
    let pairs = [];
    for (let index = 0; index < elements.length; index+=2) {
        pairs.push([elements[index], elements[index+1]]);
    }
    return pairs;
}

algorithm_1_test_data = {
    square_with_diagonal: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 0,2),
            "edges": defineNumberPairs(0,1, 1,2, 0,2, 0,3, 2,3),
        },
        expected_faces: [[0,1,2],[0,2,3]],
    },
    concave_polygon: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 1.5,.5),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0),
        },
        expected_faces: [[0,1,2,3]],
    },
    concave_polygons: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 0,2, .5,1.5, 1.5,.5),
            "edges": defineNumberPairs(0,1, 1,2, 0,3, 2,3, 0,5, 5,2, 0,4, 4,2),
        },
        expected_faces: [[0,1,2,5],[0,5,2,4],[0,4,2,3]],
    },
    high_max_degree: {
        graph: {
            "vertices": defineNumberPairs(1,0, 2,0, 3,1, 3,2, 2,3, 1,3, 0,2, 0,1, 1.5, 1.5),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,4, 4,5, 5,6, 6,7, 7,0, 
                                       0,8, 1,8, 2,8, 3,8, 4,8, 5,8, 6,8, 7,8),
        },
        expected_faces: [[0,1,8],[1,2,8],[2,3,8],[3,4,8],[4,5,8],[5,6,8],[6,7,8],[7,0,8]],
    },
    both_sides_of_edge_are_in_polygon: {
        graph: {
            "vertices": defineNumberPairs(1,1, 3,1, 3,3, 1,3, 0,0, 4,0, 4,4, 0,4),
            "edges": defineNumberPairs(0,1, 1,2, 2,0, 2,3, 3,0, 1,5, 7,4, 4,5, 5,6, 6,7),
        },
        expected_faces: [[0,1,2],[0,2,3],[4,5,1,0,3,2,1,5,6,7]],
    },
    one_vertex_connected_graph: { 
        graph: {
            "vertices": defineNumberPairs(0,2, 2,2, 2,4, 0,4, 2,0, 4,0, 4,2),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0, 0,2, 1,4, 4,5, 5,6, 6,1, 4,6),
        },
        expected_faces: [[0,1,2],[0,2,3],[1,4,6],[4,5,6]],
    },
    polygon_visits_same_vertex_twice: {
        graph: {
            "vertices": defineNumberPairs(0,0, 3,0, 3,3, 0,3, 1,1, 2,2),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0, 3,4, 4,5, 5,3),
        },
        expected_faces: [[0,1,2,3,5,4,3],[3,4,5]],
    },
    single_polygon: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 0,2),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0),
        },
        expected_faces: [[0,1,2,3]],
    },
    parallel_neighboring_edges: {
        graph: {
            "vertices": defineNumberPairs(0,0, 1,0, 2,0, 2,1, 2,2, 1,2, 0,2, 0,1, 1,1),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,4, 4,5, 5,6, 6,7, 7,0, 0,8, 8,4),
        },
        expected_faces: [[0,1,2,3,4,8], [0,8,4,5,6,7]],
    },
};

algorithm_2_test_data = {
    square_with_diagonal: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 0,2),
            "edges": defineNumberPairs(0,1, 1,2, 0,2, 0,3, 2,3),
        },
        faceId: ",0,1,2,",
        expectedNeighbors: [",0,2,3,"],
    },
    multiple_neighbors: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 0,2, .5,1.5, 1.5,.5),
            "edges": defineNumberPairs(0,1, 1,2, 0,3, 2,3, 0,5, 5,2, 0,4, 4,2),
        },
        faceId: ",0,5,2,4,",
        expectedNeighbors: [",0,4,2,3,", ",0,1,2,5,"],
    },
    multiple_edges_between_faces: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 0,2, 1,1),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0, 0,4, 4,2),
        },
        faceId: ",0,1,2,4,",
        expectedNeighbors: [",0,4,2,3,"],
    },
    multiple_edges_between_faces_separated: {
        graph: {
            "vertices": defineNumberPairs(0,0, 3,0, 3,3, 0,3, 1,1, 2,1, 2,2, 1,2),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0, 0,4, 2,6, 4,5, 5,6, 6,7, 7,4),
        },
        faceId: ",0,1,2,6,5,4,",
        expectedNeighbors: [",0,4,7,6,2,3,", ",4,5,6,7,"],
    },
    no_neighbors: {
        graph: {
            "vertices": defineNumberPairs(0,0, 2,0, 2,2, 0,2),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0),
        },
        faceId: ",0,1,2,3,",
        expectedNeighbors: [],
    },
    face_is_vertex_adjacent_but_not_edge_adjacent: { 
        graph: {
            "vertices": defineNumberPairs(0,2, 2,2, 2,4, 0,4, 2,0, 4,0, 4,2),
            "edges": defineNumberPairs(0,1, 1,2, 2,3, 3,0, 0,2, 1,4, 4,5, 5,6, 6,1, 4,6),
        },
        faceId: ",0,1,2,",
        expectedNeighbors: [",0,2,3,"],
    },
};
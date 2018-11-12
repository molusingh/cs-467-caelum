// https://github.com/mourner/tinyqueue: priority queue for Djikstra's algorithm
/* global TinyQueue */
/* global grid*/

// Djikstra' algorithm
function findPath(origin, destination, isLegalMove)
{
    if (pointsEqual(origin, destination))
    {
        return { point: origin, move: 'stay' };
    }
    var squareSize = 10;
    var range = 50; // range of visibility
    var queue = new TinyQueue([], compare);
    var reached = [];
    var current = { position: origin, length: 0, prev: origin, move: 'start' };
    queue.push(current);
    while (queue.length != 0) // while not empty
    {
        current = queue.pop();
        current.reached = reached.find(findPoint) != undefined;
        if (pointsEqual(current.position, destination)) // found target
        {
            while (!pointsEqual(current.prev.position, origin)) // trace 
            {
                current = current.prev;
            }
            if (current.move == null)
            {
                console.log("ERROR!");
            }
            var path = { move: current.move, point: current.position };
            return path;
        }
        if (!current.reached)
        {
            current.reached = true;
            reached.push(current);
            addNeighbor(getNeighbor(current.position, 'left'));
            addNeighbor(getNeighbor(current.position, 'right'));
            addNeighbor(getNeighbor(current.position, 'up'));
            addNeighbor(getNeighbor(current.position, 'down'));
        }
    }
    return null; // otherwise not found

    function findPoint(element)
    {
        return pointsEqual(element.position, current.position);
    }

    function addNeighbor(neighbor)
    {
        if (!neighbor)
        {
            return;
        }
        neighbor.prev = current;
        if (!neighbor.reached && isLegalMove(neighbor.position))
        {
            neighbor.length = current.length + squareSize;
            queue.push(neighbor);
        }
    }

    function compare(a, b)
    {
        return a.length - b.length;
    }

    /*
     * gets the specified neighbor of Point
     * @param point point to get get neighbor of
     * @ direction string indicating which neighbor
     * returns neighbor Object with move and position
     * returns null if neighbor is out of bounds
     */
    function getNeighbor(point, direction)
    {
        var y = point.y;
        var x;
        var z;

        if (direction == 'left')
        {
            x = point.x;
            z = point.z + squareSize;
        }
        else if (direction == 'right')
        {
            x = point.x;
            z = point.z - squareSize;
        }
        else if (direction == 'up')
        {
            x = point.x - squareSize;
            z = point.z;
        }
        else if (direction == 'down')
        {
            x = point.x + squareSize;
            z = point.z;
        }
        else // invalid direction
        {
            return null;
        }

        var xMax = origin.x + range * squareSize;
        var zMax = origin.z + range * squareSize;
        var xMin = origin.x - range * squareSize;
        var zMin = origin.z - range * squareSize;
        if (x > xMax || x < xMin || z > zMax || z < zMin) // if out of bounds
        {
            return null;
        }
        return {
            position: new Point(x, y, z),
            move: direction
        };
    }

    function isValid(point, direction)
    {
        var target = {};
        switch (direction)
        {
            case 'up':
                target.z = point.z;
                target.x = point.x - squareSize;
                break;
            case 'left':
                target.z = point.z + squareSize;
                target.x = point.x;
                break;
            case 'down':
                target.z = point.z;
                target.x = point.x + squareSize;
                break;
            case 'right':
                target.z = point.z - squareSize;
                target.x = point.x;
                break;
            default:
                console.log('Invalid direction!');
                return false;
        }
        target.y = point.y;
        return isLegalMove(target);
    }
}

/*
 * constructor for position option
 */
function Point(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
}


/*
 * compares two points in x and z, not Y
 */
function pointsEqual(p1, p2)
{
    return (p1.x == p2.x && p1.z == p2.z);
}

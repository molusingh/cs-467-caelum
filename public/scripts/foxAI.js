/* global ObjectMover*/
/* global clock*/
/* global grid*/
/* global componentType*/
/* global findPath*/
/* global bus*/
/* global getRandomInt */
function foxAI(scene, fox) {

    // public functions
    foxAI.prototype.toggleActive = toggleActive;

    // private variables
    var active = false;
    var currentState;
    fox.userData.currentDirection = 'down';
    var foxMover = new ObjectMover(fox);
    setState(foxState.pool);
    /*
    -- subscribe
    stun
    -- check what's around you
    grid.getSquareInfo(x,z)
    -- find pray
    grid.getActorsInRadius(position(x,z), actorType)
    -- find next location 
    path.getPath(), could return either an array of points or just the next grid location
    -- must update grid after every move
    grid.updateActor(actorID)
    -- ALL functions MUST be filtered through: if(!active) return;
    */

    this.init = function () {
        fox.position.y = .1;
        var duck = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];
        //bus.subscribe('moveFox', move);
        setInterval(move, 1000);
        console.log("INIT UUID: " + fox.uuid);
    }

    function move() {
        if (!active) {
            return;
        }

        /*
        fox.position.z += 10;
        console.log(fox.uuid + "pos: " + fox.position.z);
        return;
        */
        var directions = ['up', 'down', 'left', 'right'];
        var random = getRandomInt(4) - 1;
        foxMover[directions[random]]();
        return;


        duck = grid.getActorsInRadius(fox.position, 100, componentType.duck)[0];
        //var test = new THREE.Vector3(25, 0, 25);
        //var path = findPath(fox.position, test, isLegalMove);
        var path = findPath(fox.position, duck.position, isLegalMove);
        if (path == null) // if no path move randomly
        {
            // console.log("no path found, moving randomly");
            //fox.position.z += 10;

            var random = getRandomInt(4) - 1;
            var directions = ['up', 'down', 'left', 'right'];
            if (isValid(fox.position, directions[random])) {
                fox.position.z += 10;
                console.log(fox.uuid + "pos: " + fox.position.z);
                //foxMover[directions[random]]();
            }

            return;
        }
        if (path.move == 'stay') {
            return;
        }
        if (path && isLegalMove(path.point)) {
            foxMover[path.move]();
        }
        grid.updateActor(fox);
    }


    this.setActive = function (value) {
        active = value;
    }

    function toggleActive() {
        active = !active;
    }

    function setState(newState) {
        currentState = newState;
    }

    //function spawn() {
    this.spawn = function () {

        grid.placeActor(fox);
    }

    this.getRandId = function () {
        return randId;
    }

    this.getActor = function () {
        return fox;
    }

    this.update = function () {

        if (currentState === foxState.init) {
            init();
            currentState = foxState.alive;
        }

        if (currentState === foxState.despawn) {
            fox.position.y = -100;
            active = false;
            currentState = foxState.pool;
        }

        var elapsedTime = clock.getElapsedTime();
    }

    function isLegalMove(target) {
        if (!active) {
            return false;
        }
        //var squareType = grid.getSquareInfo(-5, -5);
        var squareType = grid.getSquareInfo(target.z, target.x);
        switch (squareType) {
            case componentType.land:
            case componentType.duck:
            case componentType.duckling:
            case componentType.egg:
                return true;
        }
        return false;
    }

    function isValid(point, direction) {
        var target = {};
        switch (direction) {
            case 'up':
                target.z = point.z;
                target.x = point.x - 10;
                break;
            case 'left':
                target.z = point.z + 10;
                target.x = point.x;
                break;
            case 'down':
                target.z = point.z;
                target.x = point.x + 10;
                break;
            case 'right':
                target.z = point.z - 10;
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
